from fastapi import FastAPI, HTTPException
from schemas import ExtractRequest, KeywordResponse
from services.llm_handler import extract_keywords_from_llm
import uvicorn
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Obsidian Auto-Linker Backend Server")

@app.post("/extract", response_model=KeywordResponse)
async def extract_keywords_endpoint(request: ExtractRequest):
    """
    Extract keywords from the provided text using LLM.
    """
    if not request.text.strip():
        return KeywordResponse(keywords=[], count=0)

    truncated_text = request.text[:4000]

    result = await extract_keywords_from_llm(truncated_text, request.max_keywords)
    return result

if __name__ == "__main__":
    host = os.getenv("SERVER_HOST", "127.0.0.1")
    port = int(os.getenv("SERVER_PORT", 5000))

    print(f"[INFO] Starting Server on {host}:{port} using model '{os.getenv('LLM_MODEL_NAME')}...'")
    uvicorn.run(app, host=host, port=port)