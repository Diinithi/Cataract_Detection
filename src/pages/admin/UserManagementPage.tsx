import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Search, Edit2, ToggleLeft, ToggleRight, Shield, UserCog } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { Navbar } from '../../components/layout/Navbar';
import { Sidebar } from '../../components/layout/Sidebar';
import { LoadingSpinner, Modal } from '../../components/shared';
import { mockApi } from '../../api/mockService';
import { User, UserRole } from '../../types';

interface UserStats {
  total: number;
  active: number;
  doctors: number;
  patients: number;
}

export const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<UserStats>({ total: 0, active: 0, doctors: 0, patients: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [editModal, setEditModal] = useState<{ isOpen: boolean; user: User | null }>({
    isOpen: false,
    user: null,
  });
  const [selectedRole, setSelectedRole] = useState<UserRole>('patient');

  const [toggleModal, setToggleModal] = useState<{ isOpen: boolean; user: User | null }>({
    isOpen: false,
    user: null,
  });

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, [page, roleFilter, statusFilter, searchQuery]);

  const fetchUsers = async (query = searchQuery) => {
    setIsLoading(true);
    try {
      const response = await adminAPI.getUsers({
        page,
        limit: 20,
        role: roleFilter,
        status: statusFilter,
        search: query || undefined,
      });

      if (response.success && response.data) {
        setUsers(response.data.users);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    const response = await adminAPI.getUserStats();
    if (response.success && response.data) {
      setStats(response.data);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchUsers(searchQuery);
  };

  const handleEditUser = (user: User) => {
    setEditModal({ isOpen: true, user });
    setSelectedRole(user.role);
  };

  const handleUpdateRole = async () => {
    if (!editModal.user) return;

    try {
      const response = await adminAPI.updateUser(editModal.user.id, { role: selectedRole });
      if (response.success) {
        toast.success('User role updated');
        setEditModal({ isOpen: false, user: null });
        fetchUsers();
        fetchStats();
      }
    } catch (error) {
      toast.error('Failed to update user');
    }
  };

  const handleToggleStatus = async () => {
    if (!toggleModal.user) return;

    const newStatus = toggleModal.user.status === 'Active' ? 'Inactive' : 'Active';

    try {
      const response = await adminAPI.updateUser(toggleModal.user.id, { status: newStatus });
      if (response.success) {
        toast.success(`User ${newStatus === 'Active' ? 'activated' : 'deactivated'}`);
        setToggleModal({ isOpen: false, user: null });
        fetchUsers();
        fetchStats();
      }
    } catch (error) {
      toast.error('Failed to update user status');
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
    <div className="min-h-screen bg-background flex">
      <Navbar />

      <div className="flex-1 pt-16 flex">
        <Sidebar />

        <main className="flex-1 p-8 overflow-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600 mt-1">Manage user accounts and permissions</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary-100 rounded-xl">
                  <Users className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  <p className="text-sm text-gray-500">Total Users</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-success-100 rounded-xl">
                  <Shield className="h-6 w-6 text-success-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
                  <p className="text-sm text-gray-500">Active Users</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-warning-100 rounded-xl">
                  <UserCog className="h-6 w-6 text-warning-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.doctors}</p>
                  <p className="text-sm text-gray-500">Doctors</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-100 rounded-xl">
                  <Users className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.patients}</p>
                  <p className="text-sm text-gray-500">Patients</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <form onSubmit={handleSearch} className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name or email..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg"
                />
              </form>

              <div className="flex gap-3">
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-lg"
                >
                  <option value="All">All Roles</option>
                  <option value="patient">Patients</option>
                  <option value="doctor">Doctors</option>
                  <option value="admin">Admins</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-lg"
                >
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            {isLoading ? (
              <div className="p-12">
                <LoadingSpinner text="Loading users..." />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase">User</th>
                      <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase">Email</th>
                      <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase">Role</th>
                      <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase">Status</th>
                      <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase">Scans</th>
                      <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase">Joined</th>
                      <th className="text-right py-4 px-6 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-primary-600">
                                {getInitials(user.fullName)}
                              </span>
                            </div>
                            <span className="font-medium text-gray-900">{user.fullName}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-gray-600 text-sm">{user.email}</td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                            user.role === 'admin' ? 'bg-primary-100 text-primary-700' :
                            user.role === 'doctor' ? 'bg-warning-100 text-warning-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                            user.status === 'Active'
                              ? 'bg-success-100 text-success-700'
                              : 'bg-danger-100 text-danger-700'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              user.status === 'Active' ? 'bg-success-500' : 'bg-danger-500'
                            }`} />
                            {user.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-gray-600 text-sm">-</td>
                        <td className="py-4 px-6 text-gray-600 text-sm">
                          {format(new Date(user.createdAt), 'MMM d, yyyy')}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEditUser(user)}
                              className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                              title="Edit role"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setToggleModal({ isOpen: true, user })}
                              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                              title={user.status === 'Active' ? 'Deactivate' : 'Activate'}
                            >
                              {user.status === 'Active' ? (
                                <ToggleRight className="h-4 w-4 text-success-500" />
                              ) : (
                                <ToggleLeft className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Edit Role Modal */}
      <Modal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, user: null })}
        title="Edit User Role"
      >
        {editModal.user && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl mb-4">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-primary-600">
                  {getInitials(editModal.user.fullName)}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-900">{editModal.user.fullName}</p>
                <p className="text-sm text-gray-500">{editModal.user.email}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Role</label>
              <div className="space-y-2">
                {(['patient', 'doctor', 'admin'] as UserRole[]).map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setSelectedRole(role)}
                    className={`w-full p-3 rounded-xl border text-left capitalize transition-colors ${
                      selectedRole === role
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={() => setEditModal({ isOpen: false, user: null })}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateRole}
                className="px-4 py-2 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600"
              >
                Update Role
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Toggle Status Modal */}
      <Modal
        isOpen={toggleModal.isOpen}
        onClose={() => setToggleModal({ isOpen: false, user: null })}
        title={toggleModal.user?.status === 'Active' ? 'Deactivate User' : 'Activate User'}
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            {toggleModal.user?.status === 'Active'
              ? `Are you sure you want to deactivate ${toggleModal.user?.fullName}? They will not be able to access their account.`
              : `Activate ${toggleModal.user?.fullName}'s account? They will regain full access.`
            }
          </p>
          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={() => setToggleModal({ isOpen: false, user: null })}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleToggleStatus}
              className={`px-4 py-2 rounded-lg font-medium ${
                toggleModal.user?.status === 'Active'
                  ? 'bg-danger-500 hover:bg-danger-600 text-white'
                  : 'bg-success-500 hover:bg-success-600 text-white'
              }`}
            >
              {toggleModal.user?.status === 'Active' ? 'Deactivate' : 'Activate'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserManagementPage;
