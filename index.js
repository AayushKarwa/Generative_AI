const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
// const GenAiKey = process.env.VITE_GOOGLE_GENERATIVE_AI_KEY; 
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_KEY);
console.log('API KEY: '+ process.env.GOOGLE_GENERATIVE_AI_KEY)

const constraintMessage = 'Only respond with information related to animals. If the following prompt is unrelated to animals, please dont respond and say you only have information about animals.';

// In-memory store for history
const history = [];

app.post('/generate-content', async (req, res) => {
  try {
    const { prompt } = req.body;

    // Basic validation (optional)
    if (!prompt || prompt.length < 5) {
      return res.status(400).json({ error: 'Prompt must be at least 5 characters long.' });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(`${constraintMessage} ${prompt}`);
    const response = await result.response;
    const text = await response.text();

    // Save to history
    history.push({ prompt, text });

    res.json({ text, history });
  } catch (error) {
    console.error('Error generating content:', error);
    res.status(500).json({ error: 'Failed to generate content' });
  }
});

app.get('/history', (req, res) => {
  res.json(history);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
