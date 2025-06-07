import whisper
import os
import torch

# Determine device: Use GPU if available
device = "cuda" if torch.cuda.is_available() else "cpu"

# Load the Whisper model globally (only once)
# Options: "tiny", "base", "small", "medium", "large"
print(f"[INFO] Loading Whisper model on {device}...")
model = whisper.load_model("base", device=device)
print("[INFO] Whisper model loaded successfully.")

def transcribe_audio(audio_path: str) -> str:
    """
    Transcribes an audio file using OpenAI's Whisper model.

    :param audio_path: Path to the audio file (.mp3/.wav/.m4a/.mp4).
    :return: Transcribed text.
    :raises: FileNotFoundError if the audio file is missing.
             RuntimeError if transcription fails.
    """
    if not os.path.exists(audio_path):
        raise FileNotFoundError(f"[ERROR] Audio file not found: {audio_path}")
    
    try:
        print(f"[INFO] Transcribing audio file: {audio_path}")
        result = model.transcribe(audio_path)
        text = result.get("text", "").strip()
        
        if not text:
            raise RuntimeError("Transcription returned empty result.")
        
        print("[INFO] Transcription completed successfully.")
        return text
    
    except Exception as e:
        print(f"[ERROR] Transcription failed: {str(e)}")
        raise RuntimeError(f"Transcription error: {str(e)}")
