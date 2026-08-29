import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Pages
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/auth/AuthPage';
import UploadPage from './pages/user/UploadPage';
import ResultPage from './pages/user/ResultPage';
import HistoryPage from './pages/user/HistoryPage';
import ProfilePage from './pages/user/ProfilePage';
import UserManagementPage from './pages/admin/UserManagementPage';
import PerformancePage from './pages/admin/PerformancePage';
import AnalyticsPage from './pages/admin/AnalyticsPage';
import NotFoundPage from './pages/NotFoundPage';

// Components
import { ProtectedRoute, AdminRoute } from './components/shared';

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#1a1a1a',
            borderRadius: '12px',
            padding: '16px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
          },
          success: {
            iconTheme: {
              primary: '#0F6E56',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#A32D2D',
              secondary: '#fff',
            },
          },
        }}
      />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<AuthPage />} />

        {/* Protected Routes */}
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <UploadPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/results/:id"
          element={
            <ProtectedRoute>
              <ResultPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <HistoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <UserManagementPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/performance"
          element={
            <AdminRoute>
              <PerformancePage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/analytics"
          element={
            <AdminRoute>
              <AnalyticsPage />
            </AdminRoute>
          }
        />
        <Route path="/admin" element={<Navigate to="/admin/users" replace />} />

        {/* 404 Not Found */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
