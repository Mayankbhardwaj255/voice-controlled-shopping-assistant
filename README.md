# 🛒 Voice Shopping Assistant

A **voice-controlled shopping assistant** built with **React**, **Express.js**, **Gemini 2.5 Pro**, and **Firebase**.  
Users can add, remove, and search for grocery items using **natural language voice commands** — now with **multilingual support** and personalized smart recommendations!

---

## ⚙️ Tech Stack

### 🖥️ Frontend (`client/`)
- **React + Vite**
- `react-speech-recognition` for voice input
- **Gemini 2.5 Pro** for intent recognition
- **Firebase Hosting** for deployment
- **Multilingual support** for global users

### 🗄️ Backend (`server/`)
- **Node.js + Express**
- **Gemini 2.5 Pro API** for natural language understanding
- **Firebase Firestore** for database:
  - `live_shopping_list` → current items
  - `shopping_history` → all-time log
- Hosted on **Render**

---

## ✨ Features

- 🎙️ Voice input with microphone
- 🌍 Multilingual command recognition
- 🤖 Gemini AI understands natural language:
  - “Add 2 packs of oats”
  - “Remove one apple”
  - “Do I have milk?”
- 📋 Real-time shopping list sync
- 🎯 Personalized suggestions based on shopping history
- 🔍 Search by brand, size, category, price
- 🔁 Data persists using Firebase Firestore

---

## 📁 Project Structure

```
voice-shopping-assistant/
│
├── client/               # React Frontend
│   ├── src/
│   ├── public/
│   └── vite.config.js
│
└── server/               # Express Backend
    ├── app.js
    ├── routes/
    ├── controllers/
    └── utils/
```

---

## 🛠️ Setup Instructions

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Mayankbhardwaj255/voice-controlled-shopping-assistant.git .
```

---

### 2️⃣ Install Dependencies

#### Install Server Dependencies

```bash
cd server
npm install
```

#### Install Client Dependencies

```bash
cd ../client
npm install
```

---

### 3️⃣ Environment Variables Setup

#### 🔐 `client/.env` (only keys shown)

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
```

#### 🔐 `server/.env` (only keys shown)

```env
GEMINI_API_KEY=
GEMINI_MODEL=
PORT=

FIREBASE_TYPE=
FIREBASE_PROJECT_ID=
FIREBASE_PRIVATE_KEY_ID=
FIREBASE_PRIVATE_KEY=
FIREBASE_CLIENT_EMAIL=
FIREBASE_CLIENT_ID=
FIREBASE_AUTH_URI=
FIREBASE_TOKEN_URI=
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=
FIREBASE_CLIENT_X509_CERT_URL=
```

> ⚠️ Make sure you **do not push actual values** of the `.env` files to GitHub.

---

### 4️⃣ Start the Application

#### Start the Backend Server

```bash
cd server
node app.js
```

#### Start the Frontend

```bash
cd ../client
npm run dev
```

---

## 🔧 Firebase Firestore Setup (For Data Storage)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use existing)
3. Navigate to **Firestore Database**
4. Click "Create database" → Start in test mode (or secure it later)
5. Create two collections:
   - `live_shopping_list`
   - `shopping_history`
6. Generate a Firebase Admin SDK private key for backend and paste credentials in `.env`
7. From Project Settings > General:
   - Use `Web API Key`, `Auth Domain`, and other config values in `client/.env`

✅ Done! Your project is now ready to store and retrieve data using Firebase.

---

## 📄 License

This project is licensed under the **MIT License**.  
Feel free to use, modify, and contribute!

---

## 🔗 Connect with Me

- **GitHub**: [Mayankbhardwaj255](https://github.com/Mayankbhardwaj255)
- **LinkedIn**: [www.linkedin.com/in/mayank-bhardwaj-3a5904276](https://www.linkedin.com/in/mayank-bhardwaj-3a5904276)

---

<p align="center"><b>Made with ❤️ using React, Firebase & Gemini AI</b></p>
