import whisper

def transcribe(audio_path):
    model = whisper.load_model("base")  # Can switch to "large" or "tiny" for performance/accuracy tradeoffs
    result = model.transcribe(audio_path)
    return result["text"]
