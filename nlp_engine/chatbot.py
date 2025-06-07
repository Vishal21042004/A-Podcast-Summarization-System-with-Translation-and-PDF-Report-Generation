import requests
import google.generativeai as genai
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Get the API key from environment
API_KEY = os.getenv("API_KEY")
print(f"Loaded API_KEY: {API_KEY}")

# Configure the Gemini API using google.generativeai
genai.configure(api_key=API_KEY)

# Initialize the model
model = genai.GenerativeModel('gemini-1.5-flash')

GEMINI_API_KEY = "AIzaSyA6jq1UJ2BElJeiMCRfpVOInzeeJrKkFGI"
GEMINI_API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GEMINI_API_KEY}"

def get_chat_response(user_input, transcription):
    """
    Returns a Gemini-generated response based ONLY on the provided transcription.
    """
    if not transcription:
        return "No transcription context available. Please transcribe a podcast first."

    prompt = (
        "You are an intelligent assistant. "
        "Answer the user's question ONLY using the following podcast transcript. "
        "If the answer is not present, reply: 'Sorry, this information is not available in the current podcast.'\n\n"
        f"Podcast Transcript:\n{transcription}\n\n"
        f"User: {user_input}\n"
        "Answer:"
    )

    payload = {
        "contents": [
            {
                "parts": [
                    {"text": prompt}
                ]
            }
        ]
    }

    try:
        response = requests.post(
            GEMINI_API_URL,
            headers={"Content-Type": "application/json"},
            json=payload,
            timeout=30
        )
        response.raise_for_status()
        data = response.json()
        # Defensive: check for candidates and content
        if "candidates" in data and data["candidates"]:
            return data["candidates"][0]["content"]["parts"][0]["text"]
        else:
            return "Sorry, I could not generate a response."
    except Exception as e:
        print(f"[ERROR] Gemini API error: {e}")
        return "Server error."
