import React, { useState, useEffect } from 'react';
import Calendar from './Calendar';
import MiniCalendar from './MiniCalendar';
import AbsenceManager from './AbsenceManager';
import authService from '../services/demoAuthService';

const Dashboard = ({ parent, onLogout }) => {
  const [activeTab, setActiveTab] = useState('students');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showAbsenceManager, setShowAbsenceManager] = useState(false);

  useEffect(() => {
    // İlk öğrenciyi seçili olarak ayarla
    if (parent.students.length > 0 && !selectedStudent) {
      setSelectedStudent(parent.students[0]);
    }
  }, [parent.students, selectedStudent]);

  const handleLogout = async () => {
    await authService.signOut();
    onLogout();
  };

  // İzin kaydetme fonksiyonu
  const handleSaveAbsence = (studentId, newAbsenceDates) => {
    // Demo için sadece state güncellemesi
    // Gerçek uygulamada API çağrısı yapılacak
    console.log('İzin kaydedildi:', { studentId, newAbsenceDates });
    setShowAbsenceManager(false);
    // State'i güncelle (gerçek uygulamada API'den yeni veri çekilecek)
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('tr-TR');
  };

  const getSemesterText = (semester) => {
    const semesterTexts = {
      1: '1. Dönem',
      2: '2. Dönem', 
      3: '3. Dönem'
    };
    return semesterTexts[semester] || semester;
  };

  const getPermissionText = (permission) => {
    const permissionTexts = {
      academic: 'Akademik',
      transportation: 'Ulaşım',
      meals: 'Yemek',
      library: 'Kütüphane',
      sports: 'Spor'
    };
    return permissionTexts[permission] || permission;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-2">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">L</span>
              </div>
              <h1 className="ml-2 text-lg font-semibold text-gray-900">
                Lyo Portal
              </h1>
            </div>
            <button
              onClick={handleLogout}
              className="btn-secondary text-sm px-4 py-2"
            >
              Çıkış Yap
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Hoş geldin, {parent.name}!
          </h2>
          <p className="text-gray-600">
            Lyo veli portalına hoş geldiniz. Çocuklarınızın bilgilerini görüntüleyebilir ve takip edebilirsiniz.
          </p>
          <div className="mt-2 flex items-center space-x-2">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              parent.type === 'mother' 
                ? 'bg-pink-100 text-pink-800' 
                : 'bg-blue-100 text-blue-800'
            }`}>
              {parent.type === 'mother' ? 'Anne' : 'Baba'}
            </span>
            <span className="text-sm text-gray-500">{parent.phone}</span>
          </div>
        </div>

        {/* Student Selection */}
        {parent.students.length > 1 && (
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Çocuğunuzu Seçin</h3>
            <div className="flex flex-wrap gap-2">
              {parent.students.map((student) => (
                <button
                  key={student.id}
                  onClick={() => setSelectedStudent(student)}
                  className={`px-4 py-2 rounded-lg border transition-all duration-200 ${
                    selectedStudent?.id === student.id
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-primary-300 hover:bg-primary-25'
                  }`}
                >
                  {student.firstName} {student.lastName}
                  <span className="block text-xs text-gray-500">{student.program}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('students')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'students'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Çocuklarım
            </button>
            <button
              onClick={() => setActiveTab('calendar')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'calendar'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Takvim
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm border">
          {activeTab === 'students' && (
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Çocuklarınız ({parent.students.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {parent.students.map((student) => (
                  <div key={student.id} className="bg-gray-50 p-6 rounded-lg border hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-gray-900">
                        {student.firstName} {student.lastName}
                      </h4>
                      <span className="px-2 py-1 text-xs font-medium bg-primary-100 text-primary-800 rounded-full">
                        {student.id}
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Program
                        </label>
                        <p className="text-gray-900">{student.program}</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Dönem
                        </label>
                        <p className="text-gray-900">{getSemesterText(student.semester)}</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Doğum Tarihi
                        </label>
                        <p className="text-gray-900">{formatDate(student.birthDate)}</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          İzinler
                        </label>
                        <div className="flex flex-wrap gap-1">
                          {student.permissions.map((permission) => (
                            <span
                              key={permission}
                              className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800"
                            >
                              {getPermissionText(permission)}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          İzinli Günler
                        </label>
                        <MiniCalendar absenceDates={student.absenceDates || []} />
                        <button
                          onClick={() => {
                            setSelectedStudent(student);
                            setShowAbsenceManager(true);
                          }}
                          className="w-full mt-3 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors duration-200"
                        >
                          İzin Ekle/Değiştir
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'calendar' && selectedStudent && (
            <div className="p-6">
              <Calendar 
                student={selectedStudent} 
                absenceDates={selectedStudent.absenceDates || []} 
              />
            </div>
          )}
        </div>

        {/* İzin Yöneticisi Modal */}
        {showAbsenceManager && selectedStudent && (
          <AbsenceManager
            student={selectedStudent}
            parent={parent}
            onClose={() => setShowAbsenceManager(false)}
            onSave={handleSaveAbsence}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
