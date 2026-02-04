from fastapi import FastAPI, HTTPException, UploadFile, File, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from app.schemas import ExtractRequest, KeywordResponse
from app.services.llm_handler import extract_keywords_from_llm
from app.services.pdf_processor import process_pdf_pipeline
import uvicorn
import os
import shutil
from dotenv import load_dotenv

load_dotenv()

# Server Configuration Constants
DEFAULT_HOST = "127.0.0.1"
DEFAULT_PORT = 5000
TEXT_MAX_LENGTH = 4000

app = FastAPI(title="Obsidian Auto-Linker Backend Server")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

@app.post("/upload-paper")
async def upload_paper(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    # 환경변수에서 내부 경로 우선 사용
    vault_path = os.getenv("OBSIDIAN_VAULT_PATH_INTERNAL", os.getenv("OBSIDIAN_VAULT_PATH"))

    os.makedirs("temp", exist_ok=True)
    temp_path = f"temp/{file.filename}"
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    background_tasks.add_task(process_pdf_pipeline, temp_path, vault_path)
    return {"status": "processing", "filename": file.filename}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5000)