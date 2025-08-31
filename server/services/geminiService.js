// utils/gemini.js
import axios from "axios";
import db from "../firebase.js"; // ✅ Ensure Firebase is already initialized

/**
 * Cleans Gemini's JSON output by removing markdown formatting like ```json ... ```
 * @param {string} text 
 * @returns {string}
 */
function cleanJsonResponse(text) {
  return text
    .replace(/```json\s*/i, "")
    .replace(/```/g, "")
    .trim();
}

/**
 * Extracts shopping intent using Gemini API
 * @param {string} userText
 * @returns {Promise<object>}
 */
export async function extractIntentFromGemini(userText) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${process.env.GEMINI_MODEL}:generateContent`;
  const apiKey = process.env.GEMINI_API_KEY;

  const prompt = `
You are a smart voice shopping assistant.

Your task:
1. Identify the intent:
   - "add_to_list": to add an item to the shopping list.
   - "remove_from_list": to remove an item.
   - "search_item": if the user is searching for a product or applying filters.

2. Extract these fields:
   - "item": the product name (singular, lowercase).
   - "quantity": default to 1 if not mentioned (only for add/remove).
   - "category": classify the item (e.g., dairy, snacks, vegetables, beverages, etc.).
   - "price": realistic unit price (number) in dollar.
   - "brand": if mentioned, else "any".
   - "size": if mentioned, else "any".
   - "price_range": only for search; object with "min" and "max". If not mentioned, set both to 0.
   - "filters": only for search intent; include keys like brand and size. If not mentioned, set both to "any".
   - "search_term": user query (e.g., "organic apple").

⚠️ Rules:
- Respond only in raw JSON. No markdown, no explanations.
- No null or undefined values.
- Quantity and price must be numbers.
- Format must strictly match the schemas below.

✅ Format 1 (add/remove):
{
  "intent": "add_to_list" | "remove_from_list",
  "item": "<item>",
  "quantity": <number>,
  "category": "<category>",
  "price": <number>,
  "brand": "<brand>",
  "size": "<size>"
}

✅ Format 2 (search):
{
  "intent": "search_item",
  "search_term": "<term take only singular form not s>",
  "filters": {
    "brand": "<brand>",
    "size": "<size>"
  },
  "price_range": {
    "min": <number>,
    "max": <number>
  }
}

If it's not a shopping-related command, respond with exactly:
"Not a shopping command."

User input: "${userText}"
The user may speak in Hindi, Marathi, Tamil, or other Indian languages. Translate to English if needed.
`;

  try {
    const response = await axios.post(
      `${url}?key=${apiKey}`,
      { contents: [{ parts: [{ text: prompt }] }] },
      { headers: { "Content-Type": "application/json" } }
    );

    console.log("🌐 Gemini Response:", JSON.stringify(response.data, null, 2));

    const rawText = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
    const cleaned = cleanJsonResponse(rawText);

    return JSON.parse(cleaned);
  } catch (err) {
    console.error("❌ Gemini Error:", err.message || err);
    throw new Error("Failed to extract intent from Gemini response.");
  }
}

/**
 * Generates text/recommendations using Gemini API
 * @param {string} promptText
 * @returns {Promise<string>}
 */
export async function generateFromGemini(promptText) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${process.env.GEMINI_MODEL}:generateContent`;
  const apiKey = process.env.GEMINI_API_KEY;

  try {
    const response = await axios.post(
      `${url}?key=${apiKey}`,
      { contents: [{ parts: [{ text: promptText }] }] },
      { headers: { "Content-Type": "application/json" } }
    );

    const raw = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
    return raw?.replace(/```json|```/g, "").trim();
  } catch (err) {
    console.error("❌ Gemini generation failed:", err.message);
    throw new Error("Gemini generation failed");
  }
}
