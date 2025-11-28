'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  BookOpen, 
  BarChart3,
  TrendingUp, 
  AlertTriangle,
  GraduationCap,
  Award,
  Calendar,
  DollarSign,
  LucideIcon
} from 'lucide-react';

interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  averageAttendance: number;
  highRiskStudents: number;
  totalSubjects: number;
  averageGrade: number;
  pendingFees: number;
  recentActivities: {
    type: string;
    description: string;
    time: string;
    icon: any;
  }[];
}

interface QuickActionButtonProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color: 'blue' | 'red' | 'green' | 'purple';
  onClick: () => void;
}

function QuickActionButton({ icon: Icon, title, description, color, onClick }: QuickActionButtonProps) {
  const colorClasses = {
    blue: 'text-blue-600',
    red: 'text-red-600',
    green: 'text-green-600',
    purple: 'text-purple-600'
  };

  return (
    <button
      onClick={onClick}
      className="glass-button p-4 text-center hover:bg-white/30 transition-colors cursor-pointer"
    >
      <Icon className={`h-8 w-8 ${colorClasses[color]} mx-auto mb-2`} />
      <p className="font-medium text-gray-800">{title}</p>
      <p className="text-sm text-gray-600">{description}</p>
    </button>
  );
}

interface TeacherOverviewProps {
  setActiveTab?: (tab: string) => void;
}

export default function TeacherOverview({ setActiveTab }: TeacherOverviewProps = {}) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch real data from API
    const fetchStats = async () => {
      try {
        // Fetch students
        const studentsResponse = await fetch('/api/students');
        const studentsData = await studentsResponse.json();
        const students = studentsData.students || [];
        
        console.log(`📊 TeacherOverview: Fetched ${students.length} students from API`);
        
        // Calculate statistics
        const totalStudents = students.length;
        
        // Calculate average attendance from students table
        const averageAttendance = students.length > 0
          ? students.reduce((sum: number, s: any) => sum + (parseFloat(s.attendance_percentage) || 0), 0) / students.length
          : 0;
        
        // Calculate average grade from student_subjects (average_marks)
        const averageGrade = students.length > 0
          ? students.reduce((sum: number, s: any) => {
              const avgMarks = parseFloat(s.average_marks) || 0;
              return sum + avgMarks;
            }, 0) / students.length
          : 0;
        
        // Fetch risk predictions to count high risk students (optimized - use Promise.allSettled)
        let highRiskStudents = 0;
        let mediumRiskStudents = 0;
        let lowRiskStudents = 0;
        
        try {
          // Fetch risk data for all students in parallel with timeout
          const riskPromises = students.map(async (student: any) => {
            try {
              const controller = new AbortController();
              const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 second timeout
              
              const riskResponse = await fetch(`/api/risk-prediction/${student.id}`, {
                signal: controller.signal
              });
              clearTimeout(timeoutId);
              
              if (riskResponse.ok) {
                const riskData = await riskResponse.json();
                return riskData.riskLevel || 'low';
              }
              return 'low';
            } catch (error) {
              return 'low';
            }
          });
          
          const riskResults = await Promise.allSettled(riskPromises);
          const riskLevels = riskResults
            .filter((r): r is PromiseFulfilledResult<string> => r.status === 'fulfilled')
            .map(r => r.value);
          
          highRiskStudents = riskLevels.filter(level => level === 'high').length;
          mediumRiskStudents = riskLevels.filter(level => level === 'medium').length;
          lowRiskStudents = riskLevels.filter(level => level === 'low').length;
        } catch (error) {
          console.error('Error fetching risk data:', error);
        }

        setStats({
          totalStudents: totalStudents,
          totalTeachers: 5,
          averageAttendance: Math.round(averageAttendance * 10) / 10,
          highRiskStudents: highRiskStudents,
          totalSubjects: 5,
          averageGrade: Math.round(averageGrade * 10) / 10,
          pendingFees: 125000,
          recentActivities: [
            {
              type: 'System Update',
              description: `${totalStudents} students in the system`,
              time: 'Just now',
              icon: Users
            },
            {
              type: 'Risk Alert',
              description: `${highRiskStudents} students show high risk indicators`,
              time: 'Today',
              icon: AlertTriangle
            },
            {
              type: 'Attendance Update',
              description: `Average attendance: ${Math.round(averageAttendance)}%`,
              time: 'Today',
              icon: Calendar
            },
            {
              type: 'Performance',
              description: `Average grade: ${Math.round(averageGrade)}%`,
              time: 'Today',
              icon: Award
            }
          ]
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching stats:', error);
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Welcome to Teacher Dashboard
            </h2>
            <p className="text-gray-600">Monitor and manage your students' academic performance</p>
          </div>
          <div className="text-right">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-600">
              <AlertTriangle className="h-4 w-4 mr-1" />
              {stats.highRiskStudents} High Risk Students
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-6 card-hover">
          <div className="flex items-center">
            <div className="glass-card p-3 mr-4">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalStudents}</p>
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
              <p className="text-2xl font-bold text-gray-800">{stats.averageAttendance}%</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 card-hover">
          <div className="flex items-center">
            <div className="glass-card p-3 mr-4">
              <Award className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Average Grade</p>
              <p className="text-2xl font-bold text-gray-800">{stats.averageGrade}%</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 card-hover">
          <div className="flex items-center">
            <div className="glass-card p-3 mr-4">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">High Risk</p>
              <p className="text-2xl font-bold text-gray-800">{stats.highRiskStudents}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 card-hover">
          <div className="flex items-center">
            <div className="glass-card p-3 mr-4">
              <BookOpen className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Subjects</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalSubjects}</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 card-hover">
          <div className="flex items-center">
            <div className="glass-card p-3 mr-4">
              <GraduationCap className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Teachers</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalTeachers}</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 card-hover">
          <div className="flex items-center">
            <div className="glass-card p-3 mr-4">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending Fees</p>
              <p className="text-2xl font-bold text-gray-800">₹{stats.pendingFees.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activities</h3>
        <div className="space-y-4">
          {stats.recentActivities.map((activity, index) => {
            const Icon = activity.icon;
            return (
              <div key={index} className="flex items-center p-3 bg-white/20 rounded-lg">
                <div className="glass-card p-2 mr-4">
                  <Icon className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{activity.type}</p>
                  <p className="text-sm text-gray-600">{activity.description}</p>
                </div>
                <div className="text-sm text-gray-500">{activity.time}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickActionButton
            icon={Users}
            title="View All Students"
            description="Manage student records"
            color="blue"
            onClick={() => setActiveTab?.('students')}
          />
          <QuickActionButton
            icon={AlertTriangle}
            title="Risk Analysis"
            description="Check student risks"
            color="red"
            onClick={() => setActiveTab?.('risk')}
          />
          <QuickActionButton
            icon={Calendar}
            title="Attendance"
            description="Mark attendance"
            color="green"
            onClick={() => setActiveTab?.('attendance')}
          />
          <QuickActionButton
            icon={BarChart3}
            title="Analytics"
            description="View reports"
            color="purple"
            onClick={() => setActiveTab?.('analytics')}
          />
        </div>
      </div>
    </div>
  );
}
