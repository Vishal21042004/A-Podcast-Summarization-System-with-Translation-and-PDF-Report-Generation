from flask import Flask, request, jsonify, send_from_directory
from moviepy.editor import VideoFileClip
import os
import uuid
import yt_dlp
import whisper
from flask_cors import CORS
import time
from transformers import pipeline
from pyannote.audio import Pipeline

from translate import translate_text, list_supported_languages  # 🔗 Import translation logic
from chatbot import get_chat_response  # Importing the chatbot response function

# Flask setup
app = Flask(__name__)
CORS(app)

# Directories
UPLOAD_FOLDER = 'uploads'
AUDIO_FOLDER = 'audios'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(AUDIO_FOLDER, exist_ok=True)

# Models
print("Device set to use cpu")
whisper_model = whisper.load_model("base")
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
diarization_pipeline = Pipeline.from_pretrained("pyannote/speaker-diarization")

# Global context
video_context = {
    "transcription": "",
    "video_url": ""
}

# Helpers
def generate_filename(extension):
    return f"{uuid.uuid4().hex}.{extension}"

def transcribe_audio(audio_path):
    try:
        if not os.path.exists(audio_path):
            raise FileNotFoundError(f"File not found: {audio_path}")
        result = whisper_model.transcribe(audio_path)
        return result["text"]
    except Exception as e:
        print(f"Transcription error: {e}")
        return ""

# Endpoints
@app.route('/extract-audio', methods=['POST'])
def extract_audio():
    print("\n========== AUDIO EXTRACTION ==========")
    print("[PROGRESS] Received request to extract audio from uploaded video.")
    if 'video' not in request.files:
        print("[ERROR] No video file provided.")
        return jsonify({"success": False, "message": "No video file provided"}), 400

    video = request.files['video']
    filename = generate_filename('mp4')
    video_path = os.path.join(UPLOAD_FOLDER, filename)
    video.save(video_path)
    print(f"[PROGRESS] Saved uploaded video as {video_path}")

    try:
        audio_filename = f"{os.path.splitext(filename)[0]}.wav"
        audio_path = os.path.join(AUDIO_FOLDER, audio_filename)

        print("[PROGRESS] Extracting audio from video...")
        t0 = time.time()
        clip = VideoFileClip(video_path)
        clip.audio.write_audiofile(audio_path)
        clip.close()
        t1 = time.time()
        print(f"[PROGRESS] Audio extracted and saved as {audio_path} (Time taken: {t1-t0:.2f} sec)")

        print("\n========== TRANSCRIPTION ==========")
        print("[PROGRESS] Starting transcription...")
        t2 = time.time()
        transcription = transcribe_audio(audio_path)
        t3 = time.time()
        print(f"[PROGRESS] Transcription completed in {t3-t2:.2f} sec")

        video_context["video_url"] = video_path
        video_context["transcription"] = transcription

        duration = VideoFileClip(video_path).duration / 60  # in minutes
        print(f"[INFO] Processed video duration: {duration:.2f} minutes")
        print("\n========== SUMMARY ==========")
        print(f"[SUMMARY] Total time for {duration:.2f} min video: Audio extraction: {t1-t0:.2f}s, Transcription: {t3-t2:.2f}s")

        print("[PROGRESS] Returning response to frontend.")
        return jsonify({
            "success": True,
            "audio_url": f"/audios/{audio_filename}",
            "transcription": transcription,
            "audio_extraction_time_sec": round(t1-t0, 2),
            "transcription_time_sec": round(t3-t2, 2),
            "video_duration_min": round(duration, 2)
        })
    except Exception as e:
        print(f"[ERROR] Audio extraction error: {e}")
        return jsonify({"success": False, "message": f"Error: {str(e)}"}), 500
    finally:
        if os.path.exists(video_path):
            try:
                os.remove(video_path)
                print(f"[PROGRESS] Cleaned up temporary video file {video_path}")
            except Exception as ex:
                print(f"[WARNING] Cleanup error (video): {ex}")

