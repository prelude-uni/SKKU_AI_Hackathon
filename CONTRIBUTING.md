# 🤝 SKKU AI Hackathon 협업 가이드 (CONTRIBUTING)

원활한 팀 협업과 코드 품질 유지를 위해 아래의 규칙을 준수해 주세요.

---

## 🌳 1. 브랜치 전략 (Branching Strategy)

저희 프로젝트는 안정적인 메인 브랜치 관리와 빠른 기능 통합을 위해 **GitHub Flow 기반 전략**을 채택합니다.

```
main (배포 및 최종 제출용)
  │
  ├── develop (개발 기본 브랜치 - 팀 통합 테스트)
  │     ├── feature/data-preprocessing
  │     ├── feature/model-training
  │     └── feature/api-server
  │
  └── hotfix/critical-bug (main 긴급 패치 시)
```

### 브랜치 명명 규칙
- `feature/<기능명>` : 새로운 기능 개발 (예: `feature/rag-pipeline`, `feature/fastapi-endpoint`)
- `fix/<버그명>` : 버그 수정 (예: `fix/token-limit-error`)
- `docs/<문서명>` : 문서 작성 및 수정 (예: `docs/api-readme`)
- `refactor/<대상>` : 코드 리팩토링 (예: `refactor/dataloader`)

> ⚠️ **주의**: `main` 및 `develop` 브랜치에 직접 `git push`하는 것은 금지되어 있습니다. 반드시 feature 브랜치를 생성한 후 PR(Pull Request)을 통해 병합합니다.

---

## 💬 2. 커밋 컨벤션 (Commit Convention)

커밋 메시지는 [Conventional Commits](https://www.conventionalcommits.org/) 규격을 따릅니다.

### 커밋 메시지 구조
```
<type>: <제목 (한 줄 요약)>

[선택사항: 본문 (무엇을 왜 변경했는지 상세 기술)]
[선택사항: 이슈 번호 꼬리말 (ex: Resolves: #1)]
```

### 커밋 타입 (Type)
| 타입 | 설명 |
| :--- | :--- |
| **`feat`** | 새로운 기능 추가 |
| **`fix`** | 버그 수정 |
| **`docs`** | 문서 변경 (README, docstring 등) |
| **`style`** | 코드 포맷팅, 세미콜론 누락 등 (비즈니스 로직 변경 없음) |
| **`refactor`** | 코드 리팩토링 (기능 추가나 버그 수정이 없는 구조 개선) |
| **`perf`** | 성능 개선 |
| **`test`** | 테스트 코드 추가 또는 수정 |
| **`chore`** | 빌드 업무, 패키지 매니저 설정, .gitignore 등 기타 변경 |

### 커밋 메시지 예시
```bash
feat: LangChain 기반 질의응답 RAG 파이프라인 구현
fix: GPU 메모리 초과 시 배치 사이즈 자동 조정 오류 수정
docs: README에 실행 환경 구축 가이드 추가
chore: requirements.txt에 torch 및 transformers 추가
```

---

## 🚀 3. 작업 및 PR 워크플로우

1. **최신 코드 가져오기**
   ```bash
   git checkout develop
   git pull origin develop
   ```
2. **새 브랜치 생성 후 작업**
   ```bash
   git checkout -b feature/model-inference
   ```
3. **변경사항 커밋**
   ```bash
   git add .
   git commit -m "feat: 모델 추론 엔드포인트 함수 작성"
   ```
4. **원격 저장소로 브랜치 Push**
   ```bash
   git push origin feature/model-inference
   ```
5. **GitHub에서 Pull Request(PR) 생성**
   - Base 브랜치: `develop`
   - PR 템플릿에 맞춰 변경 내용 및 테스트 결과 기재
   - 최소 1명 이상의 팀원 승인(Approve) 후 Squash & Merge 진행

---

## ⚠️ 4. 주의사항 (대용량 파일 관리)

- 모델 가중치(`*.pt`, `*.pth`, `*.bin`, `*.safetensors`) 및 대용량 데이터셋(100MB 이상)은 **절대 Git에 직접 commit하지 마세요**.
- 대용량 데이터/가중치는 Google Drive, HuggingFace Hub 또는 별도 클라우드 스토리지를 활용하고 다운로드 스크립트를 작성합니다.
- API 키, 토큰 등 민감 정보는 `.env`에 보관하며 커밋에 포함되지 않도록 주의합니다.
