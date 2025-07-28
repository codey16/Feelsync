const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Feelsync backend working!');
});

// Placeholder POST endpoint for chatbot
app.post('/api/message', (req, res) => {
  // In real use, analyze mood here and return book/song suggestions
  res.json({
    reply: "✨ This is where the backend will respond based on mood."
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
