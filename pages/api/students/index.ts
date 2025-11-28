import { NextApiRequest, NextApiResponse } from 'next';
import { pool } from '@/lib/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      // Test database connection first
      try {
        await pool.execute('SELECT 1');
      } catch (connError: any) {
        console.error('Database connection error:', connError);
        return res.status(500).json({ 
          message: 'Database connection failed',
          error: process.env.NODE_ENV === 'development' ? connError.message : undefined
        });
      }
      
      const [rows] = await pool.execute(`
        SELECT 
          s.id,
          s.email,
          s.name,
          s.roll_no,
          s.attendance_percentage,
          AVG(ss.total_marks) as average_marks
        FROM students s
        LEFT JOIN student_subjects ss ON s.id = ss.student_id
        GROUP BY s.id, s.email, s.name, s.roll_no, s.attendance_percentage
        ORDER BY s.name
      `);

      const studentsArray = rows as any[];
      console.log(`📊 API: Returning ${studentsArray.length} students from database`);
      console.log(`📋 First 5 students:`, studentsArray.slice(0, 5).map(s => s.name));
      if (studentsArray.length !== 30) {
        console.warn(`⚠️ WARNING: Expected 30 students but got ${studentsArray.length}`);
      }
      res.status(200).json({ students: rows });
    } catch (error: any) {
      console.error('Error fetching students:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        sqlState: error.sqlState,
        sqlMessage: error.sqlMessage
      });
      res.status(500).json({ 
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  } else if (req.method === 'POST') {
    try {
      const { email, name, rollNo } = req.body;

      if (!email || !name || !rollNo) {
        return res.status(400).json({ message: 'Email, name, and roll number are required' });
      }

      const [result] = await pool.execute(
        'INSERT INTO students (email, name, roll_no) VALUES (?, ?, ?)',
        [email, name, rollNo]
      );

      res.status(201).json({ 
        message: 'Student created successfully',
        studentId: (result as any).insertId
      });
    } catch (error) {
      console.error('Error creating student:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
