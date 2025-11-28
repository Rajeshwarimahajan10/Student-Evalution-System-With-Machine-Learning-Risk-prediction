'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import TeacherSidebar from '@/components/TeacherSidebar';
import TeacherHeader from '@/components/TeacherHeader';
import TeacherOverview from '@/components/TeacherOverview';
import AllStudents from '@/components/AllStudents';
import StudentAnalytics from '@/components/StudentAnalytics';
import RiskManagement from '@/components/RiskManagement';
import AttendanceManagement from '@/components/AttendanceManagement';

export default function TeacherDashboard() {
  const { user, userRole, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!loading && (!user || userRole !== 'teacher')) {
      router.push('/');
    }
  }, [user, userRole, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || userRole !== 'teacher') {
    return null;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <TeacherOverview setActiveTab={setActiveTab} />;
      case 'students':
        return <AllStudents />;
      case 'analytics':
        return <StudentAnalytics />;
      case 'risk':
        return <RiskManagement />;
      case 'attendance':
        return <AttendanceManagement />;
      default:
        return <TeacherOverview setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="flex">
        <TeacherSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex-1 flex flex-col">
          <TeacherHeader />
          <main className="flex-1 p-6">
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  );
}
