import { Deck, Card } from '../types';

// 초기 덱 데이터
export const initialDecks: Deck[] = [
  {
    id: 'travel',
    title: '여행(Travel)',
    size: 20
  }
];

// 초기 카드 데이터 (여행 덱)
export const initialCards: Card[] = [
  { id: 't1', deckId: 'travel', front_en: 'passport', back_ko: '여권' },
  { id: 't2', deckId: 'travel', front_en: 'boarding pass', back_ko: '탑승권' },
  { id: 't3', deckId: 'travel', front_en: 'customs', back_ko: '세관' },
  { id: 't4', deckId: 'travel', front_en: 'baggage claim', back_ko: '수하물 찾는 곳' },
  { id: 't5', deckId: 'travel', front_en: 'gate', back_ko: '탑승구' },
  { id: 't6', deckId: 'travel', front_en: 'departure', back_ko: '출발' },
  { id: 't7', deckId: 'travel', front_en: 'arrival', back_ko: '도착' },
  { id: 't8', deckId: 'travel', front_en: 'luggage', back_ko: '짐, 수하물' },
  { id: 't9', deckId: 'travel', front_en: 'flight', back_ko: '비행, 항공편' },
  { id: 't10', deckId: 'travel', front_en: 'ticket', back_ko: '티켓, 표' },
  { id: 't11', deckId: 'travel', front_en: 'reservation', back_ko: '예약' },
  { id: 't12', deckId: 'travel', front_en: 'hotel', back_ko: '호텔' },
  { id: 't13', deckId: 'travel', front_en: 'check-in', back_ko: '체크인' },
  { id: 't14', deckId: 'travel', front_en: 'check-out', back_ko: '체크아웃' },
  { id: 't15', deckId: 'travel', front_en: 'suitcase', back_ko: '여행 가방' },
  { id: 't16', deckId: 'travel', front_en: 'destination', back_ko: '목적지' },
  { id: 't17', deckId: 'travel', front_en: 'tourist', back_ko: '관광객' },
  { id: 't18', deckId: 'travel', front_en: 'map', back_ko: '지도' },
  { id: 't19', deckId: 'travel', front_en: 'guide', back_ko: '가이드, 안내자' },
  { id: 't20', deckId: 'travel', front_en: 'currency', back_ko: '통화, 화폐' },
];

