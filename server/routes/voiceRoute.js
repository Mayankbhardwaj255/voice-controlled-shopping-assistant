const express = require('express');
const router = express.Router();
const { extractIntentFromGemini, generateFromGemini } = require('../services/geminiService');

const { default: translate } = require('@vitalets/google-translate-api');

//const translate = require('googletrans').default;  // ✅ unofficial google translate

// 🎤 Voice command route with multilingual translation
router.post('/', async (req, res) => {
  try {
    const { text, lang } = req.body;

    // ✅ Translate input text to English before sending to Gemini
    let translatedText = text;
    if (lang && lang !== "en") {
      try {
        const result = await translate(text, { from: lang, to: "en" });
        translatedText = result.text;
      } catch (err) {
        console.error("❌ Translation failed, using original text:", err);
      }
    }

    let result;
    try {
      result = await extractIntentFromGemini(translatedText);
    } catch (err) {
      console.warn("❌ Gemini intent extraction failed:", err.message);
      result = { intent: 'unknown', item: null };
    }

    // ✅ Translate response back to original language
    let finalResult = result;
    if (lang && lang !== "en") {
      try {
        const translatedBack = await translate(JSON.stringify(result), { from: "en", to: lang });
        finalResult = JSON.parse(translatedBack.text);
      } catch (err) {
        console.error("⚠️ Failed to translate response, sending English:", err);
      }
    }

    res.json(finalResult);
  } catch (err) {
    console.error('❌ gemini Error:', err);
    res.status(200).json({ intent: 'unknown', item: null });
  }
});

// 📦 Recommendation route
router.post('/recommend', async (req, res) => {
  const { history } = req.body;

  const prompt = `
You are a helpful assistant. Based on the user's shopping history below, recommend 5 items they might want to buy again or are seasonally relevant or low in stock like one left or two.

Shopping history: ${JSON.stringify(history)}

Respond ONLY as a JSON array of item strings with good sentence. Example:
["hey wanna drink milk u might feel healthy ", "eat bread fill your stomach", "fresh mangoes in the house grab them","grapes are into the season smash them","have a good time to buy a new pen"]
`;

  try {
    const result = await generateFromGemini(prompt);
    const json = JSON.parse(result);
    res.json({ recommendations: json });
  } catch (err) {
    console.error('🔁 Recommendation fetch failed:', err);
    res.status(500).json({ recommendations: [] });
  }
});

module.exports = router;
