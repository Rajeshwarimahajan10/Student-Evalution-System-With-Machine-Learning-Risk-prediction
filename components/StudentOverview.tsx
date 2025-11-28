'use client';

import {
  AlertTriangle,
  Award,
  BookOpen,
  Calendar,
  TrendingUp,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';

interface Subject {
  name: string;
  assignmentMarks: number;
  examScore: number;
  totalMarks: number;
  grade: string;
}

interface StudentData {
  email: string;
  name: string;
  rollNo: string;
  attendance: number;
  subjects: Subject[];
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high';
}

export default function StudentOverview() {
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const auth = getAuth();
        const userEmail = auth.currentUser?.email;

        if (!userEmail) {
          setLoading(false);
          return;
        }

        // Fetch student data from API
        const response = await fetch(`/api/students/by-email?email=${encodeURIComponent(userEmail)}`);
        
        if (!response.ok) {
          console.error('Failed to fetch student data');
          setLoading(false);
          return;
        }

        const data = await response.json();
        const student = data.student;

        if (!student) {
          setLoading(false);
          return;
        }

        // Calculate average marks
        const avgMarks = student.subjects.length > 0
          ? student.subjects.reduce((sum: number, sub: any) => sum + sub.totalMarks, 0) / student.subjects.length
          : 0;

        // Calculate risk level based on marks
        let riskLevel: 'low' | 'medium' | 'high' = 'low';
        let riskScore = 0;

        if (avgMarks === 0) {
          riskLevel = 'high';
          riskScore = 1.0;
        } else if (avgMarks < 40) {
          riskLevel = 'high';
          riskScore = 0.7 + ((40 - avgMarks) / 40) * 0.3;
        } else if (avgMarks < 60) {
          riskLevel = 'medium';
          riskScore = 0.4 + ((60 - avgMarks) / 20) * 0.3;
        } else {
          riskLevel = 'low';
          riskScore = Math.max(0, ((100 - avgMarks) / 40) * 0.4);
        }

        // Try to get risk prediction from API
        try {
          const riskResponse = await fetch(`/api/risk-prediction/${student.id}`);
          if (riskResponse.ok) {
            const riskData = await riskResponse.json();
            if (riskData.riskLevel) {
              riskLevel = riskData.riskLevel;
              riskScore = riskData.riskScore || riskScore;
            }
          }
        } catch (error) {
          // Use calculated risk if API fails
        }

        setStudentData({
          email: student.email,
          name: student.name,
          rollNo: student.rollNo,
          attendance: student.attendance,
          subjects: student.subjects.map((sub: any) => ({
            name: sub.name,
            assignmentMarks: sub.assignmentMarks,
            examScore: sub.examScore,
            totalMarks: sub.totalMarks,
            grade: sub.grade,
          })),
          riskScore,
          riskLevel,
        });
      } catch (error) {
        console.error('Error fetching student data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!studentData) {
    return (
      <div className="p-6 text-center text-gray-600">
        No student data found for your account.
      </div>
    );
  }

  const averageMarks =
    studentData.subjects.reduce((sum, subject) => sum + subject.totalMarks, 0) /
    studentData.subjects.length;
  const totalSubjects = studentData.subjects.length;
  const passedSubjects = studentData.subjects.filter(
    (subject) => subject.totalMarks >= 50
  ).length;

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'text-green-600 bg-green-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'high':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Welcome back, {studentData.name}!
            </h2>
            <p className="text-gray-600">Roll No: {studentData.rollNo}</p>
          </div>
          <div className="text-right">
            <div
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(
                studentData.riskLevel
              )}`}
            >
              <AlertTriangle className="h-4 w-4 mr-1" />
              Risk: {studentData.riskLevel.toUpperCase()}
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-6 card-hover">
          <div className="flex items-center">
            <div className="glass-card p-3 mr-4">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Average Marks</p>
              <p className="text-2xl font-bold text-gray-800">
                {averageMarks.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 card-hover">
          <div className="flex items-center">
            <div className="glass-card p-3 mr-4">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Attendance</p>
              <p className="text-2xl font-bold text-gray-800">
                {studentData.attendance}%
              </p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 card-hover">
          <div className="flex items-center">
            <div className="glass-card p-3 mr-4">
              <Award className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Passed Subjects</p>
              <p className="text-2xl font-bold text-gray-800">
                {passedSubjects}/{totalSubjects}
              </p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 card-hover">
          <div className="flex items-center">
            <div className="glass-card p-3 mr-4">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Risk Score</p>
              <p className="text-2xl font-bold text-gray-800">
                {(studentData.riskScore * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Subject Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Subject Performance
          </h3>
          <div className="space-y-4">
            {studentData.subjects.map((subject, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-white/20 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-800">{subject.name}</p>
                  <p className="text-sm text-gray-600">
                    Assignment: {subject.assignmentMarks}% | Exam:{' '}
                    {subject.examScore}%
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-800">
                    {subject.totalMarks}%
                  </p>
                  <p className="text-sm text-gray-600">Grade: {subject.grade}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <button className="w-full glass-button p-3 text-left hover:bg-white/30 transition-colors">
              <div className="flex items-center">
                <BookOpen className="h-5 w-5 mr-3 text-blue-600" />
                <span>View Detailed Grades</span>
              </div>
            </button>
            <button className="w-full glass-button p-3 text-left hover:bg-white/30 transition-colors">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-3 text-green-600" />
                <span>Check Attendance</span>
              </div>
            </button>
            <button className="w-full glass-button p-3 text-left hover:bg-white/30 transition-colors">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-3 text-orange-600" />
                <span>Risk Analysis</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
