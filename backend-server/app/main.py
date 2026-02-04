"""
Obsidian Auto-Linker Backend Server.

This module provides a FastAPI server that exposes an endpoint for keyword extraction
using LLM services. The extracted keywords can be used for automatic backlinking
in Obsidian notes.
"""

from fastapi import FastAPI, HTTPException
from app.schemas import ExtractRequest, KeywordResponse
from app.services.llm_handler import extract_keywords_from_llm
import uvicorn
import os
from dotenv import load_dotenv

load_dotenv()

# Server Configuration Constants
DEFAULT_HOST = "127.0.0.1"
DEFAULT_PORT = 5000
TEXT_MAX_LENGTH = 4000

app = FastAPI(title="Obsidian Auto-Linker Backend Server")

@app.post("/extract", response_model=KeywordResponse)
async def extract_keywords_endpoint(request: ExtractRequest):
    """
    Extract keywords from the provided text using LLM.
    """
    if not request.text.strip():
        return KeywordResponse(keywords=[], count=0)

    truncated_text = request.text[:TEXT_MAX_LENGTH]

    result = await extract_keywords_from_llm(truncated_text, request.max_keywords)
    return result

if __name__ == "__main__":
    host = os.getenv("SERVER_HOST", DEFAULT_HOST)
    port = int(os.getenv("SERVER_PORT", DEFAULT_PORT))

    print(f"[INFO] Starting Server on {host}:{port} using model '{os.getenv('LLM_MODEL_NAME')}...'")
    uvicorn.run(app, host=host, port=port)