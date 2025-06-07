from flask import Flask, request, jsonify
from pytube import YouTube
import os
import uuid
from whisper_transcriber import transcribe_audio

app = Flask(__name__)

DOWNLOAD_FOLDER = "downloads"
os.makedirs(DOWNLOAD_FOLDER, exist_ok=True)

# Helper: Clean YouTube URL
def clean_youtube_url(url):
    from urllib.parse import urlparse, parse_qs
    parsed = urlparse(url)
    video_id = parse_qs(parsed.query).get("v", [None])[0]
    if not video_id:
        raise ValueError("Invalid YouTube URL")
    return f"https://www.youtube.com/watch?v={video_id}"

# Helper: Generate summary (basic placeholder)
def summarize_text(text, max_words=60):
    words = text.split()
    if len(words) <= max_words:
        return text
    return " ".join(words[:max_words]) + "..."

@app.route('/summarize-video', methods=['POST'])
def summarize_video():
    try:
        data = request.json
        raw_url = data.get('url')
        if not raw_url:
            return jsonify({"error": "No URL provided"}), 400

        # Step 1: Clean & validate URL
        clean_url = clean_youtube_url(raw_url)
        yt = YouTube(clean_url)

        # Step 2: Download audio
        audio_stream = yt.streams.filter(only_audio=True).first()
        if not audio_stream:
            return jsonify({"error": "No audio stream found for the video."}), 404

        filename = f"{uuid.uuid4()}.mp4"
        file_path = os.path.join(DOWNLOAD_FOLDER, filename)
        audio_stream.download(filename=file_path)

        # Step 3: Transcribe using whisper
        transcript = transcribe_audio(file_path)

        # Step 4: Summarize
        summary = summarize_text(transcript)

        # Step 5: Clean up
        os.remove(file_path)

        return jsonify({
            "transcript": transcript,
            "summary": summary
        })

    except Exception as e:
        print("Error during summarization:", str(e))
        return jsonify({"error": "Server error during summarization."}), 500

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5003, debug=True)
