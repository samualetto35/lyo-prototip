// Netlify function to find parent by phone number
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Handle preflight request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { phoneNumber } = JSON.parse(event.body);
    
    if (!phoneNumber) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Phone number is required' })
      };
    }

    const cleanPhone = phoneNumber.replace(/\D/g, '');
    const formattedPhone = `+${cleanPhone}`;

    // Admin kontrolü - 999 numarası (Turkey +90 ile birlikte)
    if (cleanPhone === '999' || cleanPhone === '90999') {
      const allStudents = await pool.query('SELECT * FROM students WHERE is_active = true ORDER BY first_name');
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
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
        })
      };
    }

    // Database'den veli ara
    const result = await pool.query(
      'SELECT * FROM students WHERE mother_phone = $1 OR father_phone = $1',
      [formattedPhone]
    );
    
    if (result.rows.length === 0) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ 
          success: false, 
          message: 'Bu telefon numarası sistemde kayıtlı değil' 
        })
      };
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

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, parent })
    };

  } catch (error) {
    console.error('Database error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        success: false, 
        message: 'Database hatası' 
      })
    };
  }
};
