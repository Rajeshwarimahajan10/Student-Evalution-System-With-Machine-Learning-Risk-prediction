'use client';

import { useState, useEffect } from 'react';
import { 
  Calendar, 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock,
  Download,
  Upload,
  Filter,
  Search
} from 'lucide-react';

interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  subject: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  time: string;
  remarks?: string;
}

interface AttendanceSummary {
  totalStudents: number;
  presentToday: number;
  absentToday: number;
  lateToday: number;
  averageAttendance: number;
}

export default function AttendanceManagement() {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [summary, setSummary] = useState<AttendanceSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const subjects = [
    'Object Oriented Programming',
    'Data Structures and Algorithms',
    'Deep Learning',
    'Machine Learning',
    'Operating System'
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const sampleRecords: AttendanceRecord[] = [
        {
          id: '1',
          studentId: '1',
          studentName: 'Maria Brown',
          rollNo: 'CS2024001',
          subject: 'Object Oriented Programming',
          date: selectedDate,
          status: 'present',
          time: '09:00 AM'
        },
        {
          id: '2',
          studentId: '2',
          studentName: 'John Smith',
          rollNo: 'CS2024002',
          subject: 'Object Oriented Programming',
          date: selectedDate,
          status: 'late',
          time: '09:15 AM',
          remarks: 'Traffic delay'
        },
        {
          id: '3',
          studentId: '3',
          studentName: 'Ahmed Jones',
          rollNo: 'CS2024003',
          subject: 'Object Oriented Programming',
          date: selectedDate,
          status: 'present',
          time: '09:00 AM'
        },
        {
          id: '4',
          studentId: '4',
          studentName: 'Sara Smith',
          rollNo: 'CS2024004',
          subject: 'Object Oriented Programming',
          date: selectedDate,
          status: 'present',
          time: '09:00 AM'
        },
        {
          id: '5',
          studentId: '5',
          studentName: 'Liam Brown',
          rollNo: 'CS2024005',
          subject: 'Object Oriented Programming',
          date: selectedDate,
          status: 'absent',
          time: '-',
          remarks: 'Medical leave'
        }
      ];

      setAttendanceRecords(sampleRecords);

      // Fetch real student count from API
      fetch('/api/students')
        .then(res => res.json())
        .then(data => {
          const totalStudents = data.students?.length || 0;
          setSummary({
            totalStudents: totalStudents,
            presentToday: 5,
            absentToday: 0,
            lateToday: 2,
            averageAttendance: 80
          });
        })
        .catch(err => {
          console.error('Error fetching students:', err);
          setSummary({
            totalStudents: 0,
            presentToday: 0,
            absentToday: 0,
            lateToday: 0,
            averageAttendance: 0
          });
        });

      setLoading(false);
    }, 1000);
  }, [selectedDate]);

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
      case 'late': return <Clock className="h-4 w-4" />;
      case 'absent': return <XCircle className="h-4 w-4" />;
      default: return <XCircle className="h-4 w-4" />;
    }
  };

  const filteredRecords = attendanceRecords.filter(record => {
    const matchesSubject = selectedSubject === 'all' || record.subject === selectedSubject;
    const matchesSearch = searchTerm === '' || 
      record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.rollNo.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  const handleStatusChange = (recordId: string, newStatus: 'present' | 'absent' | 'late') => {
    setAttendanceRecords(prev => 
      prev.map(record => 
        record.id === recordId 
          ? { ...record, status: newStatus }
          : record
      )
    );
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
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Attendance Management</h2>
            <p className="text-gray-600">Mark and manage student attendance</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="glass-button px-4 py-2 text-blue-600 hover:bg-blue-50">
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
            <button className="glass-button px-4 py-2 text-green-600 hover:bg-green-50">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card p-6 card-hover">
          <div className="flex items-center">
            <div className="glass-card p-3 mr-4">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-gray-800">{summary?.totalStudents}</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 card-hover">
          <div className="flex items-center">
            <div className="glass-card p-3 mr-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Present Today</p>
              <p className="text-2xl font-bold text-green-600">{summary?.presentToday}</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 card-hover">
          <div className="flex items-center">
            <div className="glass-card p-3 mr-4">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Late Today</p>
              <p className="text-2xl font-bold text-yellow-600">{summary?.lateToday}</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 card-hover">
          <div className="flex items-center">
            <div className="glass-card p-3 mr-4">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Absent Today</p>
              <p className="text-2xl font-bold text-red-600">{summary?.absentToday}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="glass-input w-full pl-10 pr-4 py-2"
              />
            </div>
          </div>
          <div className="md:w-48">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="glass-input w-full"
            >
              <option value="all">All Subjects</option>
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>
          <div className="md:w-48">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="glass-input w-full"
            />
          </div>
        </div>
      </div>

      {/* Attendance Records */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Attendance Records</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/20">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Student</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Subject</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Time</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Remarks</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record) => (
                <tr key={record.id} className="border-b border-white/10 hover:bg-white/10 transition-colors">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-gray-800">{record.studentName}</p>
                      <p className="text-sm text-gray-600">{record.rollNo}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-700">{record.subject}</td>
                  <td className="py-3 px-4 text-gray-700">{record.time}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(record.status)}`}>
                      {getStatusIcon(record.status)}
                      <span className="ml-1 capitalize">{record.status}</span>
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-700">
                    {record.remarks || '-'}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleStatusChange(record.id, 'present')}
                        className={`p-1 rounded ${record.status === 'present' ? 'bg-green-100 text-green-600' : 'text-gray-400 hover:text-green-600'}`}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleStatusChange(record.id, 'late')}
                        className={`p-1 rounded ${record.status === 'late' ? 'bg-yellow-100 text-yellow-600' : 'text-gray-400 hover:text-yellow-600'}`}
                      >
                        <Clock className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleStatusChange(record.id, 'absent')}
                        className={`p-1 rounded ${record.status === 'absent' ? 'bg-red-100 text-red-600' : 'text-gray-400 hover:text-red-600'}`}
                      >
                        <XCircle className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRecords.length === 0 && (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No attendance records found for the selected criteria</p>
          </div>
        )}
      </div>

      {/* Bulk Actions */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Bulk Actions</h3>
        <div className="flex flex-wrap gap-3">
          <button className="glass-button px-4 py-2 text-green-600 hover:bg-green-50">
            <CheckCircle className="h-4 w-4 mr-2" />
            Mark All Present
          </button>
          <button className="glass-button px-4 py-2 text-yellow-600 hover:bg-yellow-50">
            <Clock className="h-4 w-4 mr-2" />
            Mark All Late
          </button>
          <button className="glass-button px-4 py-2 text-red-600 hover:bg-red-50">
            <XCircle className="h-4 w-4 mr-2" />
            Mark All Absent
          </button>
          <button className="glass-button px-4 py-2 text-blue-600 hover:bg-blue-50">
            <Download className="h-4 w-4 mr-2" />
            Generate Report
          </button>
        </div>
      </div>
    </div>
  );
}
