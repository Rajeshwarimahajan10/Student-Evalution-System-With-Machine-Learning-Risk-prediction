import { NextApiRequest, NextApiResponse } from 'next';
import { pool } from '@/lib/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { email } = req.query;

      if (!email || typeof email !== 'string') {
        return res.status(400).json({ message: 'Email is required' });
      }

      // Get student by email
      const [studentRows] = await pool.execute(
        `
        SELECT 
          s.id,
          s.email,
          s.name,
          s.roll_no,
          s.attendance_percentage
        FROM students s
        WHERE s.email = ?
        `,
        [email]
      );

      if ((studentRows as any[]).length === 0) {
        return res.status(404).json({ message: 'Student not found' });
      }

      const student = (studentRows as any[])[0];

      // Get student subjects with marks
      const [subjectRows] = await pool.execute(
        `
        SELECT 
          ss.subject_id,
          sub.name as subject_name,
          sub.code as subject_code,
          ss.assignment_marks,
          ss.exam_score,
          ss.total_marks,
          ss.grade
        FROM student_subjects ss
        JOIN subjects sub ON ss.subject_id = sub.id
        WHERE ss.student_id = ?
        ORDER BY sub.code
        `,
        [student.id]
      );

      const studentData = {
        id: student.id,
        email: student.email,
        name: student.name,
        rollNo: student.roll_no,
        attendance: parseFloat(student.attendance_percentage) || 0,
        subjects: (subjectRows as any[]).map((row) => ({
          id: row.subject_id,
          name: row.subject_name,
          code: row.subject_code,
          assignmentMarks: parseFloat(row.assignment_marks) || 0,
          examScore: parseFloat(row.exam_score) || 0,
          totalMarks: parseFloat(row.total_marks) || 0,
          grade: row.grade || 'F',
        })),
      };

      res.status(200).json({ student: studentData });
    } catch (error: any) {
      console.error('Error fetching student by email:', error);
      res.status(500).json({ 
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}


