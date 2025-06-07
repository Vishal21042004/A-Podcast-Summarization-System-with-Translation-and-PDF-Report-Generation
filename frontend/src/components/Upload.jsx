import React, { useState } from 'react';
import axios from 'axios';

const Upload = () => {
  const [videoUrl, setVideoUrl] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [summary, setSummary] = useState('');

  const handleExtractAudio = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/audio/extract-audio-from-link', {
        videoUrl,
      });

      if (response.data.success) {
        setAudioUrl(response.data.audioPath);
        setSummary(response.data.summary);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to extract audio.");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Summarize Video</h2>

      <input
        type="text"
        placeholder="Enter Video URL"
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
        className="border p-2 w-full mb-4"
      />

      <button
        onClick={handleExtractAudio}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Summarize Video
      </button>

      {summary && (
        <div className="mt-4">
          <h3 className="font-semibold">Summary:</h3>
          <p>{summary}</p>
        </div>
      )}

      {audioUrl && (
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Extracted Audio:</h3>
          <audio controls>
            <source src={`http://localhost:5002${audioUrl}`} type="audio/wav" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </div>
  );
};

export default Upload;
