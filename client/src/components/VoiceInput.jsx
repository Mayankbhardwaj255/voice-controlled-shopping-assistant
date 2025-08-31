import React, { useEffect, useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import axios from 'axios';

const VoiceInput = ({ onResult }) => {
  const { transcript, resetTranscript, listening, browserSupportsSpeechRecognition } = useSpeechRecognition();
  const [selectedLang, setSelectedLang] = useState('en-IN');

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      alert("Your browser doesn't support Speech Recognition.");
    }
  }, [browserSupportsSpeechRecognition]);

  useEffect(() => {
    if (!listening && transcript) {
      handleSend();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listening]);

  const handleListen = () => {
    resetTranscript();
    SpeechRecognition.startListening({ continuous: false, language: selectedLang });
  };

  const handleSend = async () => {
      try {
        // Update the URL below to match your backend endpoint if different
        const API_URL =
  import.meta.env.MODE === 'development'
    ? import.meta.env.VITE_API_URL_DEV
    : import.meta.env.VITE_API_URL_PROD;

const res = await axios.post(`${API_URL}/voice-command`, {
  text: transcript,
  lang: selectedLang
});


        onResult(res.data);
      } catch (err) {
        console.error('❌ Failed to send to server:', err);
        alert('Failed to send to server. Please check if the backend is running and the endpoint is correct.');
      } finally {
        resetTranscript();
      }
    };

  return (
    <div className="flex flex-col items-center mt-6 space-y-6">
      {/* Language Dropdown */}
      <div className="relative w-64">
        <label className="block text-sm font-semibold text-gray-700 mb-2">🌐 Select Language</label>
        <select
          value={selectedLang}
          onChange={(e) => setSelectedLang(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-300 shadow-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 hover:shadow-lg"
        >
          <option value="en-IN">English (India)</option>
          <option value="hi-IN">Hindi (India)</option>
          <option value="es-ES">Spanish (Spain)</option>
          <option value="fr-FR">French (France)</option>
          <option value="de-DE">German</option>
          <option value="zh-CN">Chinese (Simplified)</option>
          <option value="ja-JP">Japanese</option>
        </select>
      </div>

      {/* Mic Button */}
      <button
        onClick={handleListen}
        className={`px-10 py-3 rounded-full font-medium text-white shadow-lg transition-all duration-200 ${
          listening ? 'bg-red-500 animate-pulse' : 'bg-blue-600 hover:bg-blue-700 hover:scale-105'
        }`}
      >
        {listening ? '🎤 Listening...' : '🎙️ Speak'}
      </button>

      {/* Transcript */}
      {transcript && (
        <p className="mt-4 text-gray-700 italic text-lg text-center max-w-md">
          🗣️ You said: <span className="font-semibold text-black">{transcript}</span>
        </p>
      )}
    </div>
  );
};

export default VoiceInput;
