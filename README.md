# 🏆 SKKU AI Hackathon

> **성균관대학교 AI 해커톤 프로젝트**  
> 문제 정의부터 모델링, 서비스 구현까지 팀의 혁신적인 AI 솔루션을 구축하는 저장소입니다.

---

## 📌 1. 프로젝트 개요 (Overview)

- **프로젝트 명**: 
- **한 줄 소개**: 
- **개발 기간**: 
- **주제 및 목표**: 

---

## ✨ 2. 주요 기능 (Key Features)

- [ ] **기능 1**: 
- [ ] **기능 2**: 
- [ ] **기능 3**: 

---

## 🛠 3. 기술 스택 (Tech Stack)

### AI / ML & Backend
- **Language**: Python 3.10+
- **Framework & Models**: PyTorch / HuggingFace Transformers / LangChain
- **API Server**: FastAPI / Flask (선택)
- **Data & Tools**: Pandas, NumPy, Scikit-learn, WandB

### Frontend (선택)
- Streamlit / Gradio / React / Next.js

### Collaboration & DevOps
- Git, GitHub (Issue, PR, Projects)

---

## 📂 4. 디렉터리 구조 (Project Structure)

```text
SKKU_AI_Hackathon/
├── .github/                  # PR 및 Issue 템플릿
│   ├── ISSUE_TEMPLATE/
│   └── PULL_REQUEST_TEMPLATE.md
├── src/                      # 핵심 소스 코드
│   └── __init__.py
├── notebooks/                # EDA 및 모델 실험용 Jupyter Notebooks
├── tests/                    # 단위 테스트 및 통합 테스트
├── .env.example              # 환경 변수 설정 예시
├── .gitignore                # Git 제외 파일 목록 (가중치, 데이터셋 등)
├── CONTRIBUTING.md           # 브랜치 전략 및 커밋 컨벤션 협업 가이드
├── requirements.txt          # 파이썬 의존성 패키지 목록
└── README.md                 # 프로젝트 소개 및 가이드
```

---

## 🚀 5. 시작하기 (Getting Started)

### 1) 저장소 복제 (Clone)
```bash
git clone https://github.com/prelude-uni/SKKU_AI_Hackathon.git
cd SKKU_AI_Hackathon
```

### 2) 가상환경 생성 및 활성화
```bash
# Windows
python -m venv .venv
.venv\Scripts\activate

# Mac / Linux
python3 -m venv .venv
source .venv/bin/activate
```

### 3) 의존성 설치
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### 4) 환경변수 설정
`.env.example` 파일을 복사하여 `.env` 파일을 생성하고 필요한 API Key를 입력하세요.
```bash
cp .env.example .env
```

---

## 👥 6. 팀원 소개 (Team Members)

| 이름 | 역할 (Role) | GitHub | 이메일 / 연락처 |
| :---: | :---: | :---: | :---: |
| **팀원 1** | 팀장 / PM / 모델링 | [@github_id](https://github.com) | example@skku.edu |
| **팀원 2** | AI 모델링 / 데이터 엔지니어링 | [@github_id](https://github.com) | example@skku.edu |
| **팀원 3** | 백엔드 / 서빙 파이프라인 | [@github_id](https://github.com) | example@skku.edu |
| **팀원 4** | 프론트엔드 / UI/UX | [@github_id](https://github.com) | example@skku.edu |

---

## 🤝 7. 협업 가이드라인 (Contribution)

팀의 모든 협업은 [CONTRIBUTING.md](./CONTRIBUTING.md)에 정의된 룰을 준수합니다.

- **브랜치 전략**: `develop` 브랜치를 기준으로 `feature/<기능명>` 브랜치를 따서 작업 후 PR
- **커밋 컨벤션**: [Conventional Commits](https://www.conventionalcommits.org/) 준수 (`feat:`, `fix:`, `docs:` 등)
- **대용량 파일 주의**: 100MB 이상의 데이터 및 모델 가중치는 Git에 업로드하지 않습니다.
