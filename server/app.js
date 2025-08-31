// server/index.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

const voiceRoute = require('./routes/voiceRoute');

dotenv.config();

const app = express();
const __dirname = path.resolve();

app.use(cors());
app.use(express.json());

// API route
app.use('/voice-command', voiceRoute);

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "dist"))); // frontend build folder

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
