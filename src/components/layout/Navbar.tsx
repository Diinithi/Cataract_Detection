import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, User, LogOut, ChevronDown, LayoutDashboard, UserCog } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isLandingPage = location.pathname === '/';

  return (
    <header className={`sticky top-0 z-40 ${isLandingPage ? 'absolute w-full' : ''}`}>
      <nav className={`${isLandingPage ? 'bg-transparent' : 'bg-white border-b border-gray-200'} transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className={`p-2 rounded-lg ${isLandingPage ? 'bg-white/20' : 'bg-primary-100'} group-hover:scale-105 transition-transform`}>
                <Eye className={`h-6 w-6 ${isLandingPage ? 'text-white' : 'text-primary-600'}`} />
              </div>
              <span className={`text-xl font-bold ${isLandingPage ? 'text-white' : 'text-gray-900'}`}>
                Cataract<span className="text-primary-500">AI</span>
              </span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-6">
              {!isAuthenticated ? (
                <>
                  {isLandingPage && (
                    <>
                      <a href="#features" className={`text-sm font-medium ${isLandingPage ? 'text-white/90 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
                        Features
                      </a>
                      <a href="#how-it-works" className={`text-sm font-medium ${isLandingPage ? 'text-white/90 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
                        How It Works
                      </a>
                    </>
                  )}
                  <Link
                    to="/login"
                    className={`text-sm font-medium ${isLandingPage ? 'text-white/90 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Get Started
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/upload"
                    className={`text-sm font-medium ${location.pathname === '/upload' ? 'text-primary-600' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
                  >
                    Upload Scan
                  </Link>
                  <Link
                    to="/history"
                    className={`text-sm font-medium ${location.pathname === '/history' ? 'text-primary-600' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
                  >
                    History
                  </Link>

                  {/* User Dropdown */}
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                        <span className="text-primary-700 font-medium text-sm">
                          {user?.fullName?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-700 hidden sm:block">
                        {user?.fullName?.split(' ')[0] || 'User'}
                      </span>
                      <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {dropdownOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 animate-scale-in">
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">{user?.fullName}</p>
                          <p className="text-xs text-gray-500">{user?.email}</p>
                          <span className="inline-block mt-1 px-2 py-0.5 bg-primary-100 text-primary-700 rounded text-xs font-medium capitalize">
                            {user?.role}
                          </span>
                        </div>

                        <Link
                          to="/upload"
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <LayoutDashboard className="h-4 w-4" />
                          Dashboard
                        </Link>

                        <Link
                          to="/profile"
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <User className="h-4 w-4" />
                          Profile
                        </Link>

                        {user?.role === 'admin' && (
                          <Link
                            to="/admin/users"
                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => setDropdownOpen(false)}
                          >
                            <UserCog className="h-4 w-4" />
                            Admin Panel
                          </Link>
                        )}

                        <div className="border-t border-gray-100 mt-2 pt-2">
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-danger-600 hover:bg-danger-50 w-full transition-colors"
                          >
                            <LogOut className="h-4 w-4" />
                            Logout
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              {isAuthenticated ? (
                <Link
                  to="/upload"
                  className="bg-primary-500 text-white px-3 py-2 rounded-lg text-sm font-medium"
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="bg-primary-500 text-white px-3 py-2 rounded-lg text-sm font-medium"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
