// API endpoint to update student absence dates
import { pool } from './db.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { studentId, absenceDates } = req.body;
    
    if (!studentId || !Array.isArray(absenceDates)) {
      return res.status(400).json({ error: 'Student ID and absence dates are required' });
    }

    const result = await pool.query(
      'UPDATE students SET absence_dates = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [JSON.stringify(absenceDates), studentId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const updatedStudent = result.rows[0];
    
    res.status(200).json({
      success: true,
      student: {
        id: updatedStudent.id,
        firstName: updatedStudent.first_name,
        lastName: updatedStudent.last_name,
        phoneNumber: updatedStudent.mother_phone || updatedStudent.father_phone,
        motherId: updatedStudent.mother_id,
        motherName: updatedStudent.mother_name,
        motherPhone: updatedStudent.mother_phone,
        fatherId: updatedStudent.father_id,
        fatherName: updatedStudent.father_name,
        fatherPhone: updatedStudent.father_phone,
        birthDate: updatedStudent.birth_date,
        program: updatedStudent.program,
        semester: updatedStudent.semester,
        permissions: [],
        absenceDates: updatedStudent.absence_dates || []
      }
    });

  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Database hatası' 
    });
  }
}
