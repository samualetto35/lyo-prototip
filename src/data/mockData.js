// API service entegrasyonu
import { apiService } from '../services/apiService.js';

// API'den öğrenci verilerini çek
export const getStudentsData = async () => {
  try {
    const response = await apiService.getAllStudents();
    return response.success ? response.students : [];
  } catch (error) {
    console.error('Error fetching students:', error);
    return [];
  }
};

// Veli telefon numarasına göre veli bilgisi ve çocukları bulma
export const findParentByPhone = async (phoneNumber) => {
  try {
    const response = await apiService.findParentByPhone(phoneNumber);
    return response.success ? response.parent : null;
  } catch (error) {
    console.error('Error finding parent by phone:', error);
    return null;
  }
};

// İzin güncelleme fonksiyonu
export const updateStudentAbsenceDates = async (studentId, dates) => {
  try {
    const response = await apiService.updateAbsenceDates(studentId, dates);
    return response.success ? response.student : null;
  } catch (error) {
    console.error('Error updating student absence dates:', error);
    throw error;
  }
};
