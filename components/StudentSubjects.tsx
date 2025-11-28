'use client';

import { useState, useEffect } from 'react';
import { BookOpen, TrendingUp, Award, Clock } from 'lucide-react';
import { getAuth } from 'firebase/auth';

interface SubjectData {
  id: string;
  name: string;
  code: string;
  credits: number;
  assignmentMarks: number;
  examScore: number;
  totalMarks: number;
  grade: string;
  attendance: number;
  lastUpdated: string;
}

export default function StudentSubjects() {
  const [subjects, setSubjects] = useState<SubjectData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubjects = async () => {
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

        if (!student || !student.subjects) {
          setLoading(false);
          return;
        }

        // Map subjects to the expected format
        const subjectsData: SubjectData[] = student.subjects.map((sub: any, index: number) => ({
          id: sub.id?.toString() || (index + 1).toString(),
          name: sub.name,
          code: sub.code,
          credits: 3, // Default credits
          assignmentMarks: sub.assignmentMarks,
          examScore: sub.examScore,
          totalMarks: sub.totalMarks,
          grade: sub.grade,
          attendance: 85, // Default attendance (can be fetched separately)
          lastUpdated: new Date().toISOString().split('T')[0]
        }));

        setSubjects(subjectsData);
      } catch (error) {
        console.error('Error fetching subjects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'text-green-600 bg-green-100';
      case 'A-': return 'text-green-600 bg-green-100';
      case 'B+': return 'text-blue-600 bg-blue-100';
      case 'B': return 'text-blue-600 bg-blue-100';
      case 'B-': return 'text-yellow-600 bg-yellow-100';
      case 'C+': return 'text-yellow-600 bg-yellow-100';
      case 'C': return 'text-orange-600 bg-orange-100';
      default: return 'text-red-600 bg-red-100';
    }
  };

  const getPerformanceColor = (marks: number) => {
    if (marks >= 90) return 'text-green-600';
    if (marks >= 80) return 'text-blue-600';
    if (marks >= 70) return 'text-yellow-600';
    if (marks >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">My Subjects</h2>
            <p className="text-gray-600">Computer Engineering - Current Semester</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Total Credits</p>
            <p className="text-2xl font-bold text-blue-600">
              {subjects.reduce((sum, subject) => sum + subject.credits, 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 card-hover">
          <div className="flex items-center">
            <div className="glass-card p-3 mr-4">
              <Award className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Average Grade</p>
              <p className="text-2xl font-bold text-gray-800">
                {(subjects.reduce((sum, subject) => sum + subject.totalMarks, 0) / subjects.length).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 card-hover">
          <div className="flex items-center">
            <div className="glass-card p-3 mr-4">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Best Subject</p>
              <p className="text-lg font-bold text-gray-800">
                {subjects.reduce((best, subject) => 
                  subject.totalMarks > best.totalMarks ? subject : best
                ).name.split(' ')[0]}
              </p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 card-hover">
          <div className="flex items-center">
            <div className="glass-card p-3 mr-4">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Overall Attendance</p>
              <p className="text-2xl font-bold text-gray-800">
                {(subjects.reduce((sum, subject) => sum + subject.attendance, 0) / subjects.length).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Subjects Table */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Subject Details</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/20">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Subject</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Code</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Credits</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Assignment</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Exam</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Total</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Grade</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Attendance</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((subject) => (
                <tr key={subject.id} className="border-b border-white/10 hover:bg-white/10 transition-colors">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-gray-800">{subject.name}</p>
                      <p className="text-sm text-gray-600">Updated: {subject.lastUpdated}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="glass-button px-2 py-1 text-sm">{subject.code}</span>
                  </td>
                  <td className="py-3 px-4 text-gray-700">{subject.credits}</td>
                  <td className="py-3 px-4">
                    <span className={`font-medium ${getPerformanceColor(subject.assignmentMarks)}`}>
                      {subject.assignmentMarks}%
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`font-medium ${getPerformanceColor(subject.examScore)}`}>
                      {subject.examScore}%
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`font-bold text-lg ${getPerformanceColor(subject.totalMarks)}`}>
                      {subject.totalMarks}%
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${getGradeColor(subject.grade)}`}>
                      {subject.grade}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className={`h-2 rounded-full ${subject.attendance >= 80 ? 'bg-green-500' : subject.attendance >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                          style={{ width: `${subject.attendance}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-700">{subject.attendance}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
