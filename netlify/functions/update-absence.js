// Netlify function to update student absence dates
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
    const { studentId, absenceDates } = JSON.parse(event.body);
    
    if (!studentId || !Array.isArray(absenceDates)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Student ID and absence dates are required' })
      };
    }

    const result = await pool.query(
      'UPDATE students SET absence_dates = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [JSON.stringify(absenceDates), studentId]
    );

    if (result.rows.length === 0) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Student not found' })
      };
    }

    const updatedStudent = result.rows[0];
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
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
      })
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
