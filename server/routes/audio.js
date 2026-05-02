import { Router } from 'express';

const router = Router();

const VOICE_ID = 'JBFqnCBsd6RMkjVDRZzb'; // George — clear, neutral
const ELEVENLABS_URL = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`;

router.post('/', async (req, res) => {
  const { text } = req.body;

  if (!text || typeof text !== 'string' || !text.trim()) {
    return res.status(400).json({ error: 'Field "text" is required.' });
  }

  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey || apiKey === 'your_elevenlabs_key_here') {
    return res.status(503).json({ error: 'ElevenLabs API key not configured.' });
  }

  try {
    const response = await fetch(ELEVENLABS_URL, {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
        'Accept': 'audio/mpeg',
      },
      body: JSON.stringify({
        text: text.slice(0, 5000), // ElevenLabs free tier cap
        model_id: 'eleven_multilingual_v2',
        voice_settings: { stability: 0.5, similarity_boost: 0.75 },
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`ElevenLabs error ${response.status}: ${err}`);
    }

    const audioBuffer = await response.arrayBuffer();
    res.set('Content-Type', 'audio/mpeg');
    res.send(Buffer.from(audioBuffer));
  } catch (err) {
    console.error('Audio generation failed:', err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
