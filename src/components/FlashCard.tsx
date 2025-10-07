import { Card } from '../types';

interface FlashCardProps {
  card: Card;
  isFlipped: boolean;
  onFlip: () => void;
}

export default function FlashCard({ card, isFlipped, onFlip }: FlashCardProps) {
  return (
    <div className="perspective-1000 w-full max-w-2xl mx-auto">
      <div
        className={`relative w-full h-80 cursor-pointer transition-transform duration-500 transform-style-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
        onClick={onFlip}
      >
        {/* 앞면 (영어) */}
        <div className="absolute w-full h-full backface-hidden">
          <div className="card h-full flex flex-col items-center justify-center bg-gradient-to-br from-primary-50 to-white border-2 border-primary-200 hover:shadow-xl transition-shadow">
            <div className="text-sm text-gray-500 mb-4">영어</div>
            <h2 className="text-5xl font-bold text-primary-700 text-center px-8">
              {card.front_en}
            </h2>
            <div className="text-sm text-gray-400 mt-8">
              카드를 클릭하여 뒤집기
            </div>
          </div>
        </div>

        {/* 뒷면 (한국어) */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180">
          <div className="card h-full flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-white border-2 border-green-200 hover:shadow-xl transition-shadow">
            <div className="text-sm text-gray-500 mb-4">한국어</div>
            <h2 className="text-5xl font-bold text-green-700 text-center px-8">
              {card.back_ko}
            </h2>
            <div className="text-sm text-gray-400 mt-8">
              카드를 클릭하여 뒤집기
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

