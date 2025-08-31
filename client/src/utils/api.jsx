import axios from 'axios';

// Dynamically pick API URL based on environment
const API_URL =
  import.meta.env.MODE === 'development'
    ? import.meta.env.VITE_API_URL_DEV
    : import.meta.env.VITE_API_URL_PROD || ''; // fallback to relative path in production

export const sendVoiceCommand = async (text, lang = 'en-IN') => {
  const res = await axios.post(`${API_URL}/voice-command`, { text, lang });
  return res.data;
};
