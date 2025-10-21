// API service for Netlify functions
const API_BASE_URL = 'https://lyo-prototip.netlify.app/.netlify/functions';

export const apiService = {
  // Veli ara
  async findParentByPhone(phoneNumber) {
    try {
      const response = await fetch(`${API_BASE_URL}/find-parent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API error in findParentByPhone:', error);
      throw error;
    }
  },

  // İzin güncelle
  async updateAbsenceDates(studentId, absenceDates) {
    try {
      const response = await fetch(`${API_BASE_URL}/update-absence`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ studentId, absenceDates }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API error in updateAbsenceDates:', error);
      throw error;
    }
  },

  // Tüm öğrenciler (admin için)
  async getAllStudents() {
    try {
      const response = await fetch(`${API_BASE_URL}/get-students`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API error in getAllStudents:', error);
      throw error;
    }
  }
};
