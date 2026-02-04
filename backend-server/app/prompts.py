"""
Prompt Templates Module.

This module contains prompt templates for LLM-based keyword extraction.
Prompts are designed to extract high-quality keywords suitable for
Obsidian backlinking.
"""


def get_system_prompt() -> str:
    return """
You are an expert content analyzer for Obsidian notes.
Your task is to extract key concepts (keywords) from the provided text for backlinking purposes.

[Rules]
1. Extract only high-level concepts, entities, or topics.
2. **IMPORTANT: Extract keywords in Korean (if the text is Korean).**
3. **IMPORTANT: Remove all postpositions (Josa) from Korean words.** (e.g., "옵시디언은" -> "옵시디언", "AI를" -> "AI")
4. Do not return generic words like "오늘", "생각", "작업".
5. Return the result strictly in JSON format: {"keywords": ["keyword1", "keyword2"]}
6. Do not include any explanation, only the JSON object.
"""

def get_user_prompt(text: str, max_keywords: int) -> str:
    return f"""
Analyze the following text and extract up to {max_keywords} most important keywords.

Text:
{text}
"""