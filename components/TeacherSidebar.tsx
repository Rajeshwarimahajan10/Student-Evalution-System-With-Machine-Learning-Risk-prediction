'use client';

import { 
  Home, 
  Users, 
  BarChart3, 
  AlertTriangle, 
  Calendar,
  LogOut,
  User
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface TeacherSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function TeacherSidebar({ activeTab, setActiveTab }: TeacherSidebarProps) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'students', label: 'All Students', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'risk', label: 'Risk Management', icon: AlertTriangle },
    { id: 'attendance', label: 'Attendance', icon: Calendar },
  ];

  return (
    <div className="w-64 glass-card min-h-screen p-6">
      {/* User Info */}
      <div className="flex items-center mb-8">
        <div className="glass-card p-3 mr-3">
          <User className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">Teacher Portal</h3>
          <p className="text-sm text-gray-600">{user?.email}</p>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full sidebar-item ${
                activeTab === item.id ? 'active' : ''
              }`}
            >
              <Icon className="h-5 w-5 mr-3" />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="mt-8 pt-6 border-t border-white/20">
        <button
          onClick={handleLogout}
          className="w-full sidebar-item text-red-600 hover:bg-red-50"
        >
          <LogOut className="h-5 w-5 mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
}
