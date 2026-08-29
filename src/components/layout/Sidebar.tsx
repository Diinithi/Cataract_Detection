import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Eye,
  LayoutDashboard,
  Users,
  BarChart3,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

const menuItems = [
  { path: '/admin/users', icon: Users, label: 'User Management' },
  { path: '/admin/performance', icon: TrendingUp, label: 'Model Performance' },
  { path: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onToggle }) => {
  const location = useLocation();

  return (
    <aside
      className={`bg-white border-r border-gray-200 h-screen sticky top-0 transition-all duration-300 ${
        isOpen ? 'w-64' : 'w-20'
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-gray-200">
          {isOpen && (
            <Link to="/" className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-primary-100">
                <Eye className="h-5 w-5 text-primary-600" />
              </div>
              <span className="font-bold text-gray-900">
                Cataract<span className="text-primary-500">AI</span>
              </span>
            </Link>
          )}
          {!isOpen && (
            <div className="mx-auto p-1.5 rounded-lg bg-primary-100">
              <Eye className="h-5 w-5 text-primary-600" />
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                  isActive
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
                title={!isOpen ? item.label : undefined}
              >
                <Icon className={`h-5 w-5 flex-shrink-0 ${isActive ? 'text-primary-600' : ''}`} />
                {isOpen && (
                  <span className={`text-sm font-medium ${isActive ? 'text-primary-700' : ''}`}>
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer with toggle button */}
        <div className="p-3 border-t border-gray-200">
          <button
            onClick={onToggle}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          >
            {isOpen ? (
              <>
                <ChevronLeft className="h-4 w-4" />
                <span className="text-sm">Collapse</span>
              </>
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
