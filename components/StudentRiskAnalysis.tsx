'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, TrendingUp, TrendingDown, Target, BookOpen, Calendar, Award } from 'lucide-react';
import { riskModel } from '@/lib/ml-model';
import { getAuth } from 'firebase/auth';

interface RiskAnalysis {
  overallRisk: number;
  riskLevel: 'low' | 'medium' | 'high';
  factors: {
    attendanceRisk: number;
    assignmentRisk: number;
    examRisk: number;
  };
  recommendations: string[];
  trend: 'improving' | 'declining' | 'stable';
  changeRate: number;
}

interface SubjectRisk {
  subject: string;
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  factors: string[];
}

export default function StudentRiskAnalysis() {
  const [riskAnalysis, setRiskAnalysis] = useState<RiskAnalysis | null>(null);
  const [subjectRisks, setSubjectRisks] = useState<SubjectRisk[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRiskAnalysis = async () => {
      try {
        const auth = getAuth();
        const userEmail = auth.currentUser?.email;

        if (!userEmail) {
          setLoading(false);
          return;
        }

        // Fetch student data from API
        const studentResponse = await fetch(`/api/students/by-email?email=${encodeURIComponent(userEmail)}`);
        
        if (!studentResponse.ok) {
          console.error('Failed to fetch student data');
          setLoading(false);
          return;
        }

        const studentData = await studentResponse.json();
        const student = studentData.student;

        if (!student) {
          setLoading(false);
          return;
        }

        // Get student ID for risk prediction
        const studentId = student.id;

        // Fetch risk prediction
        let riskData = null;
        try {
          const riskResponse = await fetch(`/api/risk-prediction/${studentId}`);
          if (riskResponse.ok) {
            riskData = await riskResponse.json();
          }
        } catch (error) {
          console.error('Error fetching risk prediction:', error);
        }

        // Calculate risk from student data
        const assignmentMarks = student.subjects.map((sub: any) => sub.assignmentMarks);
        const examScores = student.subjects.map((sub: any) => sub.examScore);
        const averageAssignment = assignmentMarks.length > 0 
          ? assignmentMarks.reduce((sum: number, m: number) => sum + m, 0) / assignmentMarks.length 
          : 0;
        const averageExam = examScores.length > 0 
          ? examScores.reduce((sum: number, m: number) => sum + m, 0) / examScores.length 
          : 0;

        const studentDataForRisk = {
          attendance: student.attendance,
          assignmentMarks,
          examScores,
          averageAssignment,
          averageExam
        };

        // Calculate risk using ML model
        const riskFactors = riskModel.calculateRiskScore(studentDataForRisk);
        const riskLevel = riskData?.riskLevel || riskModel.getRiskLevel(riskFactors.overallRisk);
        const overallRisk = riskData?.riskScore || riskFactors.overallRisk;
        const recommendations = riskModel.getRiskRecommendations(riskFactors);

        // Simulate trend analysis
        const trend = 'improving';
        const changeRate = 0.15;

        setRiskAnalysis({
          overallRisk,
          riskLevel,
          factors: riskFactors,
          recommendations,
          trend,
          changeRate
        });

        // Subject-wise risk analysis
        const subjectRisksData: SubjectRisk[] = student.subjects.map((sub: any) => {
          const subAvgMarks = sub.totalMarks;
          let subRiskLevel: 'low' | 'medium' | 'high' = 'low';
          let subRiskScore = 0;
          const subFactors: string[] = [];

          if (subAvgMarks < 40) {
            subRiskLevel = 'high';
            subRiskScore = 0.7 + ((40 - subAvgMarks) / 40) * 0.3;
            subFactors.push('Low marks', 'Needs improvement');
          } else if (subAvgMarks < 60) {
            subRiskLevel = 'medium';
            subRiskScore = 0.4 + ((60 - subAvgMarks) / 20) * 0.3;
            subFactors.push('Average performance');
          } else {
            subRiskLevel = 'low';
            subRiskScore = Math.max(0, ((100 - subAvgMarks) / 40) * 0.4);
            subFactors.push('Good performance');
          }

          if (sub.assignmentMarks < 50) subFactors.push('Low assignment marks');
          if (sub.examScore < 50) subFactors.push('Low exam score');

          return {
            subject: sub.name,
            riskScore: subRiskScore,
            riskLevel: subRiskLevel,
            factors: subFactors.length > 0 ? subFactors : ['No major concerns']
          };
        });

        setSubjectRisks(subjectRisksData);
      } catch (error) {
        console.error('Error fetching risk analysis:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRiskAnalysis();
  }, []);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRiskBarColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="h-5 w-5 text-green-600" />;
      case 'declining': return <TrendingDown className="h-5 w-5 text-red-600" />;
      default: return <Target className="h-5 w-5 text-blue-600" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!riskAnalysis) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Risk Analysis</h2>
            <p className="text-gray-600">AI-powered academic risk prediction and recommendations</p>
          </div>
          <div className="text-right">
            <div className={`inline-flex items-center px-4 py-2 rounded-full text-lg font-medium ${getRiskColor(riskAnalysis.riskLevel)}`}>
              <AlertTriangle className="h-5 w-5 mr-2" />
              Risk: {riskAnalysis.riskLevel.toUpperCase()}
            </div>
          </div>
        </div>
      </div>

      {/* Overall Risk Score */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Overall Risk Score</h3>
          <div className="flex items-center">
            {getTrendIcon(riskAnalysis.trend)}
            <span className="ml-2 text-sm text-gray-600 capitalize">
              {riskAnalysis.trend} ({Math.round(riskAnalysis.changeRate * 100)}%)
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Risk Level</span>
              <span className="text-2xl font-bold text-gray-800">
                {Math.round(riskAnalysis.overallRisk * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className={`h-4 rounded-full ${getRiskBarColor(riskAnalysis.riskLevel)}`}
                style={{ width: `${riskAnalysis.overallRisk * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Factors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 card-hover">
          <div className="flex items-center mb-4">
            <div className="glass-card p-3 mr-4">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Attendance Risk</p>
              <p className="text-2xl font-bold text-gray-800">
                {Math.round(riskAnalysis.factors.attendanceRisk * 100)}%
              </p>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="h-2 rounded-full bg-blue-500"
              style={{ width: `${riskAnalysis.factors.attendanceRisk * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="glass-card p-6 card-hover">
          <div className="flex items-center mb-4">
            <div className="glass-card p-3 mr-4">
              <BookOpen className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Assignment Risk</p>
              <p className="text-2xl font-bold text-gray-800">
                {Math.round(riskAnalysis.factors.assignmentRisk * 100)}%
              </p>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="h-2 rounded-full bg-green-500"
              style={{ width: `${riskAnalysis.factors.assignmentRisk * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="glass-card p-6 card-hover">
          <div className="flex items-center mb-4">
            <div className="glass-card p-3 mr-4">
              <Award className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Exam Risk</p>
              <p className="text-2xl font-bold text-gray-800">
                {Math.round(riskAnalysis.factors.examRisk * 100)}%
              </p>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="h-2 rounded-full bg-purple-500"
              style={{ width: `${riskAnalysis.factors.examRisk * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Subject-wise Risk Analysis */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Subject-wise Risk Analysis</h3>
        <div className="space-y-4">
          {subjectRisks.map((subject, index) => (
            <div key={index} className="p-4 bg-white/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="font-medium text-gray-800">{subject.subject}</h4>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {subject.factors.map((factor, factorIndex) => (
                      <span key={factorIndex} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {factor}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${getRiskColor(subject.riskLevel)}`}>
                    {Math.round(subject.riskScore * 100)}%
                  </div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${getRiskBarColor(subject.riskLevel)}`}
                  style={{ width: `${subject.riskScore * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">AI Recommendations</h3>
        <div className="space-y-3">
          {riskAnalysis.recommendations.map((recommendation, index) => (
            <div key={index} className="flex items-start p-3 bg-blue-50 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
              <p className="text-gray-700">{recommendation}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Trends Chart Placeholder */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Risk Trends</h3>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
          <div className="text-center">
            <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">Risk trend chart will be displayed here</p>
            <p className="text-sm text-gray-500">Historical data analysis</p>
          </div>
        </div>
      </div>
    </div>
  );
}
