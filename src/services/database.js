import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export const db = {
  // Öğrenci ara
  async findStudentById(id) {
    try {
      const result = await pool.query('SELECT * FROM students WHERE id = $1', [id]);
      return result.rows[0];
    } catch (error) {
      console.error('Database error in findStudentById:', error);
      throw error;
    }
  },

  // Veli ara (telefon numarasına göre)
  async findParentByPhone(phone) {
    try {
      const result = await pool.query(
        'SELECT * FROM students WHERE mother_phone = $1 OR father_phone = $1',
        [phone]
      );
      return result.rows;
    } catch (error) {
      console.error('Database error in findParentByPhone:', error);
      throw error;
    }
  },

  // İzin güncelle
  async updateAbsenceDates(studentId, dates) {
    try {
      const result = await pool.query(
        'UPDATE students SET absence_dates = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
        [JSON.stringify(dates), studentId]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Database error in updateAbsenceDates:', error);
      throw error;
    }
  },

  // Tüm öğrenciler (admin için)
  async getAllStudents() {
    try {
      const result = await pool.query('SELECT * FROM students WHERE is_active = true ORDER BY first_name');
      return result.rows;
    } catch (error) {
      console.error('Database error in getAllStudents:', error);
      throw error;
    }
  },

  // Öğrenci ara (isim ile)
  async searchStudentsByName(searchTerm) {
    try {
      const result = await pool.query(
        'SELECT * FROM students WHERE (first_name ILIKE $1 OR last_name ILIKE $1 OR CONCAT(first_name, \' \', last_name) ILIKE $1) AND is_active = true ORDER BY first_name',
        [`%${searchTerm}%`]
      );
      return result.rows;
    } catch (error) {
      console.error('Database error in searchStudentsByName:', error);
      throw error;
    }
  },

  // Program'a göre filtrele
  async getStudentsByProgram(program) {
    try {
      const result = await pool.query(
        'SELECT * FROM students WHERE program = $1 AND is_active = true ORDER BY first_name',
        [program]
      );
      return result.rows;
    } catch (error) {
      console.error('Database error in getStudentsByProgram:', error);
      throw error;
    }
  },

  // Dönem'e göre filtrele
  async getStudentsBySemester(semester) {
    try {
      const result = await pool.query(
        'SELECT * FROM students WHERE semester = $1 AND is_active = true ORDER BY first_name',
        [semester]
      );
      return result.rows;
    } catch (error) {
      console.error('Database error in getStudentsBySemester:', error);
      throw error;
    }
  },

  // İstatistikler (admin için)
  async getStatistics() {
    try {
      const totalStudents = await pool.query('SELECT COUNT(*) FROM students WHERE is_active = true');
      const programStats = await pool.query('SELECT program, COUNT(*) as count FROM students WHERE is_active = true GROUP BY program');
      const semesterStats = await pool.query('SELECT semester, COUNT(*) as count FROM students WHERE is_active = true GROUP BY semester');
      
      return {
        totalStudents: parseInt(totalStudents.rows[0].count),
        programStats: programStats.rows,
        semesterStats: semesterStats.rows
      };
    } catch (error) {
      console.error('Database error in getStatistics:', error);
      throw error;
    }
  }
};
