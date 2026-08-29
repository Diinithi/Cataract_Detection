import React, { useState, useEffect } from 'react';
import { User, Mail, Lock, Calendar, Shield, Eye, UserCog } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { useAuthStore } from '../../store/authStore';
import { PasswordStrength } from '../../components/shared';
import { Navbar } from '../../components/layout/Navbar';
import { userAPI, authAPI } from '../../api/client';

type Sex = 'Male' | 'Female' | 'Prefer not to say';

export const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Personal info state
  const [personalInfo, setPersonalInfo] = useState({
    fullName: '',
    age: '',
    sex: 'Prefer not to say' as Sex,
  });

  // Password state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // User stats
  const [stats, setStats] = useState({
    totalScans: 0,
    lastScan: null as string | null,
  });

  useEffect(() => {
    if (user) {
      setPersonalInfo({
        fullName: user.fullName || '',
        age: user.age?.toString() || '',
        sex: user.sex || 'Prefer not to say',
      });
    }
  }, [user]);

  useEffect(() => {
    const fetchStats = async () => {
      const response = await userAPI.getStats();
      if (response.success && response.data) {
        setStats(response.data);
      }
    };
    fetchStats();
  }, []);

  const handleSaveInfo = async () => {
    setIsLoading(true);
    try {
      const response = await userAPI.updateProfile({
        fullName: personalInfo.fullName,
        age: personalInfo.age ? parseInt(personalInfo.age) : undefined,
        sex: personalInfo.sex,
      });

      if (response.success && response.data) {
        updateUser({
          fullName: personalInfo.fullName,
          age: personalInfo.age ? parseInt(personalInfo.age) : undefined,
          sex: personalInfo.sex,
        });
        toast.success('Profile updated successfully');
      } else {
        toast.error(response.message || 'Failed to update profile');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error('Please fill in all password fields');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error('New password must be at least 8 characters');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsChangingPassword(true);
    try {
      const response = await authAPI.changePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );

      if (response.success) {
        toast.success('Password changed successfully');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } else {
        toast.error(response.message || 'Failed to change password');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center sticky top-24">
              {/* Avatar */}
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">
                  {user?.fullName ? getInitials(user.fullName) : 'U'}
                </span>
              </div>

              {/* Name & Email */}
              <h2 className="text-xl font-semibold text-gray-900 mb-1">{user?.fullName}</h2>
              <div className="flex items-center justify-center gap-1 text-gray-500 text-sm mb-4">
                <Mail className="h-4 w-4" />
                {user?.email}
              </div>

              {/* Role Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-700 rounded-full text-sm font-medium mb-6 capitalize">
                <UserCog className="h-4 w-4" />
                {user?.role}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-6">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalScans}</p>
                  <p className="text-sm text-gray-500">Total scans</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {stats.lastScan ? format(new Date(stats.lastScan), 'MMM d, yyyy') : '-'}
                  </p>
                  <p className="text-sm text-gray-500">Last scan</p>
                </div>
              </div>

              {/* Member Since */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-xs text-gray-400">
                  Member since {user?.createdAt ? format(new Date(user.createdAt), 'MMMM yyyy') : '-'}
                </p>
              </div>

              {/* Status */}
              <div className="flex items-center justify-center gap-2 mt-4">
                <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse" />
                <span className="text-sm text-success-600 font-medium">Active</span>
              </div>
            </div>
          </div>

          {/* Right Column - Edit Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information Card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-8">
              <div className="flex items-center gap-3 mb-6">
                <User className="h-5 w-5 text-primary-500" />
                <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={personalInfo.fullName}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, fullName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="number"
                        value={personalInfo.age}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, age: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                        placeholder="Age"
                        min="1"
                        max="120"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sex</label>
                    <select
                      value={personalInfo.sex}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, sex: e.target.value as Sex })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleSaveInfo}
                  disabled={isLoading}
                  className={`w-full py-3 px-6 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 ${
                    isLoading
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-primary-500 hover:bg-primary-600 text-white'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </div>

            {/* Change Password Card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-8">
              <div className="flex items-center gap-3 mb-6">
                <Lock className="h-5 w-5 text-primary-500" />
                <h3 className="text-lg font-semibold text-gray-900">Change Password</h3>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type={showPasswords.current ? 'text' : 'password'}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500/20"
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type={showPasswords.new ? 'text' : 'password'}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500/20"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                  </div>
                  <PasswordStrength password={passwordData.newPassword} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type={showPasswords.confirm ? 'text' : 'password'}
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500/20"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                  </div>
                  {passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword && (
                    <p className="mt-2 text-sm text-danger-600">Passwords do not match</p>
                  )}
                </div>

                <button
                  onClick={handleChangePassword}
                  disabled={isChangingPassword}
                  className={`w-full py-3 px-6 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 ${
                    isChangingPassword
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-900 hover:bg-gray-800 text-white'
                  }`}
                >
                  {isChangingPassword ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Update Password'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
