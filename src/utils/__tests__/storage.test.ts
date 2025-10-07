import { describe, it, expect, beforeEach } from 'vitest'
import { getFromStorage, setToStorage, removeFromStorage, isStorageAvailable, clearAllStorage } from '../storage'
import { STORAGE_KEYS } from '../../types'

describe('storage utils', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('isStorageAvailable', () => {
    it('localStorage가 사용 가능하면 true를 반환한다', () => {
      expect(isStorageAvailable()).toBe(true)
    })
  })

  describe('setToStorage', () => {
    it('데이터를 localStorage에 저장한다', () => {
      const testData = { id: 'test', value: 123 }
      setToStorage(STORAGE_KEYS.DECKS, testData)
      
      const stored = localStorage.getItem(STORAGE_KEYS.DECKS)
      expect(stored).toBe(JSON.stringify(testData))
    })

    it('복잡한 객체를 저장할 수 있다', () => {
      const complexData = {
        id: 'travel',
        title: '여행',
        items: ['passport', 'ticket'],
        nested: { key: 'value' }
      }
      
      setToStorage(STORAGE_KEYS.CARDS, complexData)
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEYS.CARDS)!)
      expect(stored).toEqual(complexData)
    })
  })

  describe('getFromStorage', () => {
    it('localStorage에서 데이터를 가져온다', () => {
      const testData = { id: 'test', value: 456 }
      localStorage.setItem(STORAGE_KEYS.DECKS, JSON.stringify(testData))
      
      const retrieved = getFromStorage(STORAGE_KEYS.DECKS)
      expect(retrieved).toEqual(testData)
    })

    it('데이터가 없으면 null을 반환한다', () => {
      const result = getFromStorage('non-existent-key')
      expect(result).toBeNull()
    })

    it('잘못된 JSON이면 null을 반환한다', () => {
      localStorage.setItem('bad-key', 'invalid json{')
      const result = getFromStorage('bad-key')
      expect(result).toBeNull()
    })
  })

  describe('removeFromStorage', () => {
    it('localStorage에서 데이터를 삭제한다', () => {
      const testData = { id: 'test' }
      localStorage.setItem(STORAGE_KEYS.DECKS, JSON.stringify(testData))
      
      removeFromStorage(STORAGE_KEYS.DECKS)
      expect(localStorage.getItem(STORAGE_KEYS.DECKS)).toBeNull()
    })
  })

  describe('clearAllStorage', () => {
    it('모든 플래시카드 데이터를 삭제한다', () => {
      setToStorage(STORAGE_KEYS.DECKS, { test: 1 })
      setToStorage(STORAGE_KEYS.CARDS, { test: 2 })
      setToStorage(STORAGE_KEYS.STATS, { test: 3 })
      setToStorage(STORAGE_KEYS.LAST_SESSION, { test: 4 })
      
      clearAllStorage()
      
      expect(getFromStorage(STORAGE_KEYS.DECKS)).toBeNull()
      expect(getFromStorage(STORAGE_KEYS.CARDS)).toBeNull()
      expect(getFromStorage(STORAGE_KEYS.STATS)).toBeNull()
      expect(getFromStorage(STORAGE_KEYS.LAST_SESSION)).toBeNull()
    })
  })

  describe('통합 테스트', () => {
    it('데이터 저장, 로드, 삭제가 정상 동작한다', () => {
      const decks = [
        { id: 'travel', title: '여행', size: 20 }
      ]
      const cards = [
        { id: 't1', deckId: 'travel', front_en: 'passport', back_ko: '여권' }
      ]

      // 저장
      setToStorage(STORAGE_KEYS.DECKS, decks)
      setToStorage(STORAGE_KEYS.CARDS, cards)

      // 로드
      const loadedDecks = getFromStorage(STORAGE_KEYS.DECKS)
      const loadedCards = getFromStorage(STORAGE_KEYS.CARDS)

      expect(loadedDecks).toEqual(decks)
      expect(loadedCards).toEqual(cards)

      // 삭제
      removeFromStorage(STORAGE_KEYS.DECKS)
      expect(getFromStorage(STORAGE_KEYS.DECKS)).toBeNull()
      expect(getFromStorage(STORAGE_KEYS.CARDS)).toEqual(cards) // 다른 키는 유지
    })
  })
})
