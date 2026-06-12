# services/nlu_service.py
import json
from groq import Groq
from config import Config

client = Groq(api_key=Config.GROQ_API_KEY)

def extract_skills(text):
    prompt = f"""
You are an NLU module for a student job agent.
Extract skills from this student description and return ONLY valid JSON, no extra text.

Student said: "{text}"

Return exactly this format:
{{
  "skills": [
    {{"name": "skill name", "level": "Beginner or Intermediate or Advanced or Expert", "score": 1-10}}
  ],
  "summary": "2 sentence profile summary",
  "recommended_roles": ["role1", "role2", "role3"],
  "strengths": ["strength1", "strength2"],
  "gaps": ["gap1", "gap2"]
}}
"""
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=600,
        temperature=0.3
    )

    raw = response.choices[0].message.content.strip()
    raw = raw.replace("```json", "").replace("```", "").strip()

    return json.loads(raw)