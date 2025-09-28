// Mock veritabanı - Gerçek projede bu veriler bir veritabanından gelecek
export const studentsData = [
  {
    id: 'STU001',
    firstName: 'Ahmet',
    lastName: 'Yılmaz',
    phoneNumber: '+905551234567',
    motherId: 'PAR001',
    motherName: 'Ayşe Yılmaz',
    motherPhone: '+905559876543',
    fatherId: 'PAR002',
    fatherName: 'Mehmet Yılmaz',
    fatherPhone: '+905557654321',
    birthDate: '2010-05-15',
    program: 'İlkokul 4. Sınıf',
    semester: 1,
    permissions: ['academic', 'transportation', 'meals'],
    absenceDates: ['2024-01-15', '2024-01-16', '2024-02-20', '2024-02-22', '2024-02-23']
  },
  {
    id: 'STU002',
    firstName: 'Zeynep',
    lastName: 'Demir',
    phoneNumber: '+905556543210',
    motherId: 'PAR003',
    motherName: 'Fatma Demir',
    motherPhone: '+905554321098',
    fatherId: 'PAR004',
    fatherName: 'Ali Demir',
    fatherPhone: '+905552109876',
    birthDate: '2009-03-22',
    program: 'Ortaokul 2. Sınıf',
    semester: 2,
    permissions: ['academic', 'library', 'sports'],
    absenceDates: ['2024-01-10', '2024-01-25', '2024-02-14']
  },
  {
    id: 'STU003',
    firstName: 'Emre',
    lastName: 'Kaya',
    phoneNumber: '+905553210987',
    motherId: 'PAR005',
    motherName: 'Sema Kaya',
    motherPhone: '+905551098765',
    fatherId: 'PAR006',
    fatherName: 'Okan Kaya',
    fatherPhone: '+905559876543',
    birthDate: '2011-12-08',
    program: 'İlkokul 3. Sınıf',
    semester: 1,
    permissions: ['academic', 'transportation'],
    absenceDates: ['2024-01-18', '2024-02-05', '2024-02-06', '2024-02-28']
  },
  {
    id: 'STU004',
    firstName: 'Elif',
    lastName: 'Yılmaz',
    phoneNumber: '+905550987654',
    motherId: 'PAR001', // Ahmet ile aynı anne
    motherName: 'Ayşe Yılmaz',
    motherPhone: '+905559876543',
    fatherId: 'PAR002', // Ahmet ile aynı baba
    fatherName: 'Mehmet Yılmaz',
    fatherPhone: '+905557654321',
    birthDate: '2012-08-30',
    program: 'İlkokul 2. Sınıf',
    semester: 1,
    permissions: ['academic', 'transportation', 'meals'],
    absenceDates: ['2024-01-12', '2024-01-30', '2024-02-18', '2024-02-19']
  },
  {
    id: 'STU005',
    firstName: 'Can',
    lastName: 'Özkan',
    phoneNumber: '+905549876543',
    motherId: 'PAR007',
    motherName: 'Gül Özkan',
    motherPhone: '+905548765432',
    fatherId: 'PAR008',
    fatherName: 'Hasan Özkan',
    fatherPhone: '+905547654321',
    birthDate: '2008-11-14',
    program: 'Ortaokul 3. Sınıf',
    semester: 3,
    permissions: ['academic', 'library', 'sports', 'transportation'],
    absenceDates: ['2024-01-08', '2024-02-15', '2024-02-25', '2024-02-26', '2024-02-27']
  }
];

// Veli telefon numarasına göre veli bilgisi ve çocukları bulma
export const findParentByPhone = (phoneNumber) => {
  const cleanPhone = phoneNumber.replace(/\D/g, '');
  const formattedPhone = `+${cleanPhone}`;

  // Admin kontrolü - 999 numarası
  if (cleanPhone === '999') {
    return {
      type: 'admin',
      name: 'Güvenlik Asistanı',
      phone: '+999',
      students: studentsData // Tüm öğrencileri döndür
    };
  }

  // Anne olarak ara
  const motherStudents = studentsData.filter(student => student.motherPhone === formattedPhone);
  if (motherStudents.length > 0) {
    return {
      type: 'mother',
      name: motherStudents[0].motherName,
      phone: formattedPhone,
      students: motherStudents
    };
  }

  // Baba olarak ara
  const fatherStudents = studentsData.filter(student => student.fatherPhone === formattedPhone);
  if (fatherStudents.length > 0) {
    return {
      type: 'father',
      name: fatherStudents[0].fatherName,
      phone: formattedPhone,
      students: fatherStudents
    };
  }

  return null;
};

// Telefon numarasına göre öğrenci arama fonksiyonu (eski - geriye uyumluluk için)
export const findStudentByPhone = (phoneNumber) => {
  return studentsData.find(student => 
    student.phoneNumber === phoneNumber ||
    student.motherPhone === phoneNumber ||
    student.fatherPhone === phoneNumber
  );
};

// Öğrenci ID'sine göre arama
export const findStudentById = (studentId) => {
  return studentsData.find(student => student.id === studentId);
};

// Aynı veliye ait tüm öğrencileri bulma
export const findStudentsByParent = (parentId) => {
  return studentsData.filter(student => 
    student.motherId === parentId || student.fatherId === parentId
  );
};

// Kardeş öğrencileri bulma
export const findSiblings = (studentId) => {
  const student = findStudentById(studentId);
  if (!student) return [];
  
  return studentsData.filter(s => 
    s.id !== studentId && 
    (s.motherId === student.motherId || s.fatherId === student.fatherId)
  );
};
