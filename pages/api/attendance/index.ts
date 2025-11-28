import { NextApiRequest, NextApiResponse } from 'next';
import { pool } from '@/lib/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { date, subjectId } = req.query;

      let query = `
        SELECT 
          ar.*,
          s.name as student_name,
          s.roll_no,
          sub.name as subject_name
        FROM attendance_records ar
        JOIN students s ON ar.student_id = s.id
        JOIN subjects sub ON ar.subject_id = sub.id
        WHERE 1=1
      `;

      const params: any[] = [];

      if (date) {
        query += ' AND ar.date = ?';
        params.push(date);
      }

      if (subjectId) {
        query += ' AND ar.subject_id = ?';
        params.push(subjectId);
      }

      query += ' ORDER BY ar.date DESC, s.name';

      const [rows] = await pool.execute(query, params);

      res.status(200).json({ attendanceRecords: rows });
    } catch (error) {
      console.error('Error fetching attendance records:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'POST') {
    try {
      const { studentId, subjectId, date, status } = req.body;

      if (!studentId || !subjectId || !date || !status) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      await pool.execute(`
        INSERT INTO attendance_records (student_id, subject_id, date, status)
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
        status = VALUES(status)
      `, [studentId, subjectId, date, status]);

      res.status(201).json({ message: 'Attendance record created successfully' });
    } catch (error) {
      console.error('Error creating attendance record:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
