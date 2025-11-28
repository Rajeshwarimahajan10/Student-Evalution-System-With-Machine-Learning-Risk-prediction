'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  AlertTriangle,
  CheckCircle,
  Clock,
  User
} from 'lucide-react';

interface Student {
  id: string;
  name: string;
  email: string;
  rollNo: string;
  attendance: number;
  averageMarks: number;
  riskLevel: 'low' | 'medium' | 'high';
  riskScore: number;
  subjects: {
    name: string;
    marks: number;
    grade: string;
  }[];
  lastActive: string;
  status: 'active' | 'inactive';
}

export default function AllStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');

  useEffect(() => {
    // Fetch real data from API
    const fetchStudents = async () => {
      try {
        const response = await fetch('/api/students');
        const data = await response.json();
        const studentsList = data.students || [];
        
        console.log(`📊 AllStudents: Fetched ${studentsList.length} students from API`);
        console.log(`📋 Student names:`, studentsList.map((s: any) => s.name).slice(0, 10));
        if (studentsList.length !== 32) {
          console.warn(`⚠️ WARNING: Expected 32 students but got ${studentsList.length}`);
        }
        
        // Helper function to calculate risk level based on marks
        const calculateRiskFromMarks = (avgMarks: number): { riskLevel: 'low' | 'medium' | 'high', riskScore: number } => {
          if (avgMarks === 0) {
            return { riskLevel: 'high', riskScore: 1.0 };
          } else if (avgMarks < 40) {
            return { riskLevel: 'high', riskScore: 0.7 + ((40 - avgMarks) / 40) * 0.3 };
          } else if (avgMarks < 60) {
            return { riskLevel: 'medium', riskScore: 0.4 + ((60 - avgMarks) / 20) * 0.3 };
          } else {
            return { riskLevel: 'low', riskScore: Math.max(0, ((100 - avgMarks) / 40) * 0.4) };
          }
        };

        // Fetch risk data for each student and build student objects
        // Use Promise.allSettled to ensure all students are processed even if some risk fetches fail
        const studentsWithRiskPromises = studentsList.map(async (student: any) => {
          const avgMarks = parseFloat(student.average_marks) || 0;
          
          // Calculate risk from marks as fallback
          const fallbackRisk = calculateRiskFromMarks(avgMarks);
          let riskLevel: 'low' | 'medium' | 'high' = fallbackRisk.riskLevel;
          let riskScore = fallbackRisk.riskScore;
          
          // Try to fetch from API (which uses assignment + exam average) with timeout
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
            
            const riskResponse = await fetch(`/api/risk-prediction/${student.id}`, {
              signal: controller.signal
            });
            clearTimeout(timeoutId);
            
            if (riskResponse.ok) {
              const riskData = await riskResponse.json();
              if (riskData.riskLevel) {
                riskLevel = riskData.riskLevel;
                riskScore = riskData.riskScore || riskScore;
              }
            }
          } catch (error) {
            // Silently use fallback calculation - don't log every error
            // console.error(`Error fetching risk for student ${student.id}:`, error);
          }
          
          return {
            id: student.id.toString(),
            name: student.name,
            email: student.email,
            rollNo: student.roll_no,
            attendance: parseFloat(student.attendance_percentage) || 0,
            averageMarks: avgMarks,
            riskLevel: riskLevel,
            riskScore: riskScore,
            subjects: [],
            lastActive: (student.updated_at || student.created_at) ? new Date(student.updated_at || student.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            status: 'active' as const
          };
        });
        
        const studentsWithRiskResults = await Promise.allSettled(studentsWithRiskPromises);
        const studentsWithRisk: Student[] = studentsWithRiskResults
          .filter((result): result is PromiseFulfilledResult<Student> => result.status === 'fulfilled')
          .map(result => result.value);
        
        console.log(`✅ AllStudents: Processed ${studentsWithRisk.length} students with risk data`);
        
        setStudents(studentsWithRisk);
        setFilteredStudents(studentsWithRisk);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching students:', error);
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  useEffect(() => {
    let filtered = students;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Risk filter
    if (riskFilter !== 'all') {
      filtered = filtered.filter(student => student.riskLevel === riskFilter);
    }

    setFilteredStudents(filtered);
  }, [students, searchTerm, riskFilter]);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'inactive': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />;
      case 'inactive': return <Clock className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
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
            <h2 className="text-2xl font-bold text-gray-800 mb-2">All Students</h2>
            <p className="text-gray-600">Manage and monitor student performance</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="glass-button px-4 py-2 text-blue-600 hover:bg-blue-50">
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
            <button className="glass-button px-4 py-2 text-green-600 hover:bg-green-50">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </button>
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
                placeholder="Search students by name, roll no, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="glass-input w-full pl-10 pr-4 py-2"
              />
            </div>
          </div>
          <div className="md:w-48">
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value as any)}
              className="glass-input w-full"
            >
              <option value="all">All Risk Levels</option>
              <option value="low">Low Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="high">High Risk</option>
            </select>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="glass-card p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/20">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Student</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Roll No</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Attendance</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Average Marks</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Risk Level</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Last Active</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id} className="border-b border-white/10 hover:bg-white/10 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div className="glass-card p-2 mr-3">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{student.name}</p>
                        <p className="text-sm text-gray-600">{student.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="glass-button px-2 py-1 text-sm">{student.rollNo}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className={`h-2 rounded-full ${student.attendance >= 80 ? 'bg-green-500' : student.attendance >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                          style={{ width: `${student.attendance}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-700">{student.attendance}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-gray-800">{student.averageMarks}%</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${getRiskColor(student.riskLevel)}`}>
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      {student.riskLevel.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(student.status)}`}>
                      {getStatusIcon(student.status)}
                      <span className="ml-1 capitalize">{student.status}</span>
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-700">{student.lastActive}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <button className="glass-button p-1 text-blue-600 hover:bg-blue-50">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="glass-button p-1 text-green-600 hover:bg-green-50">
                        <AlertTriangle className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredStudents.length === 0 && (
          <div className="text-center py-8">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No students found matching your criteria</p>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card p-6 text-center">
          <p className="text-2xl font-bold text-blue-600">{filteredStudents.length}</p>
          <p className="text-sm text-gray-600">Total Students</p>
        </div>
        <div className="glass-card p-6 text-center">
          <p className="text-2xl font-bold text-green-600">
            {filteredStudents.filter(s => s.riskLevel === 'low').length}
          </p>
          <p className="text-sm text-gray-600">Low Risk</p>
        </div>
        <div className="glass-card p-6 text-center">
          <p className="text-2xl font-bold text-yellow-600">
            {filteredStudents.filter(s => s.riskLevel === 'medium').length}
          </p>
          <p className="text-sm text-gray-600">Medium Risk</p>
        </div>
        <div className="glass-card p-6 text-center">
          <p className="text-2xl font-bold text-red-600">
            {filteredStudents.filter(s => s.riskLevel === 'high').length}
          </p>
          <p className="text-sm text-gray-600">High Risk</p>
        </div>
      </div>
    </div>
  );
}