@app.route('/extract-audio-from-link', methods=['POST'])
def extract_audio_from_link():
    data = request.get_json()
    video_url = data.get('videoUrl')

    print("\n========== YOUTUBE AUDIO EXTRACTION ==========")
    if not video_url:
        print("[ERROR] No video URL provided.")
        return jsonify({"success": False, "message": "No video URL provided"}), 400

    temp_audio_basename = os.path.splitext(generate_filename(''))[0]
    audio_outtmpl = os.path.join(AUDIO_FOLDER, f"{temp_audio_basename}.%(ext)s")

    try:
        print(f"[PROGRESS] Starting download from YouTube link: {video_url}")
        t0 = time.time()
        ydl_opts = {
            'format': 'bestaudio/best',
            'outtmpl': audio_outtmpl,
            'quiet': True,
        }

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(video_url)
            audio_path = ydl.prepare_filename(info)
            duration_sec = info.get('duration', 0)
            duration_min = duration_sec / 60 if duration_sec else None

        t1 = time.time()
        print(f"[PROGRESS] Audio downloaded and saved as {audio_path} (Time taken: {t1-t0:.2f} sec)")
        if duration_min:
            print(f"[INFO] YouTube video duration: {duration_min:.2f} minutes ({duration_sec} seconds)")
        else:
            print("[INFO] Could not determine video duration.")

        print("\n========== TRANSCRIPTION ==========")
        print("[PROGRESS] Starting transcription of downloaded audio...")
        t2 = time.time()
        transcription = transcribe_audio(audio_path)
        t3 = time.time()
        print(f"[PROGRESS] Transcription completed in {t3-t2:.2f} sec")

        print("\n========== SPEAKER DIARIZATION ==========")
        print("[PROGRESS] Starting speaker diarization...")
        t4 = time.time()
        try:
            diarization = diarization_pipeline(audio_path)
            speakers = set()
            for segment, _, speaker in diarization.itertracks(yield_label=True):
                print(f"[SPEAKER] {speaker}: {segment.start:.2f}s - {segment.end:.2f}s")
                speakers.add(speaker)
            print(f"[PROGRESS] Speaker diarization completed in {time.time()-t4:.2f} sec. Speakers detected: {len(speakers)}")
        except Exception as diar_err:
            print(f"[WARNING] Diarization failed: {diar_err}")

        video_context["video_url"] = video_url
        video_context["transcription"] = transcription

        print("\n========== SUMMARY ==========")
        print(f"[SUMMARY] Total time for {duration_min:.2f} min video: Download: {t1-t0:.2f}s, Transcription: {t3-t2:.2f}s")

        return jsonify({
            "success": True,
            "audio_url": f"/audios/{os.path.basename(audio_path)}",
            "transcription": transcription,
            "audio_download_time_sec": round(t1-t0, 2),
            "transcription_time_sec": round(t3-t2, 2),
            "video_duration_min": round(duration_min, 2) if duration_min else None
        })
    except Exception as e:
        print(f"[ERROR] Link audio error: {e}")
        return jsonify({"success": False, "message": f"Error: {str(e)}"}), 500

@app.route('/summarize-text', methods=['POST'])
def summarize_text():
    print("\n========== SUMMARIZATION ==========")
    data = request.get_json()
    text = data.get('text')
    print("[PROGRESS] Received request to summarize text.")

    if not text:
        print("[ERROR] No text provided for summarization.")
        return jsonify({"success": False, "message": "No text provided"}), 400

    try:
        trimmed_text = text[:1000]
        print(f"[PROGRESS] Generating summary for {len(trimmed_text)} characters...")
        t0 = time.time()
        summary = summarizer(trimmed_text, max_length=700, min_length=400, do_sample=False)
        t1 = time.time()
        print(f"[PROGRESS] Summary generated in {t1-t0:.2f} sec.")
        print("[PROGRESS] Returning summary to frontend.")
        return jsonify({
            "success": True,
            "summary": summary[0]['summary_text'],
            "summarization_time_sec": round(t1-t0, 2)
        })
    except Exception as e:
        print(f"[ERROR] Summarization error: {e}")
        return jsonify({"success": False, "message": f"Summarization failed: {str(e)}"}), 500

@app.route('/chatbot', methods=['POST'])
def chatbot_api():
    data = request.get_json()
    user_input = data.get("user_input", "")
    transcription = data.get("transcription", "")

    print("\n========== CHATBOT ==========")
    print(f"[PROGRESS] Received chatbot request: {user_input}")

    if not user_input or not transcription:
        print("[ERROR] Missing user input or transcription.")
        return jsonify({"success": False, "message": "Missing user input or transcription."}), 400

    response = get_chat_response(user_input, transcription)
    print(f"[PROGRESS] Chatbot response: {response[:100]}...")  # Print first 100 chars

    return jsonify({"success": True, "response": response})

@app.route('/translate', methods=['POST'])
def translate():
    print("\n========== TRANSLATION ==========")
    try:
        data = request.get_json()
        print(f"[PROGRESS] Received translation request: {data}")
        
        text = data.get('text')
        target_lang = data.get('target_language')

        if not text or not target_lang:
            print("[ERROR] Text or target language not provided.")
            return jsonify({"success": False, "message": "Text or target language not provided."}), 400
        
        text = text.strip()
        print(f"[PROGRESS] Translating text to {target_lang}...")
        t0 = time.time()
        translated_text = translate_text(text, target_lang)
        t1 = time.time()
        print(f"[PROGRESS] Translation completed in {t1-t0:.2f} sec.")
        print("[PROGRESS] Returning translation to frontend.")
        return jsonify({
            "success": True,
            "translated_text": translated_text,
            "translation_time_sec": round(t1-t0, 2)
        })

    except Exception as e:
        print(f"[ERROR] Error during translation: {e}")
        return jsonify({"success": False, "message": f"Translation failed: {str(e)}"}), 500

@app.route('/generate-pdf', methods=['POST'])
def generate_pdf():
    print("\n========== PDF GENERATION ==========")
    data = request.get_json()
    print("[PROGRESS] Received request to generate PDF.")
    try:
        t0 = time.time()
        # ... your PDF generation logic ...
        t1 = time.time()
        print(f"[PROGRESS] PDF generated in {t1-t0:.2f} sec.")
        print("[PROGRESS] Returning PDF to frontend.")
        return jsonify({"success": True, "pdf_url": "your_pdf_url_here", "pdf_generation_time_sec": round(t1-t0, 2)})
    except Exception as e:
        print(f"[ERROR] PDF generation error: {e}")
        return jsonify({"success": False, "message": f"PDF generation failed: {str(e)}"}), 500

@app.route('/audios/<path:filename>')
def serve_audio(filename):
    return send_from_directory(AUDIO_FOLDER, filename)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002, debug=True)