"""
LLM Handler Module.

This module provides functions to interact with LLM services for keyword extraction.
It supports OpenAI-compatible APIs including local Ollama instances.
"""

import json
import re
import os
from openai import OpenAI
from app.prompts import get_system_prompt, get_user_prompt
from app.schemas import KeywordResponse
from dotenv import load_dotenv

load_dotenv()

# LLM Configuration Constants
BASE_URL = os.getenv("LLM_BASE_URL", "http://localhost:11434/v1")
API_KEY = os.getenv("LLM_API_KEY", "ollama")
MODEL_NAME = os.getenv("LLM_MODEL_NAME", "llama3")
DEFAULT_TEMPERATURE = 0.1

client = OpenAI(base_url=BASE_URL, api_key=API_KEY)

def clean_json_string(content: str) -> str:
    """
    Extract and clean JSON string from LLM response content.
    
    Handles common LLM output formats including markdown code blocks
    and extracts the JSON object from the response.
    
    Args:
        content: Raw LLM response that may contain markdown formatting.
        
    Returns:
        Cleaned JSON string ready for parsing.
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
    """
    Extract keywords from text using LLM.
    
    Sends the provided text to an LLM service and parses the response
    to extract relevant keywords for backlinking purposes.
    
    Args:
        text: The text content to analyze for keyword extraction.
        max_keywords: Maximum number of keywords to return.
        
    Returns:
        KeywordResponse containing extracted keywords and count.
    """
    try:
        response = client.chat.completions.create(
            model=MODEL_NAME,
            messages=[
                {"role": "system", "content": get_system_prompt()},
                {"role": "user", "content": get_user_prompt(text, max_keywords)}
            ],
            temperature=DEFAULT_TEMPERATURE
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