# 🦋 나비 나침반 · Nabi Compass

> **AI 진로 탐색 온보딩 MVP** — 드래그앤드롭, 카드 선택, 게이미피케이션으로 즐기는 진로 항해의 시작.

A+ 공모전 기준에 맞춰 설계된 **9단계 온보딩 UX 플로우**를 정적 웹사이트로 구현한 MVP입니다.
빌드 도구·의존성 없이 순수 HTML/CSS/JS로 작성되어 **GitHub Pages로 바로 배포**할 수 있습니다.

---

## ✨ 핵심 기능

| 단계 | 화면 | 설계 의도 |
|---|---|---|
| 1 | **환영 (Welcome)** | 3D 나비 캐릭터가 항해를 안내 |
| 2 | **역할 선택 (Persona)** | 학생 / 교사 / 학부모 맞춤 경험 시작 |
| 3 | **가치 소개** | 게임처럼 즐기는 진로 탐색 방식 안내 |
| 4 | **관심사 정의** | 🃏 **드래그앤드롭** 진로 카드 던지기 |
| 5 | **AI 파트너 선택** | 코치 / 분석가 / 멘토 아키타입 |
| 6 | **첫 번째 질문 (Aha!)** | 핵심 진로 고민 입력 → AI 분석 트리거 |
| 7 | **마일스톤 축하** | 🎉 컨페티 + **‘첫 항해자’ 뱃지** |
| 8 | **AI 진로 가이드 미리보기** | 관심사 기반 맞춤 추천 적합도 시각화 |
| 9 | **리텐션 허브** | 연속 출석 · 데일리 챌린지 · 뱃지 · 리더보드 |

### 디자인 시스템
- **인터랙티브 & 게이미피케이션**: 드래그앤드롭, 카드 선택, 진행 단계 = 게임 레벨
- **3D 볼류메트릭 나비**: 날갯짓·부유 애니메이션이 있는 SVG 캐릭터 가이드
- **Progress Bar**: 전체 9단계 진행률을 상단에 상시 노출 → 빠른 통과 유도
- **Aha! Moment**: 온보딩 중 첫 AI 진로 카드를 발급해 핵심 가치를 즉시 증명
- **긍정적 강화**: 마일스톤 축하 연출 + 뱃지로 성취감·리텐션 강화

### 브랜드 컬러
| | HEX | 용도 |
|---|---|---|
| 🔵 | `#138Bff` | 프라이머리 / CTA / 나비 날개 |
| 🟡 | `#f4f000` | 시그널 / 뱃지 / 출석 |
| 🩷 | `#ff6db2` | 세컨더리 액센트 |
| ⚪ | `#e9e9e7` | 보더 / 비활성 |
| 🩵 | `#EaF6FF` | 배경 틴트 |

---

## 🚀 로컬 실행

별도 설치가 필요 없습니다. 아래 중 하나를 사용하세요.

```bash
# 방법 1) 파일을 그냥 브라우저로 열기
#   index.html 더블클릭

# 방법 2) 간단한 로컬 서버 (권장)
python -m http.server 8080
#   → http://localhost:8080
```

---

## 🌐 GitHub Pages 배포

### 1. 저장소에 올리기
```bash
git init
git add .
git commit -m "feat: 나비 나침반 온보딩 MVP"
git branch -M main
git remote add origin https://github.com/<USERNAME>/<REPO>.git
git push -u origin main
```

### 2. Pages 활성화
GitHub 저장소 → **Settings → Pages → Build and deployment → Source** 를
**“GitHub Actions”** 로 설정합니다.

`main` 브랜치에 push 하면 `.github/workflows/deploy.yml` 이 자동으로 사이트를 배포합니다.
배포 주소: `https://<USERNAME>.github.io/<REPO>/`

> 💡 별도 빌드 스텝이 없으므로 저장소 루트 전체가 그대로 정적 호스팅됩니다.

---

## 🗂 구조
```
nabi-compass/
├─ index.html              # 앱 셸 (디바이스 프레임 · 진행바)
├─ styles.css              # 브랜드 디자인 시스템
├─ app.js                  # 9단계 플로우 · 드래그앤드롭 · 컨페티 · 추천 엔진
├─ README.md
└─ .github/workflows/deploy.yml   # GitHub Pages 자동 배포
```

선택 사항(역할·관심사·파트너·질문)은 `localStorage` 에 저장되어 재방문 시 복원됩니다.

---

🤖 Generated with [Claude Code](https://claude.com/claude-code)
