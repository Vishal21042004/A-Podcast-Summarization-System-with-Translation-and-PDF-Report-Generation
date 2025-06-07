from gtts import gTTS

def generateSpeechFromText(text, output_path):
    tts = gTTS(text)
    tts.save(output_path)
