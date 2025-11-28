// Simple machine learning model for risk prediction
// This is a simplified implementation - in production, you'd use a proper ML library

interface StudentData {
  attendance: number;
  assignmentMarks: number[];
  examScores: number[];
  averageAssignment: number;
  averageExam: number;
}

interface RiskFactors {
  attendanceRisk: number;
  assignmentRisk: number;
  examRisk: number;
  overallRisk: number;
}

export class RiskPredictionModel {
  private weights = {
    attendance: 0.4,
    assignment: 0.3,
    exam: 0.3
  };

  private thresholds = {
    low: 0.25,      // Low risk: 0-25% (good performance)
    medium: 0.45,   // Medium risk: 25-45% (moderate performance)
    high: 0.45      // High risk: >45% (poor performance, needs intervention)
  };

  calculateRiskScore(studentData: StudentData): RiskFactors {
    // Calculate average marks from assignment and exam scores
    // This represents the student's overall performance
    const averageMarks = (studentData.averageAssignment + studentData.averageExam) / 2;
    
    // Risk calculation based on marks (as per requirements):
    // - 0 marks: High risk
    // - Below 40 marks: High risk
    // - 40-60 marks: Medium risk
    // - 60-100 marks: Low risk
    
    let overallRisk = 0;
    
    if (averageMarks === 0) {
      // Zero marks = High risk (100%)
      overallRisk = 1.0;
    } else if (averageMarks < 40) {
      // Below 40 = High risk
      // Risk increases as marks decrease (1-39 range maps to 0.7-0.99 risk)
      overallRisk = 0.7 + ((40 - averageMarks) / 40) * 0.29;
    } else if (averageMarks < 60) {
      // 40-60 = Medium risk
      // Risk decreases as marks increase (40-59 range maps to 0.4-0.7 risk)
      overallRisk = 0.4 + ((60 - averageMarks) / 20) * 0.3;
    } else {
      // 60-100 = Low risk
      // Risk decreases as marks increase (60-100 range maps to 0.0-0.4 risk)
      overallRisk = Math.max(0, ((100 - averageMarks) / 40) * 0.4);
    }
    
    // Calculate individual risk factors for display
    const attendanceRisk = Math.max(0, (100 - studentData.attendance) / 100);
    const assignmentRisk = Math.max(0, (100 - studentData.averageAssignment) / 100);
    const examRisk = Math.max(0, (100 - studentData.averageExam) / 100);

    return {
      attendanceRisk,
      assignmentRisk,
      examRisk,
      overallRisk: Math.min(1, Math.max(0, overallRisk))
    };
  }

  getRiskLevel(riskScore: number): 'low' | 'medium' | 'high' {
    // Risk level based on marks:
    // - High: riskScore > 0.7 (marks < 40 or 0)
    // - Medium: 0.4 <= riskScore <= 0.7 (marks 40-60)
    // - Low: riskScore < 0.4 (marks 60-100)
    if (riskScore >= 0.7) {
      return 'high';
    } else if (riskScore >= 0.4) {
      return 'medium';
    } else {
      return 'low';
    }
  }

  getRiskColor(riskLevel: 'low' | 'medium' | 'high'): string {
    switch (riskLevel) {
      case 'low':
        return 'text-green-600 bg-green-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'high':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  }

  getRiskRecommendations(riskFactors: RiskFactors): string[] {
    const recommendations: string[] = [];
    
    if (riskFactors.attendanceRisk > 0.5) {
      recommendations.push('Improve attendance - attend classes regularly');
    }
    
    if (riskFactors.assignmentRisk > 0.5) {
      recommendations.push('Focus on assignment completion and quality');
    }
    
    if (riskFactors.examRisk > 0.5) {
      recommendations.push('Increase study time for exam preparation');
    }
    
    if (riskFactors.overallRisk > 0.7) {
      recommendations.push('Consider academic counseling and support');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('Continue maintaining good academic performance');
    }
    
    return recommendations;
  }

  // Advanced analytics for risk trends
  calculateRiskTrends(historicalData: StudentData[]): {
    trend: 'improving' | 'declining' | 'stable';
    changeRate: number;
  } {
    if (historicalData.length < 2) {
      return { trend: 'stable', changeRate: 0 };
    }

    const recent = historicalData.slice(-3); // Last 3 records
    const older = historicalData.slice(-6, -3); // Previous 3 records

    const recentAvg = recent.reduce((sum, data) => {
      const risk = this.calculateRiskScore(data);
      return sum + risk.overallRisk;
    }, 0) / recent.length;

    const olderAvg = older.reduce((sum, data) => {
      const risk = this.calculateRiskScore(data);
      return sum + risk.overallRisk;
    }, 0) / older.length;

    const changeRate = (recentAvg - olderAvg) / olderAvg;

    let trend: 'improving' | 'declining' | 'stable' = 'stable';
    if (changeRate < -0.1) {
      trend = 'improving';
    } else if (changeRate > 0.1) {
      trend = 'declining';
    }

    return { trend, changeRate: Math.abs(changeRate) };
  }
}

// Singleton instance
export const riskModel = new RiskPredictionModel();
