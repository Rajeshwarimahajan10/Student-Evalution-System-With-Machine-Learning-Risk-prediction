import { pool } from '@/lib/database';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const [rows] = await pool.execute(
        `
        SELECT 
          s.id as student_id,
          s.name,
          s.roll_no,
          s.attendance_percentage,
          ss.subject_id,
          sub.name as subject_name,
          sub.code as subject_code,
          ss.assignment_marks,
          ss.exam_score,
          ss.total_marks,
          ss.grade
        FROM students s
        LEFT JOIN student_subjects ss ON s.id = ss.student_id
        LEFT JOIN subjects sub ON ss.subject_id = sub.id
        WHERE s.id = ?
        `,
        [id]
      );

      const studentRows = rows as any[];

      if (studentRows.length === 0) {
        return res.status(404).json({ message: 'Student not found' });
      }

      // Build a single student object with all subjects
      const student = {
        id: studentRows[0].student_id,
        name: studentRows[0].name,
        rollNo: studentRows[0].roll_no,
        attendance: studentRows[0].attendance_percentage,
        subjects: studentRows
          .filter((row) => row.subject_id) // avoid null when no subjects
          .map((row) => ({
            id: row.subject_id,
            name: row.subject_name,
            code: row.subject_code,
            assignmentMarks: row.assignment_marks,
            examScore: row.exam_score,
            totalMarks: row.total_marks,
            grade: row.grade,
          })),
      };

      res.status(200).json({ student });
    } catch (error) {
      console.error('Error fetching student:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  else if (req.method === 'PUT') {
    try {
      const { name, rollNo, attendance } = req.body;

      await pool.execute(
        'UPDATE students SET name = ?, roll_no = ?, attendance_percentage = ? WHERE id = ?',
        [name, rollNo, attendance, id]
      );

      res.status(200).json({ message: 'Student updated successfully' });
    } catch (error) {
      console.error('Error updating student:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  else if (req.method === 'DELETE') {
    try {
      // First delete related subject records (if you don’t have ON DELETE CASCADE)
      await pool.execute('DELETE FROM student_subjects WHERE student_id = ?', [id]);
      await pool.execute('DELETE FROM students WHERE id = ?', [id]);

      res.status(200).json({ message: 'Student deleted successfully' });
    } catch (error) {
      console.error('Error deleting student:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
