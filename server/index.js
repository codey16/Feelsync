const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();


mongoose.connect('mongodb+srv://amol16:feelsync123@feelsync.tglbypc.mongodb.net/?retryWrites=true&w=majority&appName=feelsync', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));


const recSchema = new mongoose.Schema({
  mood: String,
  books: [String],
  songs: [String]
});
const recommendations = mongoose.model('recommendations', recSchema);


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

    const rec = await recommendations.findOne({ mood });
    let reply;
    if (rec) {
      // Pick a random book and song for variety
      const book = rec.books[Math.floor(Math.random() * rec.books.length)];
      const song = rec.songs[Math.floor(Math.random() * rec.songs.length)];
      reply = `Here's a book: "${book}" & a song: "${song}"`;
    } else {
      reply = `Sorry, I don't have any recommendations for "${mood}" yet!`;
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
