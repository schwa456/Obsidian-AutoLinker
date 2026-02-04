"""
Pydantic Schema Definitions.

This module defines request and response models for the API endpoints.
"""

from pydantic import BaseModel, Field
from typing import List, Optional

class ExtractRequest(BaseModel):
    text: str = Field(..., description="키워드를 추출할 원본 텍스트")
    max_keywords: int = Field(5, description="추출할 최대 키워드 수")

class KeywordResponse(BaseModel):
    keywords: List[str] = Field(..., description="추출된 키워드 리스트")
    count: int = Field(..., description="추출된 키워드 개수")