import React, { useState, useEffect } from 'react';

const SlidingBanner = ({ items, autoSlide = true, slideInterval = 3000, isDarkMode = false }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!autoSlide || items.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
    }, slideInterval);

    return () => clearInterval(interval);
  }, [autoSlide, slideInterval, items.length]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + items.length) % items.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  if (items.length === 0) return null;

  return (
    <div className={`relative overflow-hidden rounded-lg transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gray-800/10' 
        : 'bg-white/60'
    }`}>
      {/* Banner Container */}
      <div className="relative h-32">
        <div 
          className="flex transition-transform duration-500 ease-in-out h-full"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {items.map((item, index) => (
            <div key={index} className="w-full flex-shrink-0 flex items-center justify-center">
              <div className={`flex items-start space-x-3 p-6 rounded-lg transition-colors w-full max-w-sm ${
                isDarkMode 
                  ? 'hover:bg-gray-700/20' 
                  : 'hover:bg-white/40'
              }`}>
                <div className={`w-12 h-12 ${item.iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <div className={`w-6 h-6 ${item.iconColor}`}>
                    {item.icon}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className={`font-medium mb-1 transition-colors duration-300 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>{item.title}</h3>
                  <p className={`text-sm transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>


      {/* Dots Indicator */}
      {items.length > 1 && (
        <div className="flex justify-center space-x-2 mt-4">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentIndex 
                  ? 'bg-primary-600 w-6' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      )}

    </div>
  );
};

export default SlidingBanner;
