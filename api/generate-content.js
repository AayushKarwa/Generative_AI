import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from 'dotenv';

config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_KEY);
const constraintMessage = 'Only respond with information related to animals.';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { prompt } = req.body;

      // Validation
      if (!prompt || prompt.length < 5) {
        return res.status(400).json({ error: 'Prompt must be at least 5 characters long.' });
      }

      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(`${constraintMessage} ${prompt}`);
      const response = await result.response;
      const text = await response.text();

      // Save to history (in-memory or use a database)
      const history = [];  // Consider using a database for persistence
      history.push({ prompt, text });

      res.status(200).json({ text, history });
    } catch (error) {
      console.error('Error generating content:', error);
      res.status(500).json({ error: 'Failed to generate content' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
