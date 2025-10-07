import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Deck } from '../types';
import { getFromStorage, setToStorage } from '../utils/storage';
import { STORAGE_KEYS } from '../types';
import { initialDecks, initialCards } from '../data/initialData';

export default function Home() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // localStorage에서 덱 로드, 없으면 초기 데이터 사용
    let loadedDecks = getFromStorage<Deck[]>(STORAGE_KEYS.DECKS);
    
    if (!loadedDecks || loadedDecks.length === 0) {
      // 초기 데이터 설정
      setToStorage(STORAGE_KEYS.DECKS, initialDecks);
      setToStorage(STORAGE_KEYS.CARDS, initialCards);
      loadedDecks = initialDecks;
    }
    
    setDecks(loadedDecks);
  }, []);

  const handleStartStudy = (deckId: string) => {
    navigate(`/study?deck=${deckId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-primary-800 mb-4">
            Flash Learn
          </h1>
          <p className="text-xl text-gray-700">
            영어 플래시카드로 쉽고 빠르게 단어를 익혀보세요
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">덱 선택</h2>
          
          {decks.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-gray-500">로딩 중...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {decks.map((deck) => (
                <div key={deck.id} className="card hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">
                        {deck.title}
                      </h3>
                      <p className="text-gray-600 mt-1">
                        카드 수: {deck.size}개
                      </p>
                    </div>
                    <button
                      onClick={() => handleStartStudy(deck.id)}
                      className="btn-primary"
                    >
                      학습 시작
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

