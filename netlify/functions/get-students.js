// Netlify function to get all students (for admin)
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
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
  };

  // Handle preflight request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
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

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, students })
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
