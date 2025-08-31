const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

const voiceRoute = require('./routes/voiceRoute');

dotenv.config();
// console.log("🔑 Loaded API key:", process.env.GEMINI_API_KEY?.slice(0, 8));
const app = express();
const __dirname = path.resolve();
app.use(cors());

app.use(express.json());


app.use('/voice-command', voiceRoute);
if(process.env.NODE_ENV === "production" ){
    app.use(express.static(path.join(__dirname, "../client/dist")));

app.get("*", (req,res) => {
    res.sendFile(path.join(__dirname, "../client", "dist", "index.html"));

})
}


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
