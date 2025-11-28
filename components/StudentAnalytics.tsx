'use client';

import { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  BookOpen,
  Calendar,
  Award,
  AlertTriangle
} from 'lucide-react';

interface AnalyticsData {
  attendanceTrend: {
    month: string;
    average: number;
  }[];
  gradeDistribution: {
    grade: string;
    count: number;
    percentage: number;
  }[];
  subjectPerformance: {
    subject: string;
    averageMarks: number;
    passRate: number;
  }[];
  riskDistribution: {
    level: string;
    count: number;
    percentage: number;
  }[];
  topPerformers: {
    name: string;
    rollNo: string;
    averageMarks: number;
    attendance: number;
  }[];
  atRiskStudents: {
    name: string;
    rollNo: string;
    riskScore: number;
    riskLevel: string;
    factors: string[];
  }[];
}

export default function StudentAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch real data from API
    const fetchAnalytics = async () => {
      try {
        // Fetch students
        const studentsResponse = await fetch('/api/students');
        const studentsData = await studentsResponse.json();
        const students = studentsData.students || [];
        const totalStudents = students.length;
        
        // Calculate average attendance
        const avgAttendance = students.length > 0
          ? students.reduce((sum: number, s: any) => sum + (parseFloat(s.attendance_percentage) || 0), 0) / students.length
          : 0;
        
        setAnalytics({
          totalStudents: totalStudents,
          attendanceTrend: [
            { month: 'Jan', average: Math.round(avgAttendance) },
            { month: 'Feb', average: Math.round(avgAttendance) },
            { month: 'Mar', average: Math.round(avgAttendance) },
            { month: 'Apr', average: Math.round(avgAttendance) },
            { month: 'May', average: Math.round(avgAttendance) },
            { month: 'Jun', average: Math.round(avgAttendance) }
          ],
          gradeDistribution: [
          { grade: 'A', count: 12, percentage: 40 },
          { grade: 'B+', count: 8, percentage: 27 },
          { grade: 'B', count: 6, percentage: 20 },
          { grade: 'C+', count: 3, percentage: 10 },
          { grade: 'C', count: 1, percentage: 3 }
        ],
        subjectPerformance: [
          { subject: 'Object Oriented Programming', averageMarks: 88.5, passRate: 95 },
          { subject: 'Data Structures and Algorithms', averageMarks: 82.3, passRate: 90 },
          { subject: 'Deep Learning', averageMarks: 85.7, passRate: 92 },
          { subject: 'Machine Learning', averageMarks: 79.2, passRate: 85 },
          { subject: 'Operating System', averageMarks: 86.1, passRate: 93 }
        ],
        riskDistribution: [
          { level: 'Low', count: 18, percentage: 60 },
          { level: 'Medium', count: 8, percentage: 27 },
          { level: 'High', count: 4, percentage: 13 }
        ],
        topPerformers: [
          { name: 'Sara Smith', rollNo: 'CS2024004', averageMarks: 91.8, attendance: 95 },
          { name: 'Maria Brown', rollNo: 'CS2024001', averageMarks: 88.5, attendance: 92 },
          { name: 'Liam Brown', rollNo: 'CS2024005', averageMarks: 84.6, attendance: 88 },
          { name: 'Ahmed Jones', rollNo: 'CS2024003', averageMarks: 81.2, attendance: 85 },
          { name: 'John Smith', rollNo: 'CS2024002', averageMarks: 72.3, attendance: 78 }
        ],
        atRiskStudents: [
          {
            name: 'John Smith',
            rollNo: 'CS2024002',
            riskScore: 0.78,
            riskLevel: 'High',
            factors: ['Low attendance', 'Poor exam performance', 'Missing assignments']
          },
          {
            name: 'Ahmed Jones',
            rollNo: 'CS2024003',
            riskScore: 0.45,
            riskLevel: 'Medium',
            factors: ['Declining attendance', 'Average performance']
          }
        ]
      });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching analytics:', error);
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'text-green-600 bg-green-100';
      case 'B+': return 'text-blue-600 bg-blue-100';
      case 'B': return 'text-blue-600 bg-blue-100';
      case 'C+': return 'text-yellow-600 bg-yellow-100';
      case 'C': return 'text-orange-600 bg-orange-100';
      default: return 'text-red-600 bg-red-100';
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Low': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'High': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!analytics) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Student Analytics</h2>
            <p className="text-gray-600">Comprehensive analysis of student performance and trends</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="glass-button px-4 py-2 text-blue-600 hover:bg-blue-50">
              <BarChart3 className="h-4 w-4 mr-2" />
              Export Report
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card p-6 card-hover">
          <div className="flex items-center">
            <div className="glass-card p-3 mr-4">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-gray-800">{analytics?.totalStudents || 0}</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 card-hover">
          <div className="flex items-center">
            <div className="glass-card p-3 mr-4">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg Attendance</p>
              <p className="text-2xl font-bold text-gray-800">87.5%</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 card-hover">
          <div className="flex items-center">
            <div className="glass-card p-3 mr-4">
              <Award className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pass Rate</p>
              <p className="text-2xl font-bold text-gray-800">91.2%</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 card-hover">
          <div className="flex items-center">
            <div className="glass-card p-3 mr-4">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">At Risk</p>
              <p className="text-2xl font-bold text-gray-800">4</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Trend */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Attendance Trend</h3>
          <div className="space-y-3">
            {analytics.attendanceTrend.map((data, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 w-12">{data.month}</span>
                <div className="flex-1 mx-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-blue-500"
                      style={{ width: `${data.average}%` }}
                    ></div>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-800 w-12 text-right">{data.average}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Grade Distribution */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Grade Distribution</h3>
          <div className="space-y-3">
            {analytics.gradeDistribution.map((data, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${getGradeColor(data.grade)}`}>
                  {data.grade}
                </span>
                <div className="flex-1 mx-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-green-500"
                      style={{ width: `${data.percentage}%` }}
                    ></div>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-800 w-16 text-right">{data.count} ({data.percentage}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Subject Performance */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Subject Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/20">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Subject</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Average Marks</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Pass Rate</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Performance</th>
              </tr>
            </thead>
            <tbody>
              {analytics.subjectPerformance.map((subject, index) => (
                <tr key={index} className="border-b border-white/10 hover:bg-white/10 transition-colors">
                  <td className="py-3 px-4 font-medium text-gray-800">{subject.subject}</td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-gray-800">{subject.averageMarks}%</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-gray-800">{subject.passRate}%</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className={`h-2 rounded-full ${subject.averageMarks >= 85 ? 'bg-green-500' : subject.averageMarks >= 75 ? 'bg-yellow-500' : 'bg-red-500'}`}
                          style={{ width: `${subject.averageMarks}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">
                        {subject.averageMarks >= 85 ? 'Excellent' : subject.averageMarks >= 75 ? 'Good' : 'Needs Improvement'}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Performers and At Risk Students */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performers */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Performers</h3>
          <div className="space-y-3">
            {analytics.topPerformers.map((student, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white/20 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">{student.name}</p>
                  <p className="text-sm text-gray-600">{student.rollNo}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-800">{student.averageMarks}%</p>
                  <p className="text-sm text-gray-600">{student.attendance}% attendance</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* At Risk Students */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">At Risk Students</h3>
          <div className="space-y-3">
            {analytics.atRiskStudents.map((student, index) => (
              <div key={index} className="p-3 bg-white/20 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium text-gray-800">{student.name}</p>
                    <p className="text-sm text-gray-600">{student.rollNo}</p>
                  </div>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${getRiskColor(student.riskLevel)}`}>
                    {student.riskLevel} Risk
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {student.factors.map((factor, factorIndex) => (
                    <span key={factorIndex} className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                      {factor}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Risk Distribution */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Risk Distribution</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {analytics.riskDistribution.map((risk, index) => (
            <div key={index} className="text-center p-4 bg-white/20 rounded-lg">
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-lg font-medium ${getRiskColor(risk.level)} mb-2`}>
                {risk.level} Risk
              </div>
              <p className="text-3xl font-bold text-gray-800">{risk.count}</p>
              <p className="text-sm text-gray-600">{risk.percentage}% of students</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
