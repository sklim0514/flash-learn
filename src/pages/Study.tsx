import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, Attempt, SessionRecord } from '../types';
import { getFromStorage, setToStorage } from '../utils/storage';
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
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [sessionId] = useState(`session-${Date.now()}`);
  const [showSummary, setShowSummary] = useState(false);

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

  const handleAnswer = (result: 'correct' | 'incorrect') => {
    const currentCard = cards[currentIndex];
    
    // Attempt 기록
    const newAttempt: Attempt = {
      cardId: currentCard.id,
      mode: 'study',
      result,
      timestamp: Date.now(),
    };
    
    const updatedAttempts = [...attempts, newAttempt];
    setAttempts(updatedAttempts);
    
    // 세션 저장
    const sessionRecord: SessionRecord = {
      sessionId,
      deckId: deckId || '',
      attempts: updatedAttempts,
      unknownCardIds: updatedAttempts
        .filter(a => a.result === 'incorrect')
        .map(a => a.cardId),
      startedAt: parseInt(sessionId.split('-')[1]),
    };
    
    setToStorage(STORAGE_KEYS.LAST_SESSION, sessionRecord);
    
    // 마지막 카드인 경우 요약 표시
    if (currentIndex === cards.length - 1) {
      sessionRecord.completedAt = Date.now();
      setToStorage(STORAGE_KEYS.LAST_SESSION, sessionRecord);
      setShowSummary(true);
    } else {
      // 다음 카드로 이동
      setCurrentIndex(currentIndex + 1);
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

  // 통계 계산
  const correctCount = attempts.filter(a => a.result === 'correct').length;
  const incorrectCount = attempts.filter(a => a.result === 'incorrect').length;
  const totalAttempts = attempts.length;
  const accuracy = totalAttempts > 0 ? Math.round((correctCount / totalAttempts) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 세션 요약 모달 */}
      {showSummary && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              🎉 학습 완료!
            </h2>
            
            <div className="space-y-4 mb-8">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">총 카드 수</span>
                  <span className="text-2xl font-bold text-gray-800">{totalAttempts}</span>
                </div>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-green-700 font-medium">맞은 개수</span>
                  <span className="text-2xl font-bold text-green-600">{correctCount}</span>
                </div>
              </div>
              
              <div className="bg-red-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-red-700 font-medium">틀린 개수</span>
                  <span className="text-2xl font-bold text-red-600">{incorrectCount}</span>
                </div>
              </div>
              
              <div className="bg-primary-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-primary-700 font-medium">정확도</span>
                  <span className="text-2xl font-bold text-primary-600">{accuracy}%</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-3">
              {incorrectCount > 0 && (
                <button
                  onClick={() => {
                    // TODO: 모르는 카드만 다시 학습 (추후 구현)
                    setShowSummary(false);
                    navigate('/');
                  }}
                  className="btn-secondary w-full"
                >
                  틀린 카드 다시 학습 ({incorrectCount}개)
                </button>
              )}
              <button
                onClick={() => navigate('/')}
                className="btn-primary w-full"
              >
                홈으로 돌아가기
              </button>
            </div>
          </div>
        </div>
      )}

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

        {/* 정오답 버튼 */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => handleAnswer('incorrect')}
            disabled={!isFlipped}
            className="px-8 py-4 rounded-lg font-semibold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-red-500 text-white hover:bg-red-600 disabled:bg-gray-300"
          >
            ✗ 틀렸어
          </button>
          <button
            onClick={() => handleAnswer('correct')}
            disabled={!isFlipped}
            className="px-8 py-4 rounded-lg font-semibold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-green-500 text-white hover:bg-green-600 disabled:bg-gray-300"
          >
            ✓ 맞았어
          </button>
        </div>

        {!isFlipped && (
          <p className="text-center text-gray-500 mb-8 text-sm">
            카드를 뒤집은 후 정답을 선택해주세요
          </p>
        )}

        {/* 네비게이션 버튼 (수동 이동용) */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => {
              if (currentIndex > 0) {
                setCurrentIndex(currentIndex - 1);
                setIsFlipped(false);
              }
            }}
            disabled={currentIndex === 0}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← 이전
          </button>
          <button
            onClick={() => {
              if (currentIndex < cards.length - 1) {
                setCurrentIndex(currentIndex + 1);
                setIsFlipped(false);
              }
            }}
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

