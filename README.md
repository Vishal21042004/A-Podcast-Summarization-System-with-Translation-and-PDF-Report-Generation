
# 🎙️ Podcast Summarization System with Translation and PDF Report Generation

This project is a full-stack application that allows users to:
- Extract audio from YouTube podcasts or uploaded videos
- Transcribe the audio to text
- Summarize the transcription
- Translate the transcription or summary into multiple languages
- Generate a downloadable PDF report
- (Optional) Chatbot: Ask questions about the podcast content

## 🚀 Features

- **YouTube/Video Audio Extraction:** Extracts audio from YouTube links or uploaded video files.
- **Transcription:** Converts audio to text using state-of-the-art models.
- **Summarization:** Generates concise summaries of the podcast.
- **Translation:** Supports translation into many Indian and international languages.
- **PDF Report:** Download a full report including original, summary, and translations.
- **Modern Dashboard:** Clean React frontend for easy interaction.
- **(Optional) Podcast Chatbot:** Ask questions about the podcast (answers are based only on the current transcript).

## 🛠️ Tech Stack

- **Frontend:** React.js
- **Backend:** Flask (Python)
- **NLP:** OpenAI Whisper, HuggingFace Transformers, Google Gemini API
- **Audio/Video:** yt-dlp, moviepy
- **PDF:** html2pdf.js
- **Speaker Diarization:** pyannote.audio (optional)
- **Translation:** Custom or Google Translate API

## 📦 Folder Structure

```
pd2/
├── frontend/         # React frontend
├── nlp_engine/       # Flask backend and NLP logic
│   ├── app.py
│   ├── chatbot.py
│   ├── translate.py
│   └── ...
├── uploads/          # (gitignored) Uploaded video files
├── audios/           # (gitignored) Extracted audio files
├── .gitignore
├── requirements.txt
└── README.md
```

## ⚡ Quick Start

### 1. Clone the repository
```sh
git clone https://github.com/YOUR_USERNAME/A-Podcast-Summarization-System-with-Translation-and-PDF-Report-Generation.git
cd A-Podcast-Summarization-System-with-Translation-and-PDF-Report-Generation
```

### 2. Backend Setup
```sh
cd nlp_engine
python -m venv .venv
.venv\Scripts\activate  # On Windows
pip install -r requirements.txt
python app.py
```

### 3. Frontend Setup
```sh
cd ../frontend
npm install
npm start
```

### 4. Open in Browser
Visit [http://localhost:3000](http://localhost:3000)

## 📝 Usage

1. **Paste a YouTube link** or upload a video.
2. **Extract** the transcription.
3. **Summarize** the content.
4. **Translate** transcription or summary as needed.
5. **Download PDF** report.
6. *(Optional)* Use the chatbot to ask questions about the podcast.

## 🗂️ .gitignore

- `uploads/` and `audios/` are ignored to prevent large files from being pushed.
- `node_modules/`, `.env`, and other system files are also ignored.


## 📄 License

This project is for educational purposes.

---

**Enjoy summarizing and translating your favorite podcasts!**
