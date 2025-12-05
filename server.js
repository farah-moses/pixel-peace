import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

// Load environment variables from .env.local if present
dotenv.config({ path: '.env.local' });

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.post('/api/generate', async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured on server.' });
    }

    const { conversation } = req.body;
    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Context: The user is anxious. \n${(conversation || []).join('\n')}`,
      config: {
        systemInstruction: `You are "ZenBot 2000", a helpful, retro computer assistant from 1995 designed to soothe anxiety. Keep responses short and plain text.`,
        maxOutputTokens: 100,
        temperature: 0.7,
      },
    });

    return res.json({ text: response.text || '...System processing...' });
  } catch (err) {
    console.error('API error', err);
    return res.status(500).json({ error: 'Generation failed' });
  }
});

app.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`);
});
