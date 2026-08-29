import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Filter, Search, Eye, Trash2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { Badge, LoadingSpinner, Modal } from '../../components/shared';
import { Navbar } from '../../components/layout/Navbar';
import { mockApi } from '../../api/mockService';
import { Prediction, Grade } from '../../types';

interface HistoryState {
  predictions: Prediction[];
  isLoading: boolean;
  total: number;
  page: number;
  totalPages: number;
}

const gradeFilters: { value: string; label: string }[] = [
  { value: 'All', label: 'All Grades' },
  { value: 'Normal', label: 'Normal' },
  { value: 'Immature Cataract', label: 'Immature' },
  { value: 'Mature Cataract', label: 'Mature' },
];

export const HistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [state, setState] = useState<HistoryState>({
    predictions: [],
    isLoading: true,
    total: 0,
    page: 1,
    totalPages: 0,
  });

  const [gradeFilter, setGradeFilter] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; predictionId: string | null }>({
    isOpen: false,
    predictionId: null,
  });

  const fetchHistory = async (page = 1) => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const response = await predictionAPI.getHistory({
        page,
        limit: 10,
        grade: gradeFilter,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });

      if (response.success && response.data) {
        setState({
          predictions: response.data.predictions,
          isLoading: false,
          total: response.data.total,
          page: response.data.page,
          totalPages: response.data.totalPages,
        });
      }
    } catch (error) {
      toast.error('Failed to load prediction history');
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  useEffect(() => {
    fetchHistory(1);
  }, [gradeFilter, startDate, endDate]);

  const handleSearch = () => {
    fetchHistory(1);
  };

  const handleClearFilters = () => {
    setGradeFilter('All');
    setStartDate('');
    setEndDate('');
    setSearchQuery('');
    fetchHistory(1);
  };

  const handleDelete = async () => {
    if (!deleteModal.predictionId) return;

    try {
      const response = await predictionAPI.delete(deleteModal.predictionId);
      if (response.success) {
        toast.success('Prediction deleted');
        fetchHistory(state.page);
      }
    } catch (error) {
      toast.error('Failed to delete prediction');
    } finally {
      setDeleteModal({ isOpen: false, predictionId: null });
    }
  };

  const handlePageChange = (newPage: number) => {
    fetchHistory(newPage);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Scan History</h1>
            <p className="text-gray-600 mt-1">View and manage your previous analyses</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
              {state.total} scans
            </span>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Date Range */}
            <div className="flex gap-2 flex-1">
              <div className="relative flex-1">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm"
                  placeholder="From"
                />
              </div>
              <div className="relative flex-1">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm"
                  placeholder="To"
                />
              </div>
            </div>

            {/* Grade Filter */}
            <div className="flex gap-2">
              {gradeFilters.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setGradeFilter(filter.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    gradeFilter === filter.value
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search..."
                className="w-full lg:w-48 pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm"
              />
            </div>

            {/* Clear Filters */}
            <button
              onClick={handleClearFilters}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 text-sm font-medium"
            >
              <X className="h-4 w-4" />
              Clear filters
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {state.isLoading ? (
            <div className="p-12">
              <LoadingSpinner text="Loading history..." />
            </div>
          ) : state.predictions.length === 0 ? (
            <div className="p-12 text-center">
              <Eye className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No scans yet</h3>
              <p className="text-gray-600 mb-6">Upload your first image to get started</p>
              <button
                onClick={() => navigate('/upload')}
                className="px-6 py-3 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors"
              >
                Upload Image
              </button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">#</th>
                      <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date & Time</th>
                      <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Eye Side</th>
                      <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Grade</th>
                      <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Confidence</th>
                      <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Age</th>
                      <th className="text-right py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {state.predictions.map((prediction, index) => (
                      <tr
                        key={prediction.id}
                        className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => navigate(`/results/${prediction.id}`)}
                      >
                        <td className="py-4 px-6 text-sm text-gray-500">
                          {(state.page - 1) * 10 + index + 1}
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-sm font-medium text-gray-900">
                            {format(new Date(prediction.createdAt), 'PP')}
                          </div>
                          <div className="text-xs text-gray-500">
                            {format(new Date(prediction.createdAt), 'p')}
                          </div>
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-600">
                          {prediction.eyeSide || '-'}
                        </td>
                        <td className="py-4 px-6">
                          <Badge grade={prediction.grade} size="sm" />
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  prediction.grade === 'Normal' ? 'bg-success-500' :
                                  prediction.grade === 'Immature Cataract' ? 'bg-warning-500' :
                                  'bg-danger-500'
                                }`}
                                style={{ width: `${prediction.confidence}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium text-gray-900">
                              {prediction.confidence.toFixed(1)}%
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-600">
                          {prediction.age || '-'}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/results/${prediction.id}`);
                              }}
                              className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                              title="View details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteModal({ isOpen: true, predictionId: prediction.id });
                              }}
                              className="p-2 text-gray-400 hover:text-danger-600 hover:bg-danger-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                <p className="text-sm text-gray-600">
                  Showing {(state.page - 1) * 10 + 1} to {Math.min(state.page * 10, state.total)} of {state.total}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(state.page - 1)}
                    disabled={state.page === 1}
                    className={`p-2 rounded-lg transition-colors ${
                      state.page === 1
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  {Array.from({ length: Math.min(5, state.totalPages) }, (_, i) => {
                    let pageNum;
                    if (state.totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (state.page <= 3) {
                      pageNum = i + 1;
                    } else if (state.page >= state.totalPages - 2) {
                      pageNum = state.totalPages - 4 + i;
                    } else {
                      pageNum = state.page - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-10 h-10 rounded-lg transition-colors ${
                          state.page === pageNum
                            ? 'bg-primary-500 text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => handlePageChange(state.page + 1)}
                    disabled={state.page === state.totalPages}
                    className={`p-2 rounded-lg transition-colors ${
                      state.page === state.totalPages
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, predictionId: null })}
        title="Delete Prediction"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete this prediction? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setDeleteModal({ isOpen: false, predictionId: null })}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-danger-500 text-white rounded-lg font-medium hover:bg-danger-600"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default HistoryPage;
