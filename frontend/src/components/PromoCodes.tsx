import  { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const promoCodes = [
  { discount: '20% OFF', code: 'SAVE20', color: 'bg-blue-500' },
  { discount: '15% OFF', code: 'FIRST15', color: 'bg-green-500' },
  { discount: '10% OFF', code: 'WELCOME10', color: 'bg-purple-500' },
  { discount: '$5 OFF', code: 'FIVE5', color: 'bg-red-500' },
  { discount: '25% OFF', code: 'BIGSAVE25', color: 'bg-indigo-500' },
  { discount: '30% OFF', code: 'SUPER30', color: 'bg-teal-500' },
];

const PromoSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Max visible items based on screen size
  const maxVisible = {
    sm: 1,
    md: 3,
    lg: 4,
  };

  // Calculate max index based on screen size
  const getMaxIndex = () => {
    if (window.innerWidth >= 1024) return promoCodes.length - maxVisible.lg;
    if (window.innerWidth >= 768) return promoCodes.length - maxVisible.md;
    return promoCodes.length - maxVisible.sm;
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, getMaxIndex()));
  };

  return (
    <section className="py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Promo Codes For More Savings</h2>
          <div className="flex gap-2">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="p-2 rounded-full border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={handleNext}
              disabled={currentIndex >= getMaxIndex()}
              className="p-2 rounded-full border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * (100 / maxVisible.sm)}%)` }}
          >
            {promoCodes.map((promo, index) => (
              <div
                key={index}
                className={`flex-shrink-0 w-full sm:w-full md:w-1/3 lg:w-1/4 px-3 ${promo.color} rounded-lg p-6 text-white`}
              >
                <div className="text-2xl font-bold mb-1">{promo.discount}</div>
                <div className="text-sm mb-4">On your first booking</div>
                <div className="flex items-center justify-between">
                  <div className="text-sm">Code: {promo.code}</div>
                  <button className="px-3 py-1 bg-white text-gray-900 rounded text-sm">
                    Copy Code
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoSection;