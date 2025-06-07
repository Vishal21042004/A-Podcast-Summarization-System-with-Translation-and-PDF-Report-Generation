import spacy

nlp = spacy.load("en_core_web_sm")  # Make sure this is installed via: python -m spacy download en_core_web_sm

def extract_named_entities(text):
    if not text:
        return []

    doc = nlp(text)
    return [{"text": ent.text, "label": ent.label_} for ent in doc.ents]
