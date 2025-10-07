import { STORAGE_KEYS } from '../types';

/**
 * localStorage 유틸리티 함수
 * 네임스페이스: fc.*
 */

/**
 * localStorage에서 데이터 가져오기
 * @param key - 저장소 키
 * @returns 파싱된 데이터 또는 null
 */
export function getFromStorage<T>(key: string): T | null {
  try {
    const item = localStorage.getItem(key);
    if (item === null) {
      return null;
    }
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Error reading from localStorage key "${key}":`, error);
    return null;
  }
}

/**
 * localStorage에 데이터 저장하기
 * @param key - 저장소 키
 * @param value - 저장할 데이터
 */
export function setToStorage<T>(key: string, value: T): void {
  try {
    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);
  } catch (error) {
    console.error(`Error writing to localStorage key "${key}":`, error);
  }
}

/**
 * localStorage에서 데이터 제거하기
 * @param key - 저장소 키
 */
export function removeFromStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing from localStorage key "${key}":`, error);
  }
}

/**
 * 모든 플래시카드 데이터 초기화
 */
export function clearAllStorage(): void {
  Object.values(STORAGE_KEYS).forEach(key => {
    removeFromStorage(key);
  });
}

/**
 * localStorage 사용 가능 여부 확인
 */
export function isStorageAvailable(): boolean {
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

