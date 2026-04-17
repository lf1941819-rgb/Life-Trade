import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const body =
      typeof req.body === 'string'
        ? JSON.parse(req.body || '{}')
        : req.body || {};

    const prompt = body.prompt?.trim?.();

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'Missing GEMINI_API_KEY' });
    }

    const ai = new GoogleGenAI({ apiKey });

    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const text =
      result?.text ||
      result?.candidates?.[0]?.content?.parts?.map((p: any) => p.text || '').join('') ||
      '';

    if (!text) {
      return res.status(500).json({ error: 'Empty AI response' });
    }

    return res.status(200).json({ text });
  } catch (error) {
    console.error('AI route error:', error);
    return res.status(500).json({ error: 'Failed to get AI response' });
  }
}