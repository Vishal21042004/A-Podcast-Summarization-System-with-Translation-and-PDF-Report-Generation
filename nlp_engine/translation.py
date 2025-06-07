# translation.py

from googletrans import Translator

def translate_text(text, target_lang='en'):
    """
    Translate the provided text to the target language.
    
    :param text: The text to be translated.
    :param target_lang: The target language for translation (default is 'en').
    :return: Translated text.
    """
    try:
        translator = Translator()
        translated = translator.translate(text, dest=target_lang)
        return translated.text
    except Exception as e:
        print(f"Error during translation: {e}")
        raise Exception("Translation failed.")
