'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import StudentSidebar from '@/components/StudentSidebar';
import StudentHeader from '@/components/StudentHeader';
import StudentOverview from '@/components/StudentOverview';
import StudentSubjects from '@/components/StudentSubjects';
import StudentAttendance from '@/components/StudentAttendance';
import StudentFinance from '@/components/StudentFinance';
import StudentRiskAnalysis from '@/components/StudentRiskAnalysis';

export default function StudentDashboard() {
  const { user, userRole, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!loading && (!user || userRole !== 'student')) {
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

  if (!user || userRole !== 'student') {
    return null;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <StudentOverview />;
      case 'subjects':
        return <StudentSubjects />;
      case 'attendance':
        return <StudentAttendance />;
      case 'finance':
        return <StudentFinance />;
      case 'risk':
        return <StudentRiskAnalysis />;
      default:
        return <StudentOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="flex">
        <StudentSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex-1 flex flex-col">
          <StudentHeader />
          <main className="flex-1 p-6">
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  );
}
