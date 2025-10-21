import React, { useState, useEffect } from 'react';
import Calendar from './Calendar';
import MiniCalendar from './MiniCalendar';
import AbsenceManager from './AbsenceManager';
import NotificationPanel from './NotificationPanel';
import LoadingSpinner from './LoadingSpinner';
import StatusIndicator from './StatusIndicator';
import MetricCard from './MetricCard';
import ProgressRing from './ProgressRing';
import authService from '../services/demoAuthService';

const Dashboard = ({ parent, onLogout, isDarkMode, toggleDarkMode }) => {
  const [activeTab, setActiveTab] = useState('students');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showAbsenceManager, setShowAbsenceManager] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showQuickStats, setShowQuickStats] = useState(true);
  const [showHelpPopup, setShowHelpPopup] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [systemStats, setSystemStats] = useState({
    totalStudents: 0,
    activeToday: 0,
    attendanceRate: 0,
    recentActivity: 0
  });

  // Sayfa yüklendiğinde en üste scroll et
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Gerçek zamanlı saat güncellemesi
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // İlk öğrenciyi seçili olarak ayarla
    if (parent.students.length > 0 && !selectedStudent) {
      setSelectedStudent(parent.students[0]);
    }
  }, [parent.students, selectedStudent]);

  // Bildirimleri simüle et
  useEffect(() => {
    const mockNotifications = [
      { id: 1, message: 'Yeni izin talebi alındı', time: '2 saat önce', type: 'info' },
      { id: 2, message: 'Sistem güncellemesi tamamlandı', time: '1 gün önce', type: 'success' },
      { id: 3, message: 'İzin takvimi güncellendi', time: '3 gün önce', type: 'info' }
    ];
    setNotifications(mockNotifications);
  }, []);

  // Sistem istatistiklerini güncelle
  useEffect(() => {
    const totalStudents = parent.students.length;
    const today = new Date().toDateString();
    const activeToday = parent.students.filter(student => {
      return !student.absenceDates?.some(date => new Date(date).toDateString() === today);
    }).length;
    const attendanceRate = totalStudents > 0 ? (activeToday / totalStudents) * 100 : 0;
    
    setSystemStats({
      totalStudents,
      activeToday,
      attendanceRate: Math.round(attendanceRate),
      recentActivity: Math.floor(Math.random() * 20) + 5
    });
  }, [parent.students]);

  const handleLogout = async () => {
    await authService.signOut();
    onLogout();
  };

  // İzin kaydetme fonksiyonu
  const handleSaveAbsence = async (studentId, newAbsenceDates) => {
    try {
      // Gerçek veritabanına kaydet
      const { updateStudentAbsenceDates } = await import('../data/mockData');
      await updateStudentAbsenceDates(studentId, newAbsenceDates);
      
      console.log('İzin başarıyla kaydedildi:', { studentId, newAbsenceDates });
      setShowAbsenceManager(false);
      
      // Parent state'ini güncelle
      const updatedStudents = parent.students.map(student => 
        student.id === studentId 
          ? { ...student, absenceDates: newAbsenceDates }
          : student
      );
      
      // Parent state'ini güncelle (gerçek uygulamada parent'ı yeniden fetch etmek daha iyi olur)
      parent.students = updatedStudents;
      
    } catch (error) {
      console.error('İzin kaydetme hatası:', error);
      alert('İzin kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.');
    }
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
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Header */}
      <header className="bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 md:py-6">
            <div className="flex items-center space-x-4">
              <h1 className={`text-sm md:text-base font-medium transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Sabancı Lise Yaz Okulu
              </h1>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowHelpPopup(!showHelpPopup)}
                className={`w-6 h-6 rounded-full flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
                title="Yardım"
              >
                <span className="text-sm font-bold">?</span>
              </button>
              
              
              <button
                onClick={handleLogout}
                className={`text-sm font-normal py-1 px-3 rounded-full border transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                  isDarkMode 
                    ? 'bg-gray-800 hover:bg-gray-700 text-gray-200 border-gray-600' 
                    : 'bg-white hover:bg-gray-50 text-primary-600 border-primary-200'
                }`}
              >
                Çıkış Yap
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-8">
        {/* Welcome Section */}
        <div className="mb-3">
          <div className="flex justify-between items-start">
            <div>
              <div className="mb-2">
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-pink-100 text-pink-800">
                  Veli
                </span>
              </div>
              <h2 className={`text-xl font-bold mb-2 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Hoş geldin, {parent.name} 👋
              </h2>
            </div>
            
            <div className="flex flex-col items-end space-y-2">
              {/* Hızlı İstatistikler Toggle */}
              <button
                onClick={() => setShowQuickStats(!showQuickStats)}
                className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                <span>{showQuickStats ? 'Gizle' : 'Göster'}</span>
                <svg className={`w-4 h-4 transition-transform ${showQuickStats ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
            </div>
          </div>
        </div>

        {/* Hızlı İstatistikler */}
        {showQuickStats && (
          <div className={`mb-8 grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <MetricCard
              title="Toplam Çocuk"
              value={parent.students.length}
              color="primary"
            />

            <MetricCard
              title="Aktif İzinler"
              value={parent.students.reduce((total, student) => total + (student.absenceDates?.length || 0), 0)}
              color="warning"
              icon={
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
              }
            />

            <MetricCard
              title="Bu Ay İzin"
              value={parent.students.reduce((total, student) => {
                const currentMonth = new Date().getMonth();
                const currentYear = new Date().getFullYear();
                const monthlyAbsences = student.absenceDates?.filter(date => {
                  const dateObj = new Date(date);
                  return dateObj.getMonth() === currentMonth && dateObj.getFullYear() === currentYear;
                }).length || 0;
                return total + monthlyAbsences;
              }, 0)}
              color="success"
            />

            <MetricCard
              title="Aktif Programlar"
              value={new Set(parent.students.map(student => student.program)).size}
              color="purple"
            />
          </div>
        )}



        {/* Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-2">
            <button
              onClick={() => setActiveTab('students')}
              className={`py-2 px-4 rounded-full font-medium text-sm transition-all duration-200 ${
                activeTab === 'students'
                  ? isDarkMode 
                    ? 'bg-primary-900 text-primary-300 border-2 border-primary-600 shadow-sm'
                    : 'bg-primary-50 text-primary-600 border-2 border-primary-500 shadow-sm'
                  : isDarkMode
                    ? 'bg-gray-700 text-gray-300 border-2 border-gray-600 hover:bg-gray-600 hover:text-gray-200 hover:border-gray-500'
                    : 'bg-gray-100 text-gray-600 border-2 border-gray-300 hover:bg-gray-200 hover:text-gray-800 hover:border-gray-400'
              }`}
            >
              Çocuklarım
            </button>
            <button
              onClick={() => setActiveTab('help')}
              className={`py-2 px-4 rounded-full font-medium text-sm transition-all duration-200 ${
                activeTab === 'help'
                  ? isDarkMode 
                    ? 'bg-primary-900 text-primary-300 border-2 border-primary-600 shadow-sm'
                    : 'bg-primary-50 text-primary-600 border-2 border-primary-500 shadow-sm'
                  : isDarkMode
                    ? 'bg-gray-700 text-gray-300 border-2 border-gray-600 hover:bg-gray-600 hover:text-gray-200 hover:border-gray-500'
                    : 'bg-gray-100 text-gray-600 border-2 border-gray-300 hover:bg-gray-200 hover:text-gray-800 hover:border-gray-400'
              }`}
            >
              Yardım
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className={`rounded-lg shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          {activeTab === 'students' && (
            <div>
              <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Çocuklarınız ({parent.students.length})
              </h3>
              <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                {parent.students.map((student) => (
                  <div key={student.id} className={`p-4 rounded-2xl border hover:shadow-md transition-shadow ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-base font-semibold text-gray-900">
                        {student.firstName} {student.lastName}
                      </h4>
                      <span className="px-2 py-1 text-xs font-medium bg-primary-100 text-primary-800 rounded-full">
                        Öğrenci
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Program
                        </label>
                        <p className="text-sm text-gray-900">{student.program}</p>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Dönem
                        </label>
                        <p className="text-sm text-gray-900">{getSemesterText(student.semester)}</p>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Doğum Tarihi
                        </label>
                        <p className="text-sm text-gray-900">{formatDate(student.birthDate)}</p>
                      </div>
                      
                      <div>
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
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          İzinli Günler
                        </label>
                        <MiniCalendar absenceDates={student.absenceDates || []} />
                        <button
                          onClick={() => {
                            setSelectedStudent(student);
                            setShowAbsenceManager(true);
                          }}
                          className="w-full mt-2 px-3 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
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

          {activeTab === 'help' && (
            <div>
              <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Yardım ve İletişim
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`p-6 rounded-2xl border hover:shadow-md transition-shadow ${isDarkMode ? 'bg-gray-800 border-gray-700 hover:border-gray-600' : 'bg-gray-50 border-gray-200 hover:border-gray-300'}`}>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">İletişim Bilgileri</h4>
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-medium text-gray-700 mb-2">E-posta</h5>
                      <p className="text-primary-600">info@sabanciyazokulu.com</p>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-700 mb-2">Telefon</h5>
                      <p className="text-primary-600">+90 216 483 90 00</p>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-700 mb-2">Çalışma Saatleri</h5>
                      <p className="text-gray-600">Pazartesi - Cuma: 09:00 - 17:00</p>
                    </div>
                  </div>
                </div>
                
                <div className={`p-6 rounded-2xl border hover:shadow-md transition-shadow ${isDarkMode ? 'bg-gray-800 border-gray-700 hover:border-gray-600' : 'bg-gray-50 border-gray-200 hover:border-gray-300'}`}>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Sıkça Sorulan Sorular</h4>
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-medium text-gray-700 mb-1">İzin nasıl eklerim?</h5>
                      <p className="text-sm text-gray-600">Çocuğunuzun kartındaki "İzin Ekle/Değiştir" butonuna tıklayın.</p>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-700 mb-1">SMS kodu gelmiyor?</h5>
                      <p className="text-sm text-gray-600">Demo modunda 123456 kodunu kullanın.</p>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-700 mb-1">Birden fazla çocuğum var?</h5>
                      <p className="text-sm text-gray-600">Tüm çocuklarınızı aynı sayfada görebilirsiniz.</p>
                    </div>
                  </div>
                </div>
              </div>
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

        {/* Bildirim Paneli */}
        <NotificationPanel
          notifications={notifications}
          isOpen={showNotifications}
          onClose={() => setShowNotifications(false)}
        />

        {/* Loading Overlay */}
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <LoadingSpinner size="large" text="İşlem gerçekleştiriliyor..." />
            </div>
          </div>
        )}

      </div>

      {/* Help Popup */}
      {showHelpPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                Lyo Veli Portalı
              </h3>
              <button
                onClick={() => setShowHelpPopup(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-gray-600">
              Lyo veli portalına hoş geldiniz. Çocuklarınızın bilgilerini görüntüleyebilir ve takip edebilirsiniz.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
