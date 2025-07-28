const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Feelsync backend working!');
});

app.post('/api/message', async (req, res) => {
  const { message } = req.body;

  try {
    // Call the NLP service
    const nlpRes = await axios.post('http://localhost:7000/api/analyze', {
      text: message
    });

    const mood = nlpRes.data.mood;

    // For now: simple placeholders
    let reply;
    if (mood === "happy") {
      reply = "😊 You sound happy! Here's a book: 'The Happiness Project' & a song: 'Happy - Pharrell Williams'";
    } else if (mood === "sad") {
      reply = "😢 Feeling sad? Maybe try 'The Fault in Our Stars' & a song: 'Fix You - Coldplay'";
    } else if (mood === "adventurous") {
      reply = "🌍 Adventurous mood! Try 'Into the Wild' & a song: 'Adventure of a Lifetime - Coldplay'";
    } else {
      reply = `🤖 I think your mood is "${mood}"! We'll have custom recommendations soon.`;
    }

    res.json({ reply });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ reply: "⚠️ Could not analyze your mood!" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
