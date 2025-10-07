import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card } from '../types';
import { getFromStorage } from '../utils/storage';
import { STORAGE_KEYS } from '../types';
import FlashCard from '../components/FlashCard';

export default function Study() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const deckId = searchParams.get('deck');

  const [cards, setCards] = useState<Card[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!deckId) {
      navigate('/');
      return;
    }

    // localStorage에서 카드 로드
    const allCards = getFromStorage<Card[]>(STORAGE_KEYS.CARDS);
    if (allCards) {
      const deckCards = allCards.filter(card => card.deckId === deckId);
      setCards(deckCards);
    }
    setLoading(false);
  }, [deckId, navigate]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">로딩 중...</div>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="card text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            카드가 없습니다
          </h2>
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  const currentCard = cards[currentIndex];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/')}
            className="text-primary-600 hover:text-primary-700 flex items-center gap-2"
          >
            ← 돌아가기
          </button>
          <h1 className="text-3xl font-bold text-gray-800">학습</h1>
          <div className="w-24"></div> {/* 균형을 위한 빈 공간 */}
        </div>

        {/* 진행률 */}
        <div className="mb-8 text-center">
          <div className="text-lg font-semibold text-gray-700">
            {currentIndex + 1} / {cards.length}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2 max-w-md mx-auto">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* 카드 */}
        <div className="mb-8">
          <FlashCard
            card={currentCard}
            isFlipped={isFlipped}
            onFlip={handleFlip}
          />
        </div>

        {/* 네비게이션 버튼 */}
        <div className="flex justify-center gap-4">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← 이전
          </button>
          <button
            onClick={handleNext}
            disabled={currentIndex === cards.length - 1}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            다음 →
          </button>
        </div>

        {/* 완료 */}
        {currentIndex === cards.length - 1 && (
          <div className="text-center mt-8">
            <button
              onClick={() => navigate('/')}
              className="btn-primary"
            >
              학습 완료
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

