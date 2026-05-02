import { Router } from 'express';

const router = Router();

const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

const FALLBACK = {
  confusion: 'This topic feels overwhelming because there are so many moving parts.',
  struggle: 'Think of it like learning to ride a bike — awkward at first, but it clicks.',
  breakthrough: 'Once you see the pattern, everything starts to connect naturally.',
  story:
    'In a small village, a young student struggled to understand a great mystery. Each day she tried a new approach. On the third day, a simple analogy from an elder made it all clear.',
  dialogue: [
    { speaker: 'Host A', line: "I've heard about this but honestly have no idea where to start." },
    { speaker: 'Host B', line: "That's totally normal. Let's break it down step by step." },
    { speaker: 'Host A', line: "Okay, so what's the first thing I need to understand?" },
    { speaker: 'Host B', line: 'Start with the core idea — everything else builds on that.' },
  ],
};

function buildPrompt(text) {
  return `Take the following content and transform it into:

1. A 3-part Hero's Journey:
- Confusion (why it's hard)
- Struggle (explain simply)
- Breakthrough (clear understanding)

2. A short engaging educational story (2–3 minutes max):
- Slightly imaginative but still grounded
- Helps explain the concept clearly

3. A podcast-style dialogue:
- Host A (curious beginner)
- Host B (clear explainer)

Return ONLY valid JSON in this format:

{
  "confusion": "...",
  "struggle": "...",
  "breakthrough": "...",
  "story": "...",
  "dialogue": [
    { "speaker": "Host A", "line": "..." },
    { "speaker": "Host B", "line": "..." }
  ]
}

Content:
${text}`;
}

function parseGeminiResponse(raw) {
  // Strip markdown code fences if present
  const cleaned = raw.replace(/^```(?:json)?\n?/i, '').replace(/\n?```$/i, '').trim();
  return JSON.parse(cleaned);
}

router.post('/', async (req, res) => {
  const { text } = req.body;

  if (!text || typeof text !== 'string' || !text.trim()) {
    return res.status(400).json({ error: 'Field "text" is required.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_api_key_here') {
    console.warn('No valid GEMINI_API_KEY — returning fallback data.');
    return res.json(FALLBACK);
  }

  try {
    const response = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: buildPrompt(text) }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 8192 },
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Gemini API error ${response.status}: ${err}`);
    }

    const data = await response.json();
    const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!raw) throw new Error('Empty response from Gemini.');

    const parsed = parseGeminiResponse(raw);
    return res.json(parsed);
  } catch (err) {
    console.error('Gemini call failed:', err.message);
    return res.json({ ...FALLBACK, _fallback: true });
  }
});

export default router;
