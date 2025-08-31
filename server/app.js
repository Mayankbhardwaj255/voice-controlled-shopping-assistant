// server/index.js
import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

import voiceRoute from './routes/voiceRoute.js'; // note .js extension for ESM

dotenv.config();

const app = express();

// ESM __dirname replacement
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

// API route
app.use('/voice-command', voiceRoute);

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "dist"))); // frontend build folder

    app.get("/*", (req, res) => {
        res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
