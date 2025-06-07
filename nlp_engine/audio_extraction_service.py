import logging
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
from pytube import YouTube
from moviepy.editor import VideoFileClip
import re

app = Flask(__name__)
CORS(app)

# Set up logging for better error debugging
logging.basicConfig(level=logging.DEBUG)

UPLOAD_FOLDER = 'uploads'
AUDIO_FOLDER = 'extracted_audios'

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(AUDIO_FOLDER, exist_ok=True)

@app.route("/extract-audio-from-link", methods=["POST"])
def extract_audio_from_link():
    video_path = os.path.join(UPLOAD_FOLDER, 'temp_video_from_url.mp4')
    audio_path = os.path.join(AUDIO_FOLDER, 'extracted_audio_from_url.wav')

    try:
        data = request.get_json()
        if not data:
            return jsonify({"success": False, "message": "Invalid JSON body."}), 400

        video_url = data.get("videoUrl")
        if not video_url or "youtube.com/watch" not in video_url:
            return jsonify({"success": False, "message": "Invalid YouTube URL."}), 400

        logging.info(f"Original URL: {video_url}")
        
        # Remove the timestamp part of the URL if it exists (e.g., &t=10s)
        video_url = re.sub(r'(\&|\?)t=[\d\w]+', '', video_url)
        logging.info(f"Cleaned URL: {video_url}")
        
        # Download YouTube video using pytube
        try:
            yt = YouTube(video_url)
            stream = yt.streams.filter(progressive=True, file_extension='mp4').order_by('resolution').desc().first()
            logging.info(f"Video stream selected: {stream}")
            stream.download(output_path=UPLOAD_FOLDER, filename="temp_video_from_url.mp4")
        except Exception as e:
            logging.error(f"Error downloading video: {str(e)}")
            return jsonify({"success": False, "message": f"Error downloading video: {str(e)}"}), 500

        # Extract audio
        video = VideoFileClip(video_path)
        if video.audio is None:
            return jsonify({"success": False, "message": "No audio track found in video."}), 400

        video.audio.write_audiofile(audio_path)

        return jsonify({
            "success": True,
            "audio_url": f"/audio/{os.path.basename(audio_path)}",
            "summary": "Audio extracted successfully from YouTube link."
        })

    except Exception as e:
        logging.error(f"Error occurred while extracting audio from link: {str(e)}")
        return jsonify({"success": False, "message": f"Server error: {str(e)}"}), 500
    finally:
        if os.path.exists(video_path):
            os.remove(video_path)

@app.route('/audio/<path:filename>')
def serve_audio(filename):
    try:
        return send_from_directory(AUDIO_FOLDER, filename)
    except Exception as e:
        logging.error(f"Error serving audio: {str(e)}")
        return jsonify({"success": False, "message": f"Error serving audio: {str(e)}"}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5002)
