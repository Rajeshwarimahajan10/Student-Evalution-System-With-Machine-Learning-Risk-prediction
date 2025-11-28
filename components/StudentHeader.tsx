'use client';

import { Search, Bell, MessageCircle } from 'lucide-react';

export default function StudentHeader() {
  return (
    <header className="glass-card p-4 mb-6">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <h1 className="text-2xl font-bold gradient-text">
            Student Evaluation System
          </h1>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="What do you want to find?"
              className="glass-input w-full pl-10 pr-4 py-2"
            />
          </div>
        </div>

        {/* Right Side Icons */}
        <div className="flex items-center space-x-4">
          <button className="glass-card p-2 hover:bg-white/30 transition-colors">
            <Bell className="h-5 w-5 text-gray-600" />
          </button>
          <button className="glass-card p-2 hover:bg-white/30 transition-colors">
            <MessageCircle className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>
    </header>
  );
}
