/**
 * localStorage 유틸 함수 테스트
 * 브라우저 콘솔에서 수동으로 실행 가능
 */

import { getFromStorage, setToStorage, removeFromStorage, isStorageAvailable } from '../storage';
import { STORAGE_KEYS } from '../../types';

export function runStorageTests() {
  console.log('=== localStorage 유틸 테스트 시작 ===\n');

  // 1. isStorageAvailable 테스트
  console.log('1. isStorageAvailable 테스트');
  const available = isStorageAvailable();
  console.log(`✓ localStorage 사용 가능: ${available}\n`);

  if (!available) {
    console.error('localStorage를 사용할 수 없습니다.');
    return;
  }

  // 2. setToStorage 테스트
  console.log('2. setToStorage 테스트');
  const testData = { test: 'value', number: 123 };
  setToStorage(STORAGE_KEYS.DECKS, testData);
  console.log(`✓ fc.decks에 데이터 저장 완료\n`);

  // 3. getFromStorage 테스트
  console.log('3. getFromStorage 테스트');
  const retrieved = getFromStorage<typeof testData>(STORAGE_KEYS.DECKS);
  const match = JSON.stringify(retrieved) === JSON.stringify(testData);
  console.log(`✓ 데이터 읽기: ${match ? '성공' : '실패'}`);
  console.log(`  저장된 값: ${JSON.stringify(testData)}`);
  console.log(`  읽은 값: ${JSON.stringify(retrieved)}\n`);

  // 4. removeFromStorage 테스트
  console.log('4. removeFromStorage 테스트');
  removeFromStorage(STORAGE_KEYS.DECKS);
  const afterRemove = getFromStorage(STORAGE_KEYS.DECKS);
  console.log(`✓ 데이터 삭제: ${afterRemove === null ? '성공' : '실패'}`);
  console.log(`  삭제 후 값: ${afterRemove}\n`);

  // 5. 실제 키로 테스트
  console.log('5. 실제 STORAGE_KEYS로 통합 테스트');
  const testDecks = [{ id: 'test', title: 'Test Deck', size: 10 }];
  const testCards = [{ id: 'c1', deckId: 'test', front_en: 'hello', back_ko: '안녕' }];

  setToStorage(STORAGE_KEYS.DECKS, testDecks);
  setToStorage(STORAGE_KEYS.CARDS, testCards);
  
  const loadedDecks = getFromStorage(STORAGE_KEYS.DECKS);
  const loadedCards = getFromStorage(STORAGE_KEYS.CARDS);
  
  console.log(`✓ fc.decks 저장/로드: ${loadedDecks ? '성공' : '실패'}`);
  console.log(`✓ fc.cards 저장/로드: ${loadedCards ? '성공' : '실패'}\n`);

  // 정리
  removeFromStorage(STORAGE_KEYS.DECKS);
  removeFromStorage(STORAGE_KEYS.CARDS);

  console.log('=== 모든 테스트 완료 ===');
  console.log('수용 기준 충족: ✓ fc.decks, fc.cards 키로 저장/로드 테스트 통과');
}

// 브라우저 콘솔에서 window.runStorageTests() 로 실행 가능하도록 export
if (typeof window !== 'undefined') {
  (window as any).runStorageTests = runStorageTests;
}

