from googletrans import Translator, LANGUAGES

def translate_text(text, target_lang):
    """
    Translates the given text into the target language using googletrans.
    Handles large text by splitting it into chunks.
    """
    translator = Translator()
    try:
        # Split text into chunks of 5000 characters (Google Translate's limit)
        chunk_size = 5000
        chunks = [text[i:i + chunk_size] for i in range(0, len(text), chunk_size)]
        translated_chunks = []

        for chunk in chunks:
            translated = translator.translate(chunk, dest=target_lang)
            translated_chunks.append(translated.text)

        # Combine all translated chunks
        return " ".join(translated_chunks)
    except Exception as e:
        print(f"[ERROR] Translation failed: {str(e)}")
        return f"Translation failed: {str(e)}"

def list_supported_languages():
    """
    Returns a list of supported languages with their codes and names.
    """
    return [{"code": k, "language": v} for k, v in LANGUAGES.items()]
