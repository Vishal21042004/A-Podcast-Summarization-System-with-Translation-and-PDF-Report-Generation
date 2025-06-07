import React, { useState } from 'react';
import axios from 'axios';
import './Dashboard.css';
import ReactPlayer from 'react-player';
import html2pdf from 'html2pdf.js';


const Dashboard = () => {
  const [videoUrl, setVideoUrl] = useState('');
  const [videoId, setVideoId] = useState('');
  const [transcription, setTranscription] = useState('');
  const [summary, setSummary] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [translatedSummary, setTranslatedSummary] = useState('');
  const [extracting, setExtracting] = useState(false);
  const [loadingSummarize, setLoadingSummarize] = useState(false);
  const [translatingText, setTranslatingText] = useState(false);
  const [translatingSummary, setTranslatingSummary] = useState(false);
  const [targetLanguageText, setTargetLanguageText] = useState('en');
  const [targetLanguageSummary, setTargetLanguageSummary] = useState('en');
  const [error, setError] = useState('');
  const [extracted, setExtracted] = useState(false);
  const [summarized, setSummarized] = useState(false);

  const [languages] = useState([
    { code: 'en', name: 'English' }, { code: 'hi', name: 'Hindi' }, { code: 'ta', name: 'Tamil' },
    { code: 'te', name: 'Telugu' }, { code: 'bn', name: 'Bengali' }, { code: 'ml', name: 'Malayalam' },
    { code: 'gu', name: 'Gujarati' }, { code: 'mr', name: 'Marathi' }, { code: 'ur', name: 'Urdu' },
    { code: 'pa', name: 'Punjabi' }, { code: 'kn', name: 'Kannada' }, { code: 'as', name: 'Assamese' },
    { code: 'or', name: 'Odia' }, { code: 'es', name: 'Spanish' }, { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' }, { code: 'zh', name: 'Chinese' }, { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' }, { code: 'ru', name: 'Russian' }, { code: 'ar', name: 'Arabic' },
    { code: 'pt', name: 'Portuguese' },
  ]);

  const extractVideoId = (url) => {
    const regex = /(?:https?:\/\/)?(?:www\.)?youtu(?:be\.com\/(?:watch\?v=|embed\/)|\.be\/)([\w\-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const id = extractVideoId(videoUrl);
    if (id) {
      setVideoId(id);
      setTranscription('');
      setSummary('');
      setTranslatedText('');
      setTranslatedSummary('');
      setError('');
    } else {
      setError('Invalid YouTube URL');
    }
  };

  const handleExtractText = async () => {
    setExtracting(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:5002/extract-audio-from-link', { videoUrl });
      if (response.data.success) {
        setTranscription(response.data.transcription);
        setExtracted(true); // Hide extract button after extraction
      } else {
        setError(response.data.message || 'Failed to extract transcription.');
      }
    } catch {
      setError('Server error while extracting transcription.');
    }
    setExtracting(false);
  };

  const handleSummarize = async () => {
    if (!transcription) return;
    setLoadingSummarize(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:5002/summarize-text', { text: transcription });
      if (response.data.success) {
        setSummary(response.data.summary);
        setSummarized(true); // Hide summarize button after summarization
      } else {
        setError(response.data.message || 'Summarization failed.');
      }
    } catch {
      setError('Server error during summarization.');
    }
    setLoadingSummarize(false);
  };

  const handleTranslateText = async () => {
    if (!transcription || !targetLanguageText) return;
    setTranslatingText(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:5002/translate', {
        text: transcription,
        target_language: targetLanguageText,
      });
      if (response.data.success) {
        setTranslatedText(response.data.translated_text);
      } else {
        setError(response.data.message || 'Translation failed.');
      }
    } catch {
      setError('Server error while translating transcription.');
    }
    setTranslatingText(false);
  };

  const handleTranslateSummary = async () => {
    if (!summary || !targetLanguageSummary) return;
    setTranslatingSummary(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:5002/translate', {
        text: summary,
        target_language: targetLanguageSummary,
      });
      if (response.data.success) {
        setTranslatedSummary(response.data.translated_text);
      } else {
        setError(response.data.message || 'Summary translation failed.');
      }
    } catch {
      setError('Server error while translating summary.');
    }
    setTranslatingSummary(false);
  };

  const downloadDashboardAsPDF = () => {
    const pdfContainer = document.createElement('div');
    pdfContainer.style.padding = '16px';
    pdfContainer.style.color = '#22223b';
    pdfContainer.style.fontFamily = 'Segoe UI, Arial, sans-serif';
    pdfContainer.style.background = 'linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%)';

    // Custom styles for headings, justified text, and design
    const style = `
      <style>
        .pdf-title {
          font-size: 1.3rem;
          font-weight: bold;
          text-align: center;
          margin-bottom: 1.2rem;
          color: #2563eb;
          letter-spacing: 1px;
          background: linear-gradient(90deg, #e0e7ef 60%, #f1f5f9 100%);
          padding: 0.6rem 0;
          border-radius: 8px;
          box-shadow: 0 2px 8px #cbd5e1;
        }
        .pdf-section {
          margin-bottom: 1.5rem;
          background: #f1f5f9;
          border-radius: 8px;
          padding: 1rem 1.2rem;
          box-shadow: 0 1px 4px #e0e7ef;
          page-break-inside: avoid;
        }
        .pdf-heading {
          font-size: 1.05rem;
          color: #1e293b;
          margin-bottom: 0.5rem;
          border-bottom: 1px solid #cbd5e1;
          padding-bottom: 0.2rem;
          font-weight: 600;
          letter-spacing: 0.5px;
        }
        .pdf-text {
          text-align: justify;
          font-size: 0.92rem;
          line-height: 1.6;
          margin-bottom: 0.3rem;
          color: #22223b;
        }
        .pdf-link {
          color: #2563eb;
          word-break: break-all;
          font-size: 0.92rem;
        }
        .pdf-pagebreak {
          page-break-after: always;
        }
        .pdf-footer {
          text-align: center;
          font-size: 0.85rem;
          color: #64748b;
          margin-top: 2rem;
          border-top: 1px solid #e0e7ef;
          padding-top: 0.5rem;
        }
      </style>
    `;

    pdfContainer.innerHTML = `
      ${style}
      <div class="pdf-title">🎙️ Podcast Summary Report</div>
      <div class="pdf-section">
        <div class="pdf-heading">🔗 YouTube Link</div>
        <div class="pdf-text pdf-link">${videoUrl ? `<a href="${videoUrl}">${videoUrl}</a>` : 'N/A'}</div>
      </div>
      <div class="pdf-section">
        <div class="pdf-heading">📝 Transcription</div>
        <div class="pdf-text">${transcription || 'N/A'}</div>
      </div>
      ${translatedText ? `
        <div class="pdf-section pdf-pagebreak">
          <div class="pdf-heading">🌍 Translated Transcription</div>
          <div class="pdf-text">${translatedText}</div>
        </div>
      ` : ''}
      ${summary ? `
        <div class="pdf-section pdf-pagebreak">
          <div class="pdf-heading">📌 Summary</div>
          <div class="pdf-text">${summary}</div>
        </div>
      ` : ''}
      ${translatedSummary ? `
        <div class="pdf-section pdf-pagebreak">
          <div class="pdf-heading">🌐 Translated Summary</div>
          <div class="pdf-text">${translatedSummary}</div>
        </div>
      ` : ''}
      <div class="pdf-footer">
        Generated by Podcast Summarizer | ${new Date().toLocaleDateString()}
      </div>
    `;

    html2pdf()
      .from(pdfContainer)
      .set({
        margin: 6,
        filename: 'podcast-summary.pdf',
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      })
      .save();
  };

  return (
    <div className="dashboard" id="dashboard">
      <h1 className="title">🎙️ Podcast Summarizer</h1>

      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="Paste YouTube video URL..."
          className="input"
        />
        <button type="submit" className="button">Submit</button>
      </form>

      {error && <p className="error">{error}</p>}

      {videoId && (
        <div className="video-section">
          <ReactPlayer url={`https://www.youtube.com/watch?v=${videoId}`} controls width="100%" />
          {!extracted && (
            <button onClick={handleExtractText} disabled={extracting} className="button">
              {extracting ? 'Extracting...' : 'Extract Text'}
            </button>
          )}
        </div>
      )}

      {transcription && (
        <div className="card">
          <h2>📝 Transcription</h2>
          <div className="text-box" style={{ textAlign: 'justify' }}>{transcription}</div>

          <div className="actions">
            {!summarized && (
              <button onClick={handleSummarize} disabled={loadingSummarize} className="button">
                {loadingSummarize ? 'Summarizing...' : 'Summarize'}
              </button>
            )}
          </div>

          <div className="actions">
            <label>Translate Transcription:</label>
            <select value={targetLanguageText} onChange={(e) => setTargetLanguageText(e.target.value)}>
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>{lang.name}</option>
              ))}
            </select>
            <button onClick={handleTranslateText} disabled={translatingText} className="button">
              {translatingText ? 'Translating...' : 'Translate Text'}
            </button>
          </div>

          {translatedText && (
            <div className="translated-box">
              <h3>🌍 Translated Transcription</h3>
              <div className="text-box" style={{ textAlign: 'justify' }}>{translatedText}</div>
            </div>
          )}
        </div>
      )}

      {summary && (
        <div className="summary-section">
          <div className="card">
            <h2>📌 Summary</h2>
            <div className="text-box" style={{ textAlign: 'justify' }}>{summary}</div>
          </div>

          <div className="card">
            <h2>🌐 Translated Summary</h2>
            {translatedSummary && (
              <div className="text-box" style={{ textAlign: 'justify' }}>{translatedSummary}</div>
            )}
            <label>Translate Summary:</label>
            <select value={targetLanguageSummary} onChange={(e) => setTargetLanguageSummary(e.target.value)}>
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>{lang.name}</option>
              ))}
            </select>
            <button onClick={handleTranslateSummary} disabled={translatingSummary} className="button">
              {translatingSummary ? 'Translating...' : 'Translate Summary'}
            </button>
          </div>
        </div>
      )}

      {(transcription || translatedText || summary || translatedSummary) && (
        <div className="card" style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button onClick={downloadDashboardAsPDF} className="download-button">
            📥 Download Full Report as PDF
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
