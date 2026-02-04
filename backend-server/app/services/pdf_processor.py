import os
import shutil
import re
import arxiv
from app.services.llm_handler import extract_keywords_from_llm, client, MODEL_NAME

# [변경] Marker v1.0+ API 임포트
from marker.converters.pdf import PdfConverter
from marker.models import create_model_dict
from marker.output import text_from_rendered

# [변경] 모델 로드 방식 변경 (전역 변수로 한 번만 로드)
# v1.0에서는 load_all_models()가 아니라 create_model_dict()를 사용합니다.
converter = PdfConverter(
    artifact_dict=create_model_dict(),
)


async def get_arxiv_metadata(text_preview: str, filename: str):
    """
    파일명이나 텍스트 앞부분에서 Arxiv ID를 추출하여 메타데이터를 가져옵니다.
    """
    arxiv_id_match = re.search(r'(\d{4}\.\d{4,5})', filename + text_preview)
    metadata = {"title": filename, "authors": [], "published": "", "url": ""}

    if arxiv_id_match:
        try:
            search = arxiv.Search(id_list=[arxiv_id_match.group(1)])
            paper = next(search.results())
            metadata = {
                "title": paper.title,
                "authors": [a.name for a in paper.authors],
                "published": paper.published.strftime("%Y-%m-%d"),
                "url": paper.entry_id,
            }
        except:
            pass
    return metadata


async def process_pdf_pipeline(file_path: str, vault_path: str):
    assets_path = os.path.join(vault_path, "assets")
    os.makedirs(assets_path, exist_ok=True)

    # [변경] Marker v1.0 변환 로직
    # 1. 변환 실행 (PdfConverter 호출)
    rendered = converter(file_path)

    # 2. 결과 추출 (텍스트, 메타데이터, 이미지)
    # text_from_rendered 함수가 마크다운 텍스트와 이미지 딕셔너리를 반환합니다.
    full_text, _, images = text_from_rendered(rendered)

    # 3. 이미지 저장 및 링크 수정
    for img_name, img_data in images.items():
        # img_data는 PIL Image 객체이거나 바이트일 수 있음 (버전에 따라 다름)
        # Marker v1.0+에서는 보통 PIL Image 객체로 넘어옵니다.
        save_img_path = os.path.join(assets_path, img_name)
        img_data.save(save_img_path)

        # Obsidian 스타일 링크로 변경 (![image.png] -> ![[image.png]])
        # Marker는 기본적으로 마크다운 이미지 문법을 쓰므로 이를 Obsidian WikiLink로 교체
        full_text = full_text.replace(f"![]({img_name})", f"![[{img_name}]]")
        full_text = full_text.replace(f"![](images/{img_name})", f"![[{img_name}]]")

    # 4. Arxiv 메타데이터 확보
    meta = await get_arxiv_metadata(full_text[:1000], os.path.basename(file_path))

    # 5. 파일명 정리 (특수문자 제거)
    safe_title = re.sub(r'[\\/*?:"<>|]', "", meta['title'])
    safe_title = safe_title.strip() or "Untitled_Paper"
    save_path = os.path.join(vault_path, f"{safe_title}.md")

    # 6. 최종 파일 저장 (프론트매터 포함)
    with open(save_path, "w", encoding="utf-8") as f:
        f.write(f"---\n")
        f.write(f"title: \"{meta['title']}\"\n")
        f.write(f"authors: {meta['authors']}\n")
        f.write(f"url: {meta['url']}\n")
        f.write(f"date: {meta['published']}\n")
        f.write(f"---\n\n")
        f.write(f"# {meta['title']}\n\n")
        f.write(full_text)

    print(f"✅ 변환 완료: {save_path}")