import React, { useState, useEffect } from 'react';
import MiniCalendar from './MiniCalendar';

const AdminDashboard = ({ admin, onLogout }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProgram, setSelectedProgram] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // grid, list, table
  const [sortBy, setSortBy] = useState('name'); // name, program, semester
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Sayfa yüklendiğinde en üste scroll et
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Filtreleme ve sıralama
  const filteredStudents = admin.students
    .filter(student => {
      const matchesSearch = student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesProgram = !selectedProgram || student.program === selectedProgram;
      return matchesSearch && matchesProgram;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
        case 'program':
          return a.program.localeCompare(b.program);
        case 'semester':
          return a.semester - b.semester;
        default:
          return 0;
      }
    });

  // Program listesi
  const programs = [...new Set(admin.students.map(student => student.program))];

  // Bugün izinli öğrenciler
  const todayAbsentStudents = admin.students.filter(student => {
    const today = new Date().toISOString().split('T')[0];
    return student.absenceDates && student.absenceDates.includes(today);
  });

  const handleLogout = async () => {
    await onLogout();
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
      'medical': 'Tıbbi İzin',
      'family': 'Aile İzni',
      'personal': 'Kişisel İzin',
      'emergency': 'Acil İzin'
    };
    return permissionTexts[permission] || permission;
  };

  const isTodayAbsent = (student) => {
    const today = new Date().toISOString().split('T')[0];
    return student.absenceDates && student.absenceDates.includes(today);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 md:py-6">
            <div className="flex items-center">
              <h1 className="text-lg md:text-xl font-semibold text-gray-900">
                Güvenlik Portalı - Sabancı Lise Yaz Okulu
              </h1>
            </div>
            <button
              onClick={handleLogout}
              className="bg-white hover:bg-gray-50 text-primary-600 font-medium py-2 px-4 rounded-full border border-primary-200 transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
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
            Hoş Geldiniz, {admin.name}
          </h2>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
              Güvenlik Asistanı
            </span>
            <span className="text-sm text-gray-500">{admin.phone}</span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Toplam Öğrenci</p>
                <p className="text-2xl font-semibold text-gray-900">{admin.students.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-lg">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Bugün İzinli</p>
                <p className="text-2xl font-semibold text-red-600">{todayAbsentStudents.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Bugün Okulda</p>
                <p className="text-2xl font-semibold text-green-600">{admin.students.length - todayAbsentStudents.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Toplam Program</p>
                <p className="text-2xl font-semibold text-gray-900">{programs.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Öğrenci Ara</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Ad veya soyad..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* Program Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Program</label>
              <select
                value={selectedProgram}
                onChange={(e) => setSelectedProgram(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Tüm Programlar</option>
                {programs.map(program => (
                  <option key={program} value={program}>{program}</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sıralama</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="name">Ad Soyad</option>
                <option value="program">Program</option>
                <option value="semester">Dönem</option>
              </select>
            </div>

            {/* View Mode */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Görünüm</label>
              <div className="flex space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Liste
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    viewMode === 'table' 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Tablo
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Students Display */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Öğrenci Listesi ({filteredStudents.length})
            </h3>

            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStudents.map((student) => (
                  <div key={student.id} className="bg-gray-50 p-4 rounded-lg border hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-base font-semibold text-gray-900">
                        {student.firstName} {student.lastName}
                      </h4>
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-1 text-xs font-medium bg-primary-100 text-primary-800 rounded-full">
                          {student.id}
                        </span>
                        {isTodayAbsent(student) && (
                          <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                            Bugün İzinli
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Program</label>
                        <p className="text-sm text-gray-900">{student.program}</p>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Dönem</label>
                        <p className="text-sm text-gray-900">{getSemesterText(student.semester)}</p>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Doğum Tarihi</label>
                        <p className="text-sm text-gray-900">{formatDate(student.birthDate)}</p>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Veli Bilgileri</label>
                        <p className="text-xs text-gray-600">
                          {student.motherName} - {student.motherPhone}
                        </p>
                        <p className="text-xs text-gray-600">
                          {student.fatherName} - {student.fatherPhone}
                        </p>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">İzinler</label>
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
                        <label className="block text-xs font-medium text-gray-700 mb-1">İzinli Günler</label>
                        <MiniCalendar absenceDates={student.absenceDates || []} />
                        <button
                          onClick={() => {
                            setSelectedStudent(student);
                            setShowCalendar(true);
                          }}
                          className="w-full mt-2 px-3 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                        >
                          Detaylı Takvim
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {viewMode === 'list' && (
              <div className="space-y-4">
                {filteredStudents.map((student) => (
                  <div key={student.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {student.firstName} {student.lastName}
                          </h4>
                          <p className="text-sm text-gray-600">{student.program} - {getSemesterText(student.semester)}</p>
                        </div>
                        <div className="text-sm text-gray-600">
                          <p>Veli: {student.motherName}</p>
                          <p>Tel: {student.motherPhone}</p>
                        </div>
                        <div className="text-sm text-gray-600">
                          <p>Doğum: {formatDate(student.birthDate)}</p>
                          <p>ID: {student.id}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {isTodayAbsent(student) && (
                        <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                          Bugün İzinli
                        </span>
                      )}
                      <button
                        onClick={() => {
                          setSelectedStudent(student);
                          setShowCalendar(true);
                        }}
                        className="px-3 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                      >
                        Takvim
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {viewMode === 'table' && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Öğrenci</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Program</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dönem</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Veli</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telefon</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredStudents.map((student) => (
                      <tr key={student.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{student.firstName} {student.lastName}</div>
                            <div className="text-sm text-gray-500">ID: {student.id}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.program}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getSemesterText(student.semester)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.motherName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.motherPhone}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {isTodayAbsent(student) ? (
                            <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                              İzinli
                            </span>
                          ) : (
                            <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                              Okulda
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => {
                              setSelectedStudent(student);
                              setShowCalendar(true);
                            }}
                            className="text-primary-600 hover:text-primary-900"
                          >
                            Takvim
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Student Calendar Modal */}
        {showCalendar && selectedStudent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {selectedStudent.firstName} {selectedStudent.lastName} - İzin Takvimi
                  </h3>
                  <p className="text-sm text-gray-600">
                    {selectedStudent.program} - {getSemesterText(selectedStudent.semester)}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowCalendar(false);
                    setSelectedStudent(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                {/* Student Info */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">Öğrenci Bilgileri</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Doğum Tarihi:</span>
                      <span className="ml-2 font-medium">{formatDate(selectedStudent.birthDate)}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Veli:</span>
                      <span className="ml-2 font-medium">{selectedStudent.motherName}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Telefon:</span>
                      <span className="ml-2 font-medium">{selectedStudent.motherPhone}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Durum:</span>
                      <span className={`ml-2 font-medium ${isTodayAbsent(selectedStudent) ? 'text-red-600' : 'text-green-600'}`}>
                        {isTodayAbsent(selectedStudent) ? 'Bugün İzinli' : 'Bugün Okulda'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Permissions */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">İzin Türleri</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedStudent.permissions.map((permission) => (
                      <span
                        key={permission}
                        className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full"
                      >
                        {getPermissionText(permission)}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Calendar */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">İzinli Günler</h4>
                  <MiniCalendar absenceDates={selectedStudent.absenceDates || []} />
                </div>

                {/* Absence Dates List */}
                {selectedStudent.absenceDates && selectedStudent.absenceDates.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">İzinli Günler Listesi</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {selectedStudent.absenceDates.map((date, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-blue-50 rounded border">
                          <span className="text-sm font-medium text-blue-900">
                            {new Date(date).toLocaleDateString('tr-TR', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </span>
                          <span className="text-xs text-blue-700 font-mono">{date}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
