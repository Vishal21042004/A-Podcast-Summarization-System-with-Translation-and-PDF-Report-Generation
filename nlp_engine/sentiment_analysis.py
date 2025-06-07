from textblob import TextBlob

def analyze_sentiment(text):
    if not text:
        return {"polarity": 0.0, "subjectivity": 0.0}

    blob = TextBlob(text)
    sentiment = blob.sentiment
    return {
        "polarity": round(sentiment.polarity, 3),
        "subjectivity": round(sentiment.subjectivity, 3)
    }
