from transformers import pipeline

# Load summarizer and zero-shot classifier models
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")  # You can use other models for better performance
classifier = pipeline("zero-shot-classification")

# Function to summarize text
def generate_summary(text):
    try:
        # Increase max_length and min_length for a longer summary
        summary = summarizer(text, max_length=500, min_length=150, do_sample=False)  # Adjusted for a more detailed summary
        return summary[0]['summary_text']
    except Exception as e:
        raise Exception(f"Summarization failed: {str(e)}")

# Function to analyze summary for topics or intent
def analyze_summary(summary_text):
    candidate_labels = ["education", "politics", "technology", "sports", "entertainment", "health", "business", "news", "motivation", "science"]
    try:
        result = classifier(summary_text, candidate_labels)
        return {
            "labels": result["labels"],
            "scores": result["scores"]
        }
    except Exception as e:
        raise Exception(f"Analysis failed: {str(e)}")
