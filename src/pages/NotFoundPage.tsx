import React from 'react';
import { Link } from 'react-router-dom';
import { Home, LayoutDashboard, Eye } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      {/* Eye illustration */}
      <div className="relative mb-8">
        <svg viewBox="0 0 200 120" className="w-64 h-40">
          {/* Eye outline */}
          <ellipse
            cx="100"
            cy="60"
            rx="90"
            ry="50"
            fill="none"
            stroke="#e0e0e0"
            strokeWidth="4"
          />
          {/* Iris */}
          <circle cx="100" cy="60" r="30" fill="#185FA5" opacity="0.2" />
          <circle cx="100" cy="60" r="25" fill="#185FA5" opacity="0.4" />
          <circle cx="100" cy="60" r="20" fill="#185FA5" opacity="0.6" />
          {/* Pupil */}
          <circle cx="100" cy="60" r="10" fill="#1a1a1a" />
          {/* Question mark */}
          <text
            x="100"
            y="65"
            textAnchor="middle"
            fill="white"
            fontSize="14"
            fontWeight="bold"
          >
            ?
          </text>
          {/* Highlight */}
          <circle cx="92" cy="52" r="4" fill="white" opacity="0.6" />
        </svg>

        {/* 404 badge */}
        <div className="absolute -top-4 -right-4 bg-danger-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
          404
        </div>
      </div>

      {/* Content */}
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or you don't have permission to view it.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
          >
            <Home className="h-5 w-5" />
            Go to Home
          </Link>
          <Link
            to="/upload"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-500 rounded-xl text-white font-semibold hover:bg-primary-600 transition-colors"
          >
            <LayoutDashboard className="h-5 w-5" />
            Go to Dashboard
          </Link>
        </div>

        {/* Logo */}
        <div className="mt-12">
          <Link to="/" className="inline-flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
            <div className="p-1.5 rounded-lg bg-primary-100">
              <Eye className="h-5 w-5 text-primary-600" />
            </div>
            <span className="font-bold text-gray-700">
              Cataract<span className="text-primary-500">AI</span>
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
