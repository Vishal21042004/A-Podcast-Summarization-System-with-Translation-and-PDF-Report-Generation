// TranslateAudio.jsx
import React from 'react';

const TranslateAudio = ({ audioUrl }) => {
  return (
    <div className="p-4 rounded-xl shadow-lg bg-white mt-4">
      <h2 className="text-xl font-bold mb-2">🎧 Translated Audio</h2>
      <audio controls className="w-full rounded-lg">
        <source src={audioUrl} type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default TranslateAudio;
