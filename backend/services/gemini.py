import os
import json
import requests
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise EnvironmentError(
        "GEMINI_API_KEY is not set. "
        "Add it to backend/.env or export it in your terminal."
    )

GEMINI_URL = (
    "https://generativelanguage.googleapis.com/v1beta/"
    "models/gemini-2.5-flash:generateContent"
)

PROMPT = """Take the following content and transform it into:

1. A 3-part Hero's Journey:
- Confusion (why it's hard)
- Struggle (explain simply)
- Breakthrough (clear understanding)

2. A short engaging educational story (2-3 minutes max):
- Slightly imaginative but still grounded
- Helps explain the concept clearly

3. A podcast-style dialogue:
- Host A (curious beginner)
- Host B (clear explainer)

Return ONLY valid JSON in this exact format, nothing else:

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
"""


def generate_script(pdf_text: str) -> dict:
    prompt = PROMPT + pdf_text

    resp = requests.post(
        f"{GEMINI_URL}?key={GEMINI_API_KEY}",
        json={
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {"temperature": 0.7, "maxOutputTokens": 8192},
        },
        timeout=60,
    )
    resp.raise_for_status()

    raw = resp.json()["candidates"][0]["content"]["parts"][0]["text"].strip()

    # Strip markdown fences if Gemini wraps the output
    if raw.startswith("```"):
        lines = raw.splitlines()
        raw = "\n".join(lines[1:-1]).strip()

    return json.loads(raw)
