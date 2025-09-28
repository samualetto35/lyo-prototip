import React, { useState } from 'react';

const Calendar = ({ student, absenceDates = [] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  // Takvim ayarları
  const monthNames = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ];
  
  const dayNames = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

  // Ayın ilk günü ve son günü
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const firstDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1; // Pazartesi başlangıç

  // Ay değiştirme
  const changeMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  // Gün render etme
  const renderDays = () => {
    const days = [];
    const totalDays = lastDay.getDate();
    
    // Boş günler (önceki ayın son günleri)
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-10 w-10"></div>
      );
    }
    
    // Ayın günleri
    for (let day = 1; day <= totalDays; day++) {
      const dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isAbsent = absenceDates.includes(dateString);
      const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();
      const isSelected = selectedDate === dateString;
      
      days.push(
        <button
          key={day}
          onClick={() => setSelectedDate(dateString)}
          className={`h-10 w-10 flex items-center justify-center text-sm rounded-lg transition-all duration-200 ${
            isAbsent
              ? 'bg-red-100 text-red-700 border border-red-200 hover:bg-red-200'
              : isToday
              ? 'bg-primary-100 text-primary-700 border border-primary-200 hover:bg-primary-200'
              : isSelected
              ? 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
              : 'hover:bg-gray-50 text-gray-700'
          }`}
        >
          {day}
        </button>
      );
    }
    
    return days;
  };

  // Seçili tarih bilgisi
  const getSelectedDateInfo = () => {
    if (!selectedDate) return null;
    
    const isAbsent = absenceDates.includes(selectedDate);
    const date = new Date(selectedDate);
    const formattedDate = date.toLocaleDateString('tr-TR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    return (
      <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
        <h4 className="font-medium text-gray-900 mb-2">{formattedDate}</h4>
        {isAbsent ? (
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-red-700 font-medium">İzinli Gün</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-green-700 font-medium">Okul Günü</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          {student.firstName} {student.lastName} - Takvim
        </h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => changeMonth(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h4 className="text-lg font-medium text-gray-900 min-w-[150px] text-center">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h4>
          <button
            onClick={() => changeMonth(1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Gün başlıkları */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div key={day} className="h-8 flex items-center justify-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>

      {/* Takvim günleri */}
      <div className="grid grid-cols-7 gap-1">
        {renderDays()}
      </div>

      {/* Seçili tarih bilgisi */}
      {getSelectedDateInfo()}

      {/* Açıklama */}
      <div className="mt-6 flex items-center justify-center space-x-6 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span className="text-gray-600">İzinli Gün</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
          <span className="text-gray-600">Bugün</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-gray-600">Okul Günü</span>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
