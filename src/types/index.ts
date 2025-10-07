// 덱 타입
export interface Deck {
  id: string;
  title: string;
  size: number;
}

// 카드 타입
export interface Card {
  id: string;
  deckId: string;
  front_en: string;
  back_ko: string;
}

// 시도 타입
export interface Attempt {
  cardId: string;
  mode: 'study' | 'mcq' | 'fill';
  result: 'correct' | 'incorrect';
  timestamp: number;
}

// 세션 기록 타입
export interface SessionRecord {
  sessionId: string;
  deckId: string;
  attempts: Attempt[];
  unknownCardIds: string[];
  startedAt: number;
  completedAt?: number;
}

// 누적 통계 타입
export interface AggregateStats {
  totalAnswered: number;
  totalCorrect: number;
  perDeck: Record<string, {
    answered: number;
    correct: number;
  }>;
}

// localStorage 키 상수
export const STORAGE_KEYS = {
  DECKS: 'fc.decks',
  CARDS: 'fc.cards',
  STATS: 'fc.stats',
  LAST_SESSION: 'fc.lastSession',
} as const;

