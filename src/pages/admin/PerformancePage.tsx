import React, { useState, useEffect } from 'react';
import { TrendingUp, Target, Activity, GaugeCircle, ArrowUp } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { Navbar } from '../../components/layout/Navbar';
import { Sidebar } from '../../components/layout/Sidebar';
import { LoadingSpinner, Modal } from '../../components/shared';
import { mockApi } from '../../api/mockService';
import { ModelVersion } from '../../types';

const rocData = [
  { fpr: 0, tpr: 0 },
  { fpr: 0.1, tpr: 0.85 },
  { fpr: 0.2, tpr: 0.92 },
  { fpr: 0.3, tpr: 0.95 },
  { fpr: 0.4, tpr: 0.97 },
  { fpr: 0.5, tpr: 0.98 },
  { fpr: 0.6, tpr: 0.985 },
  { fpr: 0.7, tpr: 0.99 },
  { fpr: 0.8, tpr: 0.995 },
  { fpr: 0.9, tpr: 0.998 },
  { fpr: 1, tpr: 1 },
];

const gradeDistributionData = [
  { name: 'Normal', value: 42, color: '#0F6E56' },
  { name: 'Immature', value: 31, color: '#BA7517' },
  { name: 'Mature', value: 27, color: '#A32D2D' },
];

interface PerformanceData {
  accuracy: number;
  sensitivity: number;
  specificity: number;
  auc: number;
}

export const PerformancePage: React.FC = () => {
  const [performance, setPerformance] = useState<PerformanceData | null>(null);
  const [modelVersions, setModelVersions] = useState<ModelVersion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activateModal, setActivateModal] = useState<{ isOpen: boolean; version: ModelVersion | null }>({
    isOpen: false,
    version: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [perfResponse, versionsResponse] = await Promise.all([
          analyticsAPI.getPerformance(),
          analyticsAPI.getModelVersions(),
        ]);

        if (perfResponse.success && perfResponse.data) {
          setPerformance(perfResponse.data);
        }
        if (versionsResponse.success && versionsResponse.data) {
          setModelVersions(versionsResponse.data);
        }
      } catch (error) {
        toast.error('Failed to load performance data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleActivateModel = async () => {
    if (!activateModal.version) return;

    try {
      const response = await analyticsAPI.activateModel(activateModal.version.id);
      if (response.success) {
        toast.success(`${activateModal.version.name} activated successfully`);
        setModelVersions(prev =>
          prev.map(v => ({
            ...v,
            status: v.id === activateModal.version!.id ? 'Active' : 'Inactive',
          }))
        );
      }
    } catch (error) {
      toast.error('Failed to activate model');
    } finally {
      setActivateModal({ isOpen: false, version: null });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex">
        <Navbar />
        <div className="flex-1 pt-16 flex">
          <Sidebar />
          <main className="flex-1 p-8">
            <LoadingSpinner fullPage text="Loading performance data..." />
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      <Navbar />

      <div className="flex-1 pt-16 flex">
        <Sidebar />

        <main className="flex-1 p-8 overflow-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Model Performance</h1>
            <p className="text-gray-600 mt-1">Monitor the performance of the ResNet50 cataract detection model</p>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-success-100 rounded-xl">
                  <Target className="h-6 w-6 text-success-600" />
                </div>
                <div className="flex items-center gap-1 text-success-600 text-sm">
                  <ArrowUp className="h-3 w-3" />
                  <span>+6.5%</span>
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">{performance?.accuracy || 91.2}%</p>
              <p className="text-sm text-gray-500 mt-1">Accuracy</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-primary-100 rounded-xl">
                  <Activity className="h-6 w-6 text-primary-600" />
                </div>
                <div className="flex items-center gap-1 text-success-600 text-sm">
                  <ArrowUp className="h-3 w-3" />
                  <span>+7.2%</span>
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">{performance?.sensitivity || 93.4}%</p>
              <p className="text-sm text-gray-500 mt-1">Sensitivity (Recall)</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-warning-100 rounded-xl">
                  <TrendingUp className="h-6 w-6 text-warning-600" />
                </div>
                <div className="flex items-center gap-1 text-success-600 text-sm">
                  <ArrowUp className="h-3 w-3" />
                  <span>+7.4%</span>
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">{performance?.specificity || 88.9}%</p>
              <p className="text-sm text-gray-500 mt-1">Specificity</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-danger-100 rounded-xl">
                  <GaugeCircle className="h-6 w-6 text-danger-600" />
                </div>
                <div className="flex items-center gap-1 text-success-600 text-sm">
                  <ArrowUp className="h-3 w-3" />
                  <span>+0.04</span>
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">{performance?.auc || 0.961}</p>
              <p className="text-sm text-gray-500 mt-1">AUC Score</p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* ROC Curve */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">ROC Curve</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={rocData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis
                    dataKey="fpr"
                    label={{ value: 'False Positive Rate', position: 'bottom', offset: -5, fontSize: 12 }}
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis
                    label={{ value: 'True Positive Rate', angle: -90, position: 'insideLeft', fontSize: 12 }}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip />
                  <Line type="monotone" dataKey="tpr" stroke="#185FA5" strokeWidth={2} dot={false} />
                  {/* Diagonal reference line */}
                  <Line type="monotone" dataKey="tpr" data={[{ fpr: 0, tpr: 0 }, { fpr: 1, tpr: 1 }]} stroke="#9ca3af" strokeDasharray="5 5" dot={false} />
                </LineChart>
              </ResponsiveContainer>
              <p className="text-center text-sm text-gray-500 mt-4">AUC = 0.961 (Excellent)</p>
            </div>

            {/* Grade Distribution */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Grade Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={gradeDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {gradeDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-6 mt-4">
                {gradeDistributionData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-gray-600">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Model Versions Table */}
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Model Versions</h3>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase">Version</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase">Deployed</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase">Accuracy</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase">AUC</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="text-right py-4 px-6 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {modelVersions.map((version) => (
                  <tr key={version.id} className="border-b border-gray-50">
                    <td className="py-4 px-6 font-medium text-gray-900">{version.name}</td>
                    <td className="py-4 px-6 text-gray-600">
                      {new Date(version.deployedAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-gray-600">{version.accuracy}%</td>
                    <td className="py-4 px-6 text-gray-600">{version.auc}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        version.status === 'Active'
                          ? 'bg-success-100 text-success-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {version.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      {version.status === 'Inactive' && (
                        <button
                          onClick={() => setActivateModal({ isOpen: true, version })}
                          className="px-4 py-2 bg-primary-50 text-primary-600 rounded-lg text-sm font-medium hover:bg-primary-100 transition-colors"
                        >
                          Activate
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* Activate Modal */}
      <Modal
        isOpen={activateModal.isOpen}
        onClose={() => setActivateModal({ isOpen: false, version: null })}
        title="Activate Model Version"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to activate {activateModal.version?.name}?
            The currently active model will be deactivated.
          </p>
          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={() => setActivateModal({ isOpen: false, version: null })}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleActivateModel}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600"
            >
              Activate
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PerformancePage;
