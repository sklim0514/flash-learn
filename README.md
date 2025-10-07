# Flash Learn - 영어 학습 플래시카드 웹앱

TypeScript + React + Vite로 구축된 영어 단어 학습용 플래시카드 웹 애플리케이션입니다.

## 📚 프로젝트 개요

영어 → 한국어 단어를 빠르게 반복 학습할 수 있는 단일 페이지 웹앱(SPA)입니다.
- 카드 뒤집기
- 정오답 기록
- "모르는 카드만 다시" 학습
- 퀴즈 모드 (4지선다, 빈칸 채우기)
- 학습 통계

## 🚀 시작하기

### 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

개발 서버가 실행되면 브라우저에서 `http://localhost:5173`으로 접속하세요.

### 빌드

```bash
npm run build
```

### 프로덕션 미리보기

```bash
npm run preview
```

## 📁 프로젝트 구조

```
flash_learn/
├── docs/                    # 문서
│   ├── specification.md     # 요구사항 명세서
│   └── TODO.md             # 할일 목록
├── src/
│   ├── components/         # React 컴포넌트
│   │   └── Layout.tsx      # 레이아웃 (헤더, 네비게이션)
│   ├── pages/              # 페이지 컴포넌트
│   │   ├── Home.tsx        # 홈 (덱 선택)
│   │   ├── Study.tsx       # 학습 화면
│   │   ├── Quiz.tsx        # 퀴즈 화면
│   │   ├── Stats.tsx       # 통계 화면
│   │   └── Settings.tsx    # 설정 화면
│   ├── types/              # TypeScript 타입 정의
│   │   └── index.ts
│   ├── data/               # 초기 데이터
│   │   └── initialData.ts  # 여행 덱 샘플 데이터
│   ├── utils/              # 유틸리티 함수
│   │   └── storage.ts      # localStorage 유틸
│   ├── App.tsx             # 메인 앱 컴포넌트
│   ├── main.tsx            # 진입점
│   └── index.css           # 전역 스타일
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## 🎯 주요 기능

### Phase 1 (완료)
- ✅ Vite + React + TypeScript 프로젝트 초기화
- ✅ Tailwind CSS 설정
- ✅ 라우팅 구성 (/, /study, /quiz, /stats, /settings)
- ✅ 타입 정의 (Deck, Card, Attempt, SessionRecord, AggregateStats)
- ✅ 초기 데이터 (여행 덱 20개 단어)
- ✅ localStorage 유틸 함수

### Phase 2 (예정)
- 카드 뒤집기 애니메이션
- 정오답 기록
- 스와이프 제스처
- "모르는 카드만 다시" 기능

### Phase 3 (예정)
- 4지선다 퀴즈
- 빈칸 채우기 퀴즈
- 학습 통계 시각화

## 🧪 테스트

### localStorage 유틸 테스트

브라우저 개발자 도구 콘솔에서 다음을 실행하여 localStorage 유틸 함수를 테스트할 수 있습니다:

```javascript
// 테스트 모듈 import 후
window.runStorageTests()
```

## 📝 데이터 모델

### Deck (덱)
```typescript
interface Deck {
  id: string;
  title: string;
  size: number;
}
```

### Card (카드)
```typescript
interface Card {
  id: string;
  deckId: string;
  front_en: string;
  back_ko: string;
}
```

### Attempt (시도 기록)
```typescript
interface Attempt {
  cardId: string;
  mode: 'study' | 'mcq' | 'fill';
  result: 'correct' | 'incorrect';
  timestamp: number;
}
```

## 🎨 기술 스택

- **프레임워크**: React 19
- **언어**: TypeScript 5
- **빌드 도구**: Vite 7
- **스타일링**: Tailwind CSS 4
- **라우팅**: React Router 7
- **저장소**: localStorage (무백엔드)

## 📄 라이선스

ISC

## 👨‍💻 개발

자세한 요구사항은 `docs/specification.md`를 참조하세요.
할일 목록은 `docs/TODO.md`에서 확인할 수 있습니다.

