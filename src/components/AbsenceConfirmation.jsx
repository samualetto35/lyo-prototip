import React from 'react';

const AbsenceConfirmation = ({ student, selectedDates, onConfirm, onReject }) => {
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

        {/* Seçili Tarihler */}
        <div className="mb-4">
          <h4 className="font-medium text-gray-900 mb-2">İzinli Olması İstenen Tarihler:</h4>
          <div className="space-y-1">
            {selectedDates.map((date, index) => (
              <div key={date} className="flex items-center justify-between p-2 bg-blue-50 rounded border border-blue-200">
                <div className="flex items-center space-x-2">
                  <span className="w-5 h-5 bg-blue-500 text-white text-xs font-medium rounded-full flex items-center justify-center">
                    {index + 1}
                  </span>
                  <span className="font-medium text-blue-900 text-sm">{formatDate(date)}</span>
                </div>
                <span className="text-xs text-blue-700 font-mono">{formatDateShort(date)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Toplam İzin Süresi */}
        <div className="bg-yellow-50 p-3 rounded-lg mb-4 border border-yellow-200">
          <div className="flex items-center justify-between">
            <span className="font-medium text-yellow-900 text-sm">Toplam İzin Süresi:</span>
            <span className="text-base font-bold text-yellow-700">
              {selectedDates.length} gün
            </span>
          </div>
          <p className="text-xs text-yellow-700 mt-1">
            Bu tarihlerde öğrenci okula gelmeyecektir.
          </p>
        </div>

        {/* Onay Metni */}
        <div className="mb-4 p-3 bg-gray-50 rounded-lg border">
          <p className="text-xs text-gray-700 leading-relaxed">
            <strong>Veli olarak {student.firstName} {student.lastName}</strong> için yukarıda belirtilen 
            tarihlerde izinli olmasını kabul ediyorum. Bu izinlerin okul yönetimi tarafından 
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