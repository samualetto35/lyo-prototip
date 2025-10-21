// API endpoint to get all students (for admin)
import { pool } from './db.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const result = await pool.query('SELECT * FROM students WHERE is_active = true ORDER BY first_name');
    
    const students = result.rows.map(student => ({
      id: student.id,
      firstName: student.first_name,
      lastName: student.last_name,
      phoneNumber: student.mother_phone || student.father_phone,
      motherId: student.mother_id,
      motherName: student.mother_name,
      motherPhone: student.mother_phone,
      fatherId: student.father_id,
      fatherName: student.father_name,
      fatherPhone: student.father_phone,
      birthDate: student.birth_date,
      program: student.program,
      semester: student.semester,
      permissions: [],
      absenceDates: student.absence_dates || []
    }));

    res.status(200).json({ success: true, students });

  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Database hatası' 
    });
  }
}
