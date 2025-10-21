import React, { useState } from 'react';

const MiniCalendar = ({ absenceDates = [] }) => {
  const currentDate = new Date();
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
  
  // Ayın ilk günü ve son günü
  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  const firstDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
  
  const monthNames = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
  
  const dayNames = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

  // Ay navigasyon fonksiyonları
  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const goToCurrentMonth = () => {
    setCurrentMonth(currentDate.getMonth());
    setCurrentYear(currentDate.getFullYear());
  };

  // Gün render etme
  const renderDays = () => {
    const days = [];
    const totalDays = lastDay.getDate();
    
    // Boş günler
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="h-6 w-6"></div>);
    }
    
    // Ayın günleri
    for (let day = 1; day <= totalDays; day++) {
      const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isAbsent = absenceDates.includes(dateString);
      const isToday = new Date().toDateString() === new Date(currentYear, currentMonth, day).toDateString();
      
      days.push(
        <div
          key={`${currentYear}-${currentMonth}-${day}`}
          className={`h-6 w-6 flex items-center justify-center text-xs rounded ${
            isAbsent
              ? 'bg-green-500 text-white'
              : isToday
              ? 'bg-primary-100 text-primary-700'
              : 'text-gray-700'
          }`}
        >
          {day}
        </div>
      );
    }
    
    return days;
  };

  const totalAbsenceDays = absenceDates.length;

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-gray-900">İzinli Günler</h4>
        <div className="flex items-center space-x-2">
          <button
            onClick={goToPreviousMonth}
            className="p-1 hover:bg-gray-200 rounded transition-colors"
            title="Önceki ay"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span 
            className="text-sm text-gray-700 font-medium cursor-pointer hover:text-primary-600 transition-colors min-w-[80px] text-center"
            onClick={goToCurrentMonth}
            title="Bugünkü aya git"
          >
            {monthNames[currentMonth]} {currentYear}
          </span>
          <button
            onClick={goToNextMonth}
            className="p-1 hover:bg-gray-200 rounded transition-colors"
            title="Sonraki ay"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Mini Takvim */}
      <div className="mb-3">
        {/* Gün başlıkları */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {dayNames.map((day, index) => (
            <div key={`day-${index}`} className="h-4 flex items-center justify-center text-xs font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>
        
        {/* Takvim günleri */}
        <div className="grid grid-cols-7 gap-1">
          {renderDays()}
        </div>
      </div>
      
      {/* Toplam izinli gün sayısı */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">Toplam İzinli Gün:</span>
        <span className="font-semibold text-green-600">{totalAbsenceDays} gün</span>
      </div>
    </div>
  );
};

export default MiniCalendar;
