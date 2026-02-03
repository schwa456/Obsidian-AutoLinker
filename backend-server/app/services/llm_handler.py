import json
import re
import os
from openai import OpenAI
from ..prompts import get_system_prompt, get_user_prompt
from ..schemas import KeywordResponse
from dotenv import load_dotenv

load_dotenv()

BASE_URL = os.getenv("LLM_BASE_URL", "http://localhost:11434/v1")
API_KEY = os.getenv("LLM_API_KEY", "ollama")
MODEL_NAME = os.getenv("LLM_MODEL_NAME", "llama3")

client = OpenAI(base_url=BASE_URL, api_key=API_KEY)

def clean_json_string(content: str) -> str:
    """
    Extract JSON string from the LLM response content.
    """
    # Remove ```json ... ``` block
    content = re.sub(r'```json\s*', '', content)
    content = re.sub(r'```', '', content)

    # Find the first and last curly braces
    match = re.search(r'\{.*\}', content, re.DOTALL)
    if match:
        return match.group()
    return content.strip()

async def extract_keywords_from_llm(text: str, max_keywords: int) -> KeywordResponse:
    try:
        response = client.chat.completions.create(
            model=MODEL_NAME,
            messages=[
                {"role": "system", "content": get_system_prompt()},
                {"role": "user", "content": get_user_prompt(text, max_keywords)}
            ],
            temperature=0.1
        )

        raw_content = response.choices[0].message.content
        print(f"[DEBUG] Raw LLM Response: {raw_content}")

        cleaned_content = clean_json_string(raw_content)
        parsed_data = json.loads(cleaned_content)

        keywords = parsed_data.get("keywords", [])

        unique_keywords = list(set(keywords))[:max_keywords]

        return KeywordResponse(keywords=unique_keywords, count=len(unique_keywords))

    except json.JSONDecodeError:
        print("[ERROR] Failed to parse JSON from LLM response. Returning empty keyword list.")
        return KeywordResponse(keywords=[], count=0)
    except Exception as e:
        print(f"[ERROR] An error occurred: {e}. Returning empty keyword list.")
        return KeywordResponse(keywords=[], count=0)