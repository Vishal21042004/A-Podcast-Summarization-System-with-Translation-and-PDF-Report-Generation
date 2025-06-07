
from moviepy.editor import VideoFileClip
import os

def extract_audio(video_path):
    """
    Extracts audio from a video file and saves it as a .mp3 file.

    :param video_path: Path to the input video file
    :return: Path to the saved audio file
    """
    try:
        # Load the video file
        video = VideoFileClip(video_path)

        # Extract audio from the video
        audio = video.audio

        # Define the audio output path
        audio_path = os.path.splitext(video_path)[0] + ".mp3"

        # Write audio to file
        audio.write_audiofile(audio_path)

        # Close the audio and video objects to free resources
        audio.close()
        video.close()

        return audio_path

    except Exception as e:
        raise Exception(f"Error extracting audio: {str(e)}")
