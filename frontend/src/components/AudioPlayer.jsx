import React, { useEffect, useRef } from 'react';

const AudioPlayer = ({ audioUrl, autoplay = false }) => {
  const audioRef = useRef();

  useEffect(() => {
    if (autoplay && audioRef.current) {
      audioRef.current.play().catch(err => {
        console.warn("Autoplay blocked:", err);
      });
    }
  }, [audioUrl, autoplay]);

  return (
    <div className="bg-white shadow-md rounded-xl p-4 mt-4">
      <h3 className="text-lg font-semibold text-center mb-2">🎧 Audio Extracted</h3>
      <audio ref={audioRef} controls className="w-full rounded-md">
        <source src={audioUrl} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default AudioPlayer;
