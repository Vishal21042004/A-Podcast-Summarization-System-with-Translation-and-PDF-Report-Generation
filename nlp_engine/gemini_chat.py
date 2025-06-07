import os
import logging
import google.generativeai as genai
from dotenv import load_dotenv

# Setup logging
logging.basicConfig(level=logging.DEBUG)

load_dotenv()
API_KEY = os.getenv("API_KEY")
genai.configure(api_key=API_KEY)

model = genai.GenerativeModel('gemini-1.5-flash')

def get_gemini_response(user_input):
    try:
        response = model.generate_content(user_input)
        return response.text
    except Exception as e:
        return f"Error during Gemini API call: {str(e)}"

def get_chat_response(user_input, transcription):
    if not transcription:
        return "Context is not set yet. Please upload or extract a video first."
    if not API_KEY:
        return "Server error: API key not set. Please configure it in your environment."

    system_prompt = f"""
    You are an intelligent assistant helping users understand podcast or video content.

    Here is the transcription of the video:
    \"\"\"{transcription}\"\"\"

    Now answer the user's question based on this content:

    User: {user_input}
    """

    return get_gemini_response(system_prompt)
