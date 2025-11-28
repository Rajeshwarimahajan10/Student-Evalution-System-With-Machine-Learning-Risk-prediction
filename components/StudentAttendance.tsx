'use client';

import { useState, useEffect } from 'react';
import { Calendar, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

interface AttendanceRecord {
  date: string;
  subject: string;
  status: 'present' | 'absent' | 'late';
  time: string;
}

interface SubjectAttendance {
  subject: string;
  totalClasses: number;
  attendedClasses: number;
  attendancePercentage: number;
  lastUpdated: string;
}

export default function StudentAttendance() {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [subjectAttendance, setSubjectAttendance] = useState<SubjectAttendance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setAttendanceRecords([
        { date: '2024-01-15', subject: 'Object Oriented Programming', status: 'present', time: '09:00 AM' },
        { date: '2024-01-15', subject: 'Data Structures and Algorithms', status: 'present', time: '11:00 AM' },
        { date: '2024-01-15', subject: 'Deep Learning', status: 'late', time: '02:00 PM' },
        { date: '2024-01-14', subject: 'Machine Learning', status: 'present', time: '10:00 AM' },
        { date: '2024-01-14', subject: 'Operating System', status: 'absent', time: '01:00 PM' },
        { date: '2024-01-13', subject: 'Object Oriented Programming', status: 'present', time: '09:00 AM' },
        { date: '2024-01-13', subject: 'Data Structures and Algorithms', status: 'present', time: '11:00 AM' },
        { date: '2024-01-13', subject: 'Deep Learning', status: 'present', time: '02:00 PM' },
        { date: '2024-01-12', subject: 'Machine Learning', status: 'present', time: '10:00 AM' },
        { date: '2024-01-12', subject: 'Operating System', status: 'present', time: '01:00 PM' },
      ]);

      setSubjectAttendance([
        { subject: 'Object Oriented Programming', totalClasses: 25, attendedClasses: 23, attendancePercentage: 92, lastUpdated: '2024-01-15' },
        { subject: 'Data Structures and Algorithms', totalClasses: 25, attendedClasses: 22, attendancePercentage: 88, lastUpdated: '2024-01-15' },
        { subject: 'Deep Learning', totalClasses: 20, attendedClasses: 19, attendancePercentage: 95, lastUpdated: '2024-01-15' },
        { subject: 'Machine Learning', totalClasses: 20, attendedClasses: 16, attendancePercentage: 80, lastUpdated: '2024-01-14' },
        { subject: 'Operating System', totalClasses: 25, attendedClasses: 20, attendancePercentage: 80, lastUpdated: '2024-01-14' },
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'text-green-600 bg-green-100';
      case 'late': return 'text-yellow-600 bg-yellow-100';
      case 'absent': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present': return <CheckCircle className="h-4 w-4" />;
      case 'late': return <AlertCircle className="h-4 w-4" />;
      case 'absent': return <AlertCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 80) return 'text-blue-600';
    if (percentage >= 70) return 'text-yellow-600';
    if (percentage >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getAttendanceBarColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-green-500';
    if (percentage >= 80) return 'bg-blue-500';
    if (percentage >= 70) return 'bg-yellow-500';
    if (percentage >= 60) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const overallAttendance = subjectAttendance.length > 0 
    ? subjectAttendance.reduce((sum, subject) => sum + subject.attendancePercentage, 0) / subjectAttendance.length 
    : 0;

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
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Attendance Records</h2>
            <p className="text-gray-600">Track your class attendance and performance</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Overall Attendance</p>
            <p className={`text-3xl font-bold ${getAttendanceColor(overallAttendance)}`}>
              {overallAttendance.toFixed(1)}%
            </p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 card-hover">
          <div className="flex items-center">
            <div className="glass-card p-3 mr-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Present Days</p>
              <p className="text-2xl font-bold text-gray-800">
                {attendanceRecords.filter(record => record.status === 'present').length}
              </p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 card-hover">
          <div className="flex items-center">
            <div className="glass-card p-3 mr-4">
              <AlertCircle className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Late Days</p>
              <p className="text-2xl font-bold text-gray-800">
                {attendanceRecords.filter(record => record.status === 'late').length}
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
              <p className="text-sm text-gray-600">Total Classes</p>
              <p className="text-2xl font-bold text-gray-800">
                {subjectAttendance.reduce((sum, subject) => sum + subject.totalClasses, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Subject-wise Attendance */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Subject-wise Attendance</h3>
        <div className="space-y-4">
          {subjectAttendance.map((subject, index) => (
            <div key={index} className="p-4 bg-white/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="font-medium text-gray-800">{subject.subject}</h4>
                  <p className="text-sm text-gray-600">
                    {subject.attendedClasses} / {subject.totalClasses} classes attended
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-2xl font-bold ${getAttendanceColor(subject.attendancePercentage)}`}>
                    {subject.attendancePercentage}%
                  </p>
                  <p className="text-sm text-gray-600">Last updated: {subject.lastUpdated}</p>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full ${getAttendanceBarColor(subject.attendancePercentage)}`}
                  style={{ width: `${subject.attendancePercentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Attendance Records */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Attendance</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/20">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Subject</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Time</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {attendanceRecords.slice(0, 10).map((record, index) => (
                <tr key={index} className="border-b border-white/10 hover:bg-white/10 transition-colors">
                  <td className="py-3 px-4 text-gray-700">{record.date}</td>
                  <td className="py-3 px-4 font-medium text-gray-800">{record.subject}</td>
                  <td className="py-3 px-4 text-gray-600">{record.time}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(record.status)}`}>
                      {getStatusIcon(record.status)}
                      <span className="ml-1 capitalize">{record.status}</span>
                    </span>
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
