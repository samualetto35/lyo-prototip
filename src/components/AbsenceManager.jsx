import React, { useState } from 'react';
import AbsenceConfirmation from './AbsenceConfirmation';
import authService from '../services/demoAuthService';

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
  const [errorMessage, setErrorMessage] = useState('');

  // OTP input handler
  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Sadece rakam
    if (value.length <= 6) {
      setOtpCode(value);
      setErrorMessage(''); // Hata mesajını temizle
    }
  };

  // OTP otomatik doğrulama
  useEffect(() => {
    if (otpCode.length === 6) {
      handleVerifySMS(otpCode);
    }
  }, [otpCode]);

  const monthNames = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ];
  
  const dayNames = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

  // Ayın ilk günü ve son günü
  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  const firstDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

  // Ay değiştirme
  const changeMonth = (direction) => {
    setCurrentMonth(prev => {
      const newMonth = prev + direction;
      if (newMonth < 0) {
        setCurrentYear(currentYear - 1);
        return 11;
      } else if (newMonth > 11) {
        setCurrentYear(currentYear + 1);
        return 0;
      }
      return newMonth;
    });
  };

  // Tarih seçimi
  const handleDateClick = (day) => {
    const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    setSelectedDates(prev => {
      if (prev.includes(dateString)) {
        return prev.filter(date => date !== dateString);
      } else {
        return [...prev, dateString];
      }
    });
  };

  // Gün render etme
  const renderDays = () => {
    const days = [];
    const totalDays = lastDay.getDate();
    
    // Boş günler
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="h-12 w-12"></div>);
    }
    
    // Ayın günleri
    for (let day = 1; day <= totalDays; day++) {
      const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isSelected = selectedDates.includes(dateString);
      const isToday = new Date().toDateString() === new Date(currentYear, currentMonth, day).toDateString();
      const isPast = new Date(dateString) < new Date(new Date().setHours(0, 0, 0, 0));
      
      days.push(
        <button
          key={day}
          onClick={() => !isPast && handleDateClick(day)}
          disabled={isPast}
          className={`h-12 w-12 flex items-center justify-center text-sm rounded-lg transition-all duration-200 ${
            isPast
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : isSelected
              ? 'bg-green-500 text-white hover:bg-green-600'
              : isToday
              ? 'bg-primary-100 text-primary-700 hover:bg-primary-200'
              : 'hover:bg-gray-100 text-gray-700'
          }`}
        >
          {day}
        </button>
      );
    }
    
    return days;
  };

  // İzin kaydetme başlat
  const handleSaveAbsence = async () => {
    if (selectedDates.length === 0) {
      alert('Lütfen en az bir gün seçin');
      return;
    }

    setShowConfirmation(true);
  };

  // İzin onayı
  const handleConfirmAbsence = () => {
    setShowConfirmation(false);
    setShowSMSVerification(true);
    setOtpCode('');
    setErrorMessage('');
  };

  // İzin reddi
  const handleRejectAbsence = () => {
    setShowConfirmation(false);
    // Seçimleri temizle
    setSelectedDates([]);
  };

  // SMS doğrulama onayla
  const handleVerifySMS = async (code) => {
    setIsLoading(true);
    setErrorMessage('');
    
    try {
      // Demo için sabit OTP kontrolü
      if (code === '123456') {
        // Başarılı - veritabanına kaydet (demo için sadece state güncelle)
        onSave(student.id, selectedDates);
        
        // Loading ekranını göster
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
      } else {
        setErrorMessage('Geçersiz doğrulama kodu. Lütfen tekrar deneyin.');
        setIsLoading(false);
      }
    } catch (error) {
      setErrorMessage('Bir hata oluştu. Lütfen tekrar deneyin.');
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
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              SMS Doğrulama
            </h3>
            <p className="text-gray-600 mb-2">
              İzin onayı için doğrulama gerekli
            </p>
            <p className="text-sm text-gray-500">
              <span className="font-medium">{parent.phone}</span> numarasına gönderilen 
              6 haneli kodu girin
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <input
                type="text"
                value={otpCode}
                onChange={handleOtpChange}
                className="w-full h-12 text-center text-xl font-bold border border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none tracking-widest"
                placeholder="123456"
                maxLength="6"
                disabled={isLoading}
              />
              {errorMessage && (
                <p className="mt-2 text-sm text-red-600 text-center">{errorMessage}</p>
              )}
            </div>

            <button
              onClick={() => handleVerifySMS(otpCode)}
              disabled={isLoading || otpCode.length !== 6}
              className="w-full px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 text-sm"
            >
              {isLoading ? 'Doğrulanıyor...' : 'Doğrula ve Kaydet'}
            </button>

            <button
              onClick={() => {
                setShowSMSVerification(false);
                setShowConfirmation(true);
              }}
              className="w-full px-4 py-2 bg-white hover:bg-gray-50 text-primary-600 font-medium rounded-lg border border-primary-200 transition-colors duration-200 text-sm"
            >
              Geri Dön
            </button>

            <div className="text-center text-sm text-gray-500">
              <p>Demo için kullanın: <strong>123456</strong></p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            İzin Ekle/Değiştir - {student.firstName} {student.lastName}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Takvim Kontrolleri */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => changeMonth(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h3 className="text-xl font-semibold text-gray-900">
            {monthNames[currentMonth]} {currentYear}
          </h3>
          <button
            onClick={() => changeMonth(1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Takvim */}
        <div className="mb-6">
          {/* Gün başlıkları */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {dayNames.map(day => (
              <div key={day} className="h-8 flex items-center justify-center text-sm font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>

          {/* Takvim günleri */}
          <div className="grid grid-cols-7 gap-2">
            {renderDays()}
          </div>
        </div>

        {/* Seçili tarihler */}
        {selectedDates.length > 0 && (
          <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <h4 className="font-medium text-green-900 mb-2">Seçili İzinli Günler:</h4>
            <div className="flex flex-wrap gap-2">
              {selectedDates.map(date => (
                <span key={date} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  {new Date(date).toLocaleDateString('tr-TR')}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Butonlar */}
        <div className="flex space-x-3">
          <button
            onClick={handleSaveAbsence}
            disabled={selectedDates.length === 0}
            className="flex-1 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            İzinleri Kaydet ({selectedDates.length} gün)
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-white hover:bg-gray-50 text-primary-600 font-medium rounded-lg border border-primary-200 transition-colors duration-200 text-sm"
          >
            İptal
          </button>
        </div>

        {/* Açıklama */}
        <div className="mt-6 flex items-center justify-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-gray-600">Seçili İzin Günü</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-primary-500 rounded"></div>
            <span className="text-gray-600">Bugün</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-400 rounded"></div>
            <span className="text-gray-600">Geçmiş Günler</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AbsenceManager;
