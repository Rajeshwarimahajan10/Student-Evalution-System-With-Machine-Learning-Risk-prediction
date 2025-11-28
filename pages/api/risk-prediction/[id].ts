import { NextApiRequest, NextApiResponse } from 'next';
import { pool } from '@/lib/database';
import { riskModel } from '@/lib/ml-model';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      // Get student data
      const [studentRows] = await pool.execute(`
        SELECT 
          s.*,
          AVG(ss.assignment_marks) as avg_assignment_marks,
          AVG(ss.exam_score) as avg_exam_score,
          AVG(ss.total_marks) as avg_total_marks
        FROM students s
        LEFT JOIN student_subjects ss ON s.id = ss.student_id
        WHERE s.id = ?
        GROUP BY s.id
      `, [id]);

      if ((studentRows as any[]).length === 0) {
        return res.status(404).json({ message: 'Student not found' });
      }

      const student = studentRows[0] as any;

      // Ensure we have valid numeric values
      const attendance = parseFloat(student.attendance_percentage) || 0;
      const avgAssignment = parseFloat(student.avg_assignment_marks) || 0;
      const avgExam = parseFloat(student.avg_exam_score) || 0;
      const avgTotalMarks = parseFloat(student.avg_total_marks) || 0;
      
      // Use total_marks average (which is the actual grade) for risk calculation
      // If total_marks is not available, calculate from assignment and exam
      const averageMarks = avgTotalMarks > 0 ? avgTotalMarks : (avgAssignment + avgExam) / 2;

      // Calculate risk directly based on marks (0/<40=high, 40-60=medium, 60-100=low)
      let overallRisk = 0;
      let riskLevel: 'low' | 'medium' | 'high' = 'low';
      
      if (averageMarks === 0) {
        overallRisk = 1.0;
        riskLevel = 'high';
      } else if (averageMarks < 40) {
        overallRisk = 0.7 + ((40 - averageMarks) / 40) * 0.29;
        riskLevel = 'high';
      } else if (averageMarks < 60) {
        overallRisk = 0.4 + ((60 - averageMarks) / 20) * 0.3;
        riskLevel = 'medium';
      } else {
        overallRisk = Math.max(0, ((100 - averageMarks) / 40) * 0.4);
        riskLevel = 'low';
      }

      // Prepare data for ML model (for individual factors display)
      const studentData = {
        attendance: attendance,
        assignmentMarks: [avgAssignment],
        examScores: [avgExam],
        averageAssignment: avgAssignment,
        averageExam: avgExam
      };

      // Calculate individual risk factors for display
      const riskFactors = riskModel.calculateRiskScore(studentData);
      // Override overallRisk with our calculated value
      riskFactors.overallRisk = overallRisk;
      const recommendations = riskModel.getRiskRecommendations(riskFactors);

      // Debug logging
      console.log(`Student ${id} Risk Calculation:`, {
        name: student.name,
        attendance,
        avgAssignment,
        avgExam,
        averageMarks: averageMarks.toFixed(2),
        overallRisk: riskFactors.overallRisk.toFixed(3),
        riskLevel
      });

      // Save risk prediction to database
      await pool.execute(`
        INSERT INTO risk_predictions (student_id, risk_score, risk_level, factors, predicted_at)
        VALUES (?, ?, ?, ?, NOW())
        ON DUPLICATE KEY UPDATE
        risk_score = VALUES(risk_score),
        risk_level = VALUES(risk_level),
        factors = VALUES(factors),
        predicted_at = NOW()
      `, [
        id,
        riskFactors.overallRisk,
        riskLevel,
        JSON.stringify(riskFactors)
      ]);

      res.status(200).json({
        studentId: id,
        riskScore: riskFactors.overallRisk,
        riskLevel,
        factors: riskFactors,
        recommendations
      });

    } catch (error) {
      console.error('Error calculating risk prediction:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
