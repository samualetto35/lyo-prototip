import React, { useState } from 'react';
import AbsenceConfirmation from './AbsenceConfirmation';

const AbsenceManager = ({ student, parent, onClose, onSave }) => {
  const [selectedDates, setSelectedDates] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [showSMSVerification, setShowSMSVerification] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  const monthNames = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ];

  const daysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const formatDate = (day, month, year) => {
    const date = new Date(year, month, day);
    const yearStr = date.getFullYear();
    const monthStr = String(date.getMonth() + 1).padStart(2, '0');
    const dayStr = String(date.getDate()).padStart(2, '0');
    return `${yearStr}-${monthStr}-${dayStr}`;
  };

  const isDateSelected = (day, month, year) => {
    const dateStr = formatDate(day, month, year);
    return selectedDates.includes(dateStr);
  };

  const isToday = (day, month, year) => {
    const today = new Date();
    const currentDate = new Date(year, month, day);
    return currentDate.toDateString() === today.toDateString();
  };

  const isPastDate = (day, month, year) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Bugünün başlangıcı
    const currentDate = new Date(year, month, day);
    return currentDate < today;
  };

  // Mevcut izinli günleri kontrol et
  const isExistingAbsence = (day, month, year) => {
    const dateStr = formatDate(day, month, year);
    return student.absenceDates && student.absenceDates.includes(dateStr);
  };

  const handleDateClick = (day, month, year) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const currentDate = new Date(year, month, day);
    const dateStr = formatDate(day, month, year);
    
    console.log('Date clicked:', { day, month, year, dateStr, currentDate });
    
    // Bugün için sadece ekleme yapabilir
    if (currentDate.toDateString() === today.toDateString()) {
      const isExisting = isExistingAbsence(day, month, year);
      
      if (!isExisting) {
        // Bugün için sadece ekleme
        setSelectedDates(prev => {
          const newDates = prev.includes(dateStr) 
            ? prev.filter(date => date !== dateStr)
            : [...prev, dateStr];
          console.log('Today - New dates:', newDates);
          return newDates;
        });
      }
      return;
    }
    
    // Geçmiş günler için izin verme
    if (isPastDate(day, month, year)) {
      return;
    }

    const isExisting = isExistingAbsence(day, month, year);
    
    setSelectedDates(prev => {
      const newDates = prev.includes(dateStr) 
        ? prev.filter(date => date !== dateStr)
        : [...prev, dateStr];
      console.log('Future - New dates:', newDates, 'isExisting:', isExisting);
      return newDates;
    });
  };

  const handleSaveAbsence = () => {
    if (selectedDates.length === 0) {
      alert('Lütfen en az bir tarih seçin.');
      return;
    }
    setShowConfirmation(true);
  };

  const handleConfirmAbsence = () => {
    setShowConfirmation(false);
    setShowSMSVerification(true);
    setOtpCode('');
  };

  const handleRejectAbsence = () => {
    setShowConfirmation(false);
    setSelectedDates([]);
  };

  // SMS doğrulama onayla
  const handleVerifySMS = async () => {
    if (otpCode !== '123456') {
      alert('Geçersiz doğrulama kodu. Demo için 123456 kullanın.');
      return;
    }

    setIsLoading(true);
    
    try {
      // Mevcut izinli günleri al
      const currentAbsenceDates = student.absenceDates || [];
      
      // Seçili tarihleri işle
      let newAbsenceDates = [...currentAbsenceDates];
      
      selectedDates.forEach(date => {
        if (currentAbsenceDates.includes(date)) {
          // Mevcut izinli günü kaldır
          newAbsenceDates = newAbsenceDates.filter(d => d !== date);
        } else {
          // Yeni izin ekle
          newAbsenceDates.push(date);
        }
      });
      
      // Başarılı - veritabanına kaydet
      onSave(student.id, newAbsenceDates);
      
      // SMS ekranını temizle ve loading ekranına geç
      setShowSMSVerification(false);
      setShowLoading(true);
      
      // Loading animasyonu için 2 saniye bekle
      setTimeout(() => {
        setShowLoading(false);
        setShowSuccess(true);
        
        // 3 saniye sonra otomatik kapat
        setTimeout(() => {
          setShowSuccess(false);
          onClose();
        }, 3000);
      }, 2000);
    } catch (error) {
      alert('Bir hata oluştu');
      setShowSMSVerification(false);
    } finally {
      setIsLoading(false);
    }
  };

  // İzin onay ekranı
  if (showConfirmation) {
    return (
      <AbsenceConfirmation
        student={student}
        selectedDates={selectedDates}
        onConfirm={handleConfirmAbsence}
        onReject={handleRejectAbsence}
      />
    );
  }

  // Loading ekranı
  if (showLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 text-center">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            İzin Kaydediliyor...
          </h3>
          <p className="text-gray-600">
            <strong>{student.firstName} {student.lastName}</strong> için izin talebi işleniyor.
          </p>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-primary-600 h-2 rounded-full animate-pulse" style={{width: '70%'}}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Başarı popup'ı
  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">✅</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            İzin Başarıyla Kaydedildi!
          </h3>
          <p className="text-gray-600 mb-4">
            <strong>{student.firstName} {student.lastName}</strong> için {selectedDates.length} günlük izin talebi başarıyla gönderildi.
          </p>
          <div className="bg-green-50 p-3 rounded-lg border border-green-200">
            <p className="text-sm text-green-700">
              İzin talebiniz okul yönetimi tarafından değerlendirilecektir.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // SMS doğrulama ekranı
  if (showSMSVerification) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              SMS Doğrulama
            </h3>
            <p className="text-gray-600 mb-1">
              {parent.phone} numarasına gönderilen
            </p>
            <p className="text-gray-600">
              6 haneli doğrulama kodunu girin
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <input
                type="text"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-xl focus:border-primary-500 focus:outline-none tracking-widest shadow-sm transition-all duration-200"
                placeholder="123456"
                maxLength="6"
                disabled={isLoading}
              />
              <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-center text-sm text-blue-700">
                  <span className="font-semibold">Demo için kullanın:</span> 
                  <span className="font-bold text-lg ml-2">123456</span>
                </p>
              </div>
            </div>

            <button
              onClick={handleVerifySMS}
              disabled={isLoading || otpCode.length !== 6}
              className="w-full px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Doğrulanıyor...
                </div>
              ) : (
                'Doğrula ve Kaydet'
              )}
            </button>

            <button
              onClick={() => {
                setShowSMSVerification(false);
                setShowConfirmation(true);
                setOtpCode('');
              }}
              className="w-full px-6 py-3 bg-white hover:bg-gray-50 text-primary-600 font-medium rounded-xl border-2 border-primary-200 hover:border-primary-300 transition-all duration-200"
            >
              Geri Dön
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Ana takvim ekranı
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-4 max-w-xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              İzin Takvimi - {student.firstName} {student.lastName}
            </h3>
            <p className="text-sm text-gray-600">
              İzinli olmasını istediğiniz günleri seçin
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Takvim */}
        <div className="mt-6 mb-6">
          {/* Ay ve Yıl Navigasyonu */}
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => {
                if (currentMonth === 0) {
                  setCurrentMonth(11);
                  setCurrentYear(currentYear - 1);
                } else {
                  setCurrentMonth(currentMonth - 1);
                }
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <h4 className="text-lg font-semibold text-gray-900">
              {monthNames[currentMonth]} {currentYear}
            </h4>
            
            <button
              onClick={() => {
                if (currentMonth === 11) {
                  setCurrentMonth(0);
                  setCurrentYear(currentYear + 1);
                } else {
                  setCurrentMonth(currentMonth + 1);
                }
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Takvim Grid */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map(day => (
              <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: getFirstDayOfMonth(currentMonth, currentYear) }, (_, i) => (
              <div key={`empty-${i}`} className="h-10"></div>
            ))}
            
            {Array.from({ length: daysInMonth(currentMonth, currentYear) }, (_, i) => {
              const day = i + 1;
              const isSelected = isDateSelected(day, currentMonth, currentYear);
              const isTodayDate = isToday(day, currentMonth, currentYear);
              const isPast = isPastDate(day, currentMonth, currentYear);
              const isExisting = isExistingAbsence(day, currentMonth, currentYear);
              
              return (
                <button
                  key={day}
                  onClick={() => handleDateClick(day, currentMonth, currentYear)}
                  disabled={isPast}
                  className={`h-10 w-10 rounded-lg text-sm font-medium transition-colors ${
                    isSelected
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : isTodayDate
                      ? 'bg-blue-500 text-white hover:bg-blue-600'
                      : isPast
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : isExisting
                      ? 'bg-white text-green-800 border-2 border-green-500 hover:bg-green-50'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        {/* Seçili Tarihler */}
        {selectedDates.length > 0 && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2">Seçili Tarihler ({selectedDates.length} gün):</h4>
            <div className="flex flex-wrap gap-2">
              {selectedDates.map((date, index) => {
                console.log('Selected date:', date, 'Formatted:', new Date(date).toLocaleDateString('tr-TR'));
                return (
                  <span
                    key={date}
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                  >
                    {new Date(date).toLocaleDateString('tr-TR')}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Butonlar */}
        <div className="flex space-x-3">
          <button
            onClick={handleSaveAbsence}
            disabled={selectedDates.length === 0}
            className="flex-1 px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-xs"
          >
            İzinleri Kaydet ({selectedDates.length} gün)
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-3 py-1.5 bg-white hover:bg-gray-50 text-primary-600 font-medium rounded-lg border border-primary-200 transition-colors duration-200 text-xs"
          >
            İptal
          </button>
        </div>

        {/* Açıklama */}
        <div className="mt-6 flex items-center justify-center space-x-3 text-xs flex-wrap gap-y-1">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-gray-600">Seçili günler</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-white border-2 border-green-500 rounded"></div>
            <span className="text-gray-600">Mevcut izinli günler</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-gray-600">Bugün</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-white border border-gray-300 rounded"></div>
            <span className="text-gray-600">Gelecek günler</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-200 rounded"></div>
            <span className="text-gray-600">Geçmiş günler</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AbsenceManager;