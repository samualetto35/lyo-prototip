// API endpoint to find parent by phone number
import { pool } from './db.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { phoneNumber } = req.body;
    
    if (!phoneNumber) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    const cleanPhone = phoneNumber.replace(/\D/g, '');
    const formattedPhone = `+${cleanPhone}`;

    // Admin kontrolü - 999 numarası (Turkey +90 ile birlikte)
    if (cleanPhone === '999' || cleanPhone === '90999') {
      const allStudents = await pool.query('SELECT * FROM students WHERE is_active = true ORDER BY first_name');
      
      return res.status(200).json({
        success: true,
        parent: {
          type: 'admin',
          name: 'Güvenlik Asistanı',
          phone: '+90999',
          students: allStudents.rows.map(student => ({
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
          }))
        }
      });
    }

    // Database'den veli ara
    const result = await pool.query(
      'SELECT * FROM students WHERE mother_phone = $1 OR father_phone = $1',
      [formattedPhone]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Bu telefon numarası sistemde kayıtlı değil' 
      });
    }

    // İlk öğrencinin veli bilgilerini al
    const firstStudent = result.rows[0];
    const isMother = firstStudent.mother_phone === formattedPhone;
    
    const parent = {
      type: isMother ? 'mother' : 'father',
      name: isMother ? firstStudent.mother_name : firstStudent.father_name,
      phone: formattedPhone,
      students: result.rows.map(student => ({
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
      }))
    };

    res.status(200).json({ success: true, parent });

  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Database hatası' 
    });
  }
}
