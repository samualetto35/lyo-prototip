import React from 'react';

const AbsenceConfirmation = ({ student, selectedDates, onConfirm, onReject }) => {
  // Mevcut izinli günleri kontrol et
  const currentAbsenceDates = student.absenceDates || [];
  
  // Eklenen ve kaldırılan tarihleri ayır
  const addedDates = selectedDates.filter(date => !currentAbsenceDates.includes(date));
  const removedDates = selectedDates.filter(date => currentAbsenceDates.includes(date));
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateShort = (dateString) => {
    return new Date(dateString).toLocaleDateString('tr-TR');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-lg w-full mx-4">
        <div className="text-center mb-4">
          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 8 8 0 0116 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            İzin Onayı
          </h3>
          <p className="text-sm text-gray-600">
            Aşağıdaki izin talebini onaylıyor musunuz?
          </p>
        </div>

        {/* Öğrenci Bilgisi */}
        <div className="bg-gray-50 p-3 rounded-lg mb-4">
          <h4 className="font-medium text-gray-900 mb-1">Öğrenci</h4>
          <p className="text-base font-semibold text-primary-600">
            {student.firstName} {student.lastName}
          </p>
          <p className="text-xs text-gray-600">{student.program}</p>
        </div>

        {/* Eklenen Tarihler */}
        {addedDates.length > 0 && (
          <div className="mb-4">
            <h4 className="font-medium text-gray-900 mb-2">Yeni İzin Eklenen Tarihler:</h4>
            <div className="space-y-1">
              {addedDates.map((date, index) => (
                <div key={date} className="flex items-center justify-between p-2 bg-green-50 rounded border border-green-200">
                  <div className="flex items-center space-x-2">
                    <span className="w-5 h-5 bg-green-500 text-white text-xs font-medium rounded-full flex items-center justify-center">
                      +
                    </span>
                    <span className="font-medium text-green-900 text-sm">{formatDate(date)}</span>
                  </div>
                  <span className="text-xs text-green-700 font-mono">{formatDateShort(date)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Kaldırılan Tarihler */}
        {removedDates.length > 0 && (
          <div className="mb-4">
            <h4 className="font-medium text-gray-900 mb-2">İzin Kaldırılan Tarihler:</h4>
            <div className="space-y-1">
              {removedDates.map((date, index) => (
                <div key={date} className="flex items-center justify-between p-2 bg-red-50 rounded border border-red-200">
                  <div className="flex items-center space-x-2">
                    <span className="w-5 h-5 bg-red-500 text-white text-xs font-medium rounded-full flex items-center justify-center">
                      -
                    </span>
                    <span className="font-medium text-red-900 text-sm">{formatDate(date)}</span>
                  </div>
                  <span className="text-xs text-red-700 font-mono">{formatDateShort(date)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Özet */}
        <div className="bg-yellow-50 p-3 rounded-lg mb-4 border border-yellow-200">
          <div className="space-y-2">
            {addedDates.length > 0 && (
              <div className="flex items-center justify-between">
                <span className="font-medium text-yellow-900 text-sm">Yeni İzin Eklenen:</span>
                <span className="text-base font-bold text-green-700">
                  {addedDates.length} gün
                </span>
              </div>
            )}
            {removedDates.length > 0 && (
              <div className="flex items-center justify-between">
                <span className="font-medium text-yellow-900 text-sm">İzin Kaldırılan:</span>
                <span className="text-base font-bold text-red-700">
                  {removedDates.length} gün
                </span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="font-medium text-yellow-900 text-sm">Toplam İzin Süresi:</span>
              <span className="text-base font-bold text-yellow-700">
                {currentAbsenceDates.length + addedDates.length - removedDates.length} gün
              </span>
            </div>
          </div>
          <p className="text-xs text-yellow-700 mt-2">
            Bu değişiklikler SMS doğrulama sonrası uygulanacaktır.
          </p>
        </div>

        {/* Onay Metni */}
        <div className="mb-4 p-3 bg-gray-50 rounded-lg border">
          <p className="text-xs text-gray-700 leading-relaxed">
            <strong>Veli olarak {student.firstName} {student.lastName}</strong> için yukarıda belirtilen 
            izin değişikliklerini kabul ediyorum. Bu değişikliklerin okul yönetimi tarafından 
            onaylanması gerekmektedir.
          </p>
        </div>

        {/* Butonlar */}
        <div className="flex space-x-3">
          <button
            onClick={onReject}
            className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors duration-200 border border-gray-300 text-sm"
          >
            Reddet
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors duration-200 text-sm"
          >
            Kabul Et ve Devam Et
          </button>
        </div>

        {/* Uyarı */}
        <div className="mt-3 text-center">
          <p className="text-xs text-gray-500">
            İzin onaylandıktan sonra SMS doğrulama yapılacaktır.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AbsenceConfirmation;