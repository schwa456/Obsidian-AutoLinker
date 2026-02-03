# Obsidian Auto-Linker with Local LLM

이 프로젝트는 로컬 LLM(Ollama, vLLM 등)을 활용하여 Obsidian 노트의 내용을 분석하고, 핵심 키워드를 추출하여 자동으로 **백링크([[Keyword]])**를 생성해주는 플러그인 시스템입니다.

## 🚀 Key Features

* **Privacy First:** 외부 API가 아닌 로컬 LLM을 사용하므로 데이터가 외부로 유출되지 않습니다.
* **Korean Optimized:** 한국어의 조사(은/는/이/가)를 제거하고 원형 키워드만 추출하도록 최적화된 프롬프트를 사용합니다.
* **Resource Efficient:** 무거운 LLM 연산은 Python 백엔드에서 처리하고, 옵시디언은 가볍게 유지합니다.
* **Idempotency:** 이미 링크가 걸려 있거나 태그(#)인 단어는 중복 처리하지 않습니다.

## 🏗️ Architecture

1.  **Frontend (Obsidian Plugin):** TypeScript 기반. 사용자 요청을 받아 Backend로 전송하고, 응답받은 키워드로 문서를 수정합니다.
2.  **Backend (Python FastAPI):** LLM과 통신하며 프롬프트 엔지니어링을 적용해 정확한 JSON 포맷의 키워드를 추출합니다.
3.  **Local LLM:** Ollama 또는 vLLM 등을 통해 호스팅된 모델 (Llama 3, Mistral, EXAONE 등).

---

## 🛠️ Installation & Setup

이 프로젝트를 실행하려면 **Backend**와 **Frontend**를 각각 설정해야 합니다.

### 1. Local LLM 준비 (Prerequisite)

먼저 로컬에서 LLM API가 실행 중이어야 합니다. (예: Ollama)

```bash
# Ollama 실행 예시 (Port: 11434)
ollama serve
# 모델이 없는 경우 미리 pull
ollama pull llama3
```

### 2. Backend Server(Python) 설정
```bash
cd backend-server

# 가상환경 생성 및 실행 (권장)
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 의존성 설치
pip install -r requirements.txt

# 환경 변수 설정 (.env 파일 생성)
# .env 예시:
# LLM_BASE_URL=http://localhost:11434/v1
# LLM_API_KEY=ollama
# LLM_MODEL_NAME=llama3

# 서버 실행
python app/main.py
```
성공 시: http://127.0.0.1:5000/docs 에서 Swagger UI를 확인할 수 있습니다.

### 3. Obsidian Plugin 설치
이 플러그인은 아직 커뮤니티 스토어에 없으므로 수동으로 설치해야 합니다.
```bash
cd obsidian-plugin

# 의존성 설치 및 빌드
npm install
npm run build
```

#### 적용 방법:

1. 빌드 결과물 (main.js, manifest.json, styles.css)을 복사합니다.

2. 자신의 옵시디언 저장소(Vault) 경로로 이동합니다: .obsidian/plugins/obsidian-auto-linker/

3. 위 폴더에 파일을 붙여넣습니다.

4. 옵시디언 설정 > Community Plugins > Reload 클릭 후 활성화합니다.

---

## 📖 Usage
1. Backend 서버가 켜져 있는지 확인합니다.

2. 옵시디언에서 원하는 노트를 엽니다.

3. 왼쪽 사이드바(Ribbon)의 네트워크 아이콘을 클릭하거나, 명령어 팔레트(Ctrl/Cmd + P)에서 **"Auto Link Keywords"**를 실행합니다.

4. 알림창과 함께 문서 내 주요 키워드가 자동으로 [[링크]]로 변환됩니다.

---

## ⚙️ Configuration
- 옵시디언 설정(Settings) > Auto Link Keywords 탭에서 다음을 변경할 수 있습니다.

- Backend Server URL: 기본값 http://127.0.0.1:5000/extract

- Ignore Threshold: 문서 내 링크가 N개 이상이면 자동 실행을 방지 (기본값: 10)

- Max Keywords: 한 번에 추출할 최대 키워드 수

---

## ⚠️ Troubleshooting
- "Connection Failed" 에러:

    - Python 백엔드 서버가 켜져 있는지 확인하세요.

    - 백엔드 서버 로그에 에러가 없는지 확인하세요.

- 키워드 추출이 잘 안될 때:

    - backend-server/app/prompts.py 파일에서 시스템 프롬프트를 수정하여 모델에 맞는 지시사항을 튜닝하세요.