# PRD (간단 버전) — 영어 학습 플래시카드 웹앱 (TypeScript + React)

## 1) 목적
- 영어 → 한국어 단어를 빠르게 반복 학습하는 단일 페이지 웹앱(SPA).
- 카드 뒤집기, 정오답 표시, 세션 내 "모르는 카드만 다시", 간단 퀴즈, 기본 통계 제공.
- 무백엔드 + 로컬 저장, 한글 UI, 스와이프 제스처 지원.

## 2) 대상 사용자 & 핵심 가치
- 여행/기초 어휘를 단기간에 익히려는 학습자.
- 최소 조작으로 빠른 반복, 틀린 카드 중심 보강, 간단한 성취 피드백.

## 3) 범위 (MVP)
### 필수 기능
- 덱 선택: 초기 덱 "여행(Travel)" 1개 제공.
- 학습(Study):
  - 앞면(영어) ↔ 뒷면(한국어) 뒤집기
  - 뒤집은 뒤 "맞았어 / 틀렸어" 기록
  - 스와이프 제스처: 오른쪽=맞음, 왼쪽=틀림
  - "모르는 카드만 다시": 현재 세션에서 틀린 카드만 재학습
- 퀴즈(자동채점):
  - 4지선다(MCQ): 문제=영어, 보기=한국어 4개(정답 1 + 오답 3)
  - 빈칸(Fill): 한국어 제시 → 영어 입력(대소문자/공백 무시)
- 통계(기본):
  - 세션: 학습 카드 수, 정답/오답, 정확도, Unknown 수
  - 전체(누적): 총 정오답/정확도, 덱별 정확도

### 비범위 (MVP 제외)
- 로그인/동기화/배포, 오디오(TTS), 다국어 UI, 간격 반복(SRS) 고도화, CSV 임포트/에디터.

## 4) 사용자 흐름
1. 홈 → "여행" 덱 선택
2. 학습: 카드 뒤집기 → 맞/틀 기록(또는 스와이프)
3. "모르는 카드만 다시"로 빠른 보강
4. 퀴즈(MCQ/Fill)로 확인
5. 통계 페이지에서 간단 성과 확인

## 5) 데이터(최소)
type Deck = { id: string; title: string; size: number }
type Card = { id: string; deckId: string; front_en: string; back_ko: string }
type Attempt = { cardId: string; mode: 'study' | 'mcq' | 'fill'; result: 'correct' | 'incorrect' }
type SessionRecord = { sessionId: string; deckId: string; attempts: Attempt[]; unknownCardIds: string[] }
type AggregateStats = { totalAnswered: number; totalCorrect: number; perDeck: Record<string, { answered: number; correct: number }> }

저장소(localStorage) 키: fc.decks, fc.cards, fc.stats, fc.lastSession

## 6) 채점 규칙(요약)
- MCQ: selectedIndex === correctIndex
- 오답 보기: 동일 덱에서 무작위 3개(중복 제거)
- Fill: normalize(input) === normalize(answer)
  - normalize: toLowerCase(), trim(), 다중 공백 1개로 축소
  - 복수/시제/어근 변형은 v1 미허용(명확성 우선)

## 7) 기술 스택(제안)
- React + TypeScript + Vite
- 상태: React 훅/간단 컨텍스트
- 라우팅: react-router (Home / Study / Quiz / Stats / Settings)
- 스타일: Tailwind(선택)
- 저장: localStorage (무백엔드)

## 8) 수용 기준(핵심)
- [ ] 뒤집기 후 "맞았어/틀렸어"가 세션 기록과 진행률에 반영된다.
- [ ] 스와이프 오른쪽=맞음, 왼쪽=틀림이 정상 동작한다.
- [ ] "모르는 카드만 다시"가 해당 세션의 틀린 카드만 큐로 만든다.
- [ ] MCQ는 선택 즉시 자동채점, Fill은 대소문자/공백 무시로 판정한다.
- [ ] 통계에 세션/전체의 정오답·정확도가 표시된다.

## 9) 초기 덱 샘플(여행)
deck: { id: "travel", title: "여행(Travel)", size: 20 }
cards:
- { id: "t1", deckId: "travel", front_en: "passport",       back_ko: "여권" }
- { id: "t2", deckId: "travel", front_en: "boarding pass",   back_ko: "탑승권" }
- { id: "t3", deckId: "travel", front_en: "customs",         back_ko: "세관" }
- { id: "t4", deckId: "travel", front_en: "baggage claim",   back_ko: "수하물 찾는 곳" }
- { id: "t5", deckId: "travel", front_en: "gate",            back_ko: "탑승구" }

## 10) 작업 순서(권장)
1. 데이터 로딩(여행 덱)
2. 학습(뒤집기/맞·틀 기록)
3. "모르는 카드만 다시"
4. MCQ 4지선다 → Fill
5. 통계(세션/누적)
6. localStorage 저장/세션 복구
7. 제스처/키보드 단축키 정리