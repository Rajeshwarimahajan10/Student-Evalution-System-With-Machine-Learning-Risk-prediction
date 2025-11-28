'use client';

import { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Target,
  Users,
  BookOpen,
  Calendar,
  Send,
  Eye
} from 'lucide-react';

interface RiskStudent {
  id: string;
  name: string;
  rollNo: string;
  email: string;
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  factors: {
    attendance: number;
    assignmentMarks: number;
    examScores: number;
  };
  recommendations: string[];
  lastUpdated: string;
  status: 'monitored' | 'intervention' | 'resolved';
}

interface RiskTrend {
  date: string;
  highRisk: number;
  mediumRisk: number;
  lowRisk: number;
}

export default function RiskManagement() {
  const [riskStudents, setRiskStudents] = useState<RiskStudent[]>([]);
  const [riskTrends, setRiskTrends] = useState<RiskTrend[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<RiskStudent | null>(null);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setRiskStudents([
        {
          id: '1',
          name: 'John Smith',
          rollNo: 'CS2024002',
          email: 'johnsmith@gmail.com',
          riskScore: 0.78,
          riskLevel: 'high',
          factors: {
            attendance: 78,
            assignmentMarks: 65,
            examScores: 72
          },
          recommendations: [
            'Schedule one-on-one meeting',
            'Provide additional study materials',
            'Monitor attendance closely',
            'Consider academic counseling'
          ],
          lastUpdated: '2024-01-15',
          status: 'intervention'
        },
        {
          id: '2',
          name: 'Ahmed Jones',
          rollNo: 'CS2024003',
          email: 'ahmedjones@gmail.com',
          riskScore: 0.45,
          riskLevel: 'medium',
          factors: {
            attendance: 85,
            assignmentMarks: 75,
            examScores: 80
          },
          recommendations: [
            'Encourage regular attendance',
            'Provide assignment feedback',
            'Monitor progress weekly'
          ],
          lastUpdated: '2024-01-14',
          status: 'monitored'
        },
        {
          id: '3',
          name: 'Liam Davis',
          rollNo: 'CS2024006',
          email: 'liamdavis@gmail.com',
          riskScore: 0.35,
          riskLevel: 'medium',
          factors: {
            attendance: 82,
            assignmentMarks: 78,
            examScores: 85
          },
          recommendations: [
            'Maintain current performance',
            'Focus on attendance improvement'
          ],
          lastUpdated: '2024-01-13',
          status: 'monitored'
        }
      ]);

      setRiskTrends([
        { date: '2024-01-01', highRisk: 5, mediumRisk: 8, lowRisk: 17 },
        { date: '2024-01-08', highRisk: 4, mediumRisk: 9, lowRisk: 17 },
        { date: '2024-01-15', highRisk: 3, mediumRisk: 8, lowRisk: 19 }
      ]);

      setLoading(false);
    }, 1000);
  }, []);

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
      case 'monitored': return 'text-blue-600 bg-blue-100';
      case 'intervention': return 'text-orange-600 bg-orange-100';
      case 'resolved': return 'text-green-600 bg-green-100';
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
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Risk Management</h2>
            <p className="text-gray-600">Monitor and manage student academic risks</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="glass-button px-4 py-2 text-blue-600 hover:bg-blue-50">
              <Send className="h-4 w-4 mr-2" />
              Send Alerts
            </button>
          </div>
        </div>
      </div>

      {/* Risk Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 card-hover">
          <div className="flex items-center">
            <div className="glass-card p-3 mr-4">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">High Risk Students</p>
              <p className="text-2xl font-bold text-red-600">
                {riskStudents.filter(s => s.riskLevel === 'high').length}
              </p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 card-hover">
          <div className="flex items-center">
            <div className="glass-card p-3 mr-4">
              <Target className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Medium Risk Students</p>
              <p className="text-2xl font-bold text-yellow-600">
                {riskStudents.filter(s => s.riskLevel === 'medium').length}
              </p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 card-hover">
          <div className="flex items-center">
            <div className="glass-card p-3 mr-4">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Under Intervention</p>
              <p className="text-2xl font-bold text-green-600">
                {riskStudents.filter(s => s.status === 'intervention').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Trends */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Risk Trends</h3>
        <div className="space-y-4">
          {riskTrends.map((trend, index) => (
            <div key={index} className="p-4 bg-white/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-800">{trend.date}</span>
                <span className="text-sm text-gray-600">Total: {trend.highRisk + trend.mediumRisk + trend.lowRisk} students</span>
              </div>
              <div className="flex space-x-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-red-600">High Risk</span>
                    <span className="text-sm font-medium">{trend.highRisk}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-red-500"
                      style={{ width: `${(trend.highRisk / (trend.highRisk + trend.mediumRisk + trend.lowRisk)) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-yellow-600">Medium Risk</span>
                    <span className="text-sm font-medium">{trend.mediumRisk}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-yellow-500"
                      style={{ width: `${(trend.mediumRisk / (trend.highRisk + trend.mediumRisk + trend.lowRisk)) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-green-600">Low Risk</span>
                    <span className="text-sm font-medium">{trend.lowRisk}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-green-500"
                      style={{ width: `${(trend.lowRisk / (trend.highRisk + trend.mediumRisk + trend.lowRisk)) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* At Risk Students */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">At Risk Students</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/20">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Student</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Risk Level</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Risk Score</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Last Updated</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {riskStudents.map((student) => (
                <tr key={student.id} className="border-b border-white/10 hover:bg-white/10 transition-colors">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-gray-800">{student.name}</p>
                      <p className="text-sm text-gray-600">{student.rollNo}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${getRiskColor(student.riskLevel)}`}>
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      {student.riskLevel.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className={`h-2 rounded-full ${getRiskBarColor(student.riskLevel)}`}
                          style={{ width: `${student.riskScore * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-800">
                        {Math.round(student.riskScore * 100)}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(student.status)}`}>
                      {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-700">{student.lastUpdated}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => setSelectedStudent(student)}
                        className="glass-button p-1 text-blue-600 hover:bg-blue-50"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="glass-button p-1 text-green-600 hover:bg-green-50">
                        <Send className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Detail Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="glass-card p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">Student Risk Analysis</h3>
              <button 
                onClick={() => setSelectedStudent(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium text-gray-800">{selectedStudent.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Roll No</p>
                  <p className="font-medium text-gray-800">{selectedStudent.rollNo}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-white/20 rounded-lg">
                  <Calendar className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Attendance</p>
                  <p className="font-bold text-gray-800">{selectedStudent.factors.attendance}%</p>
                </div>
                <div className="text-center p-3 bg-white/20 rounded-lg">
                  <BookOpen className="h-6 w-6 text-green-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Assignments</p>
                  <p className="font-bold text-gray-800">{selectedStudent.factors.assignmentMarks}%</p>
                </div>
                <div className="text-center p-3 bg-white/20 rounded-lg">
                  <Target className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Exams</p>
                  <p className="font-bold text-gray-800">{selectedStudent.factors.examScores}%</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-800 mb-2">Recommendations</h4>
                <div className="space-y-2">
                  {selectedStudent.recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start p-2 bg-blue-50 rounded-lg">
                      <AlertTriangle className="h-4 w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">{recommendation}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3">
                <button className="flex-1 glass-button py-2 text-blue-600 hover:bg-blue-50">
                  Schedule Meeting
                </button>
                <button className="flex-1 glass-button py-2 text-green-600 hover:bg-green-50">
                  Send Recommendations
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
