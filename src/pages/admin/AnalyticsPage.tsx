import React, { useState, useEffect } from 'react';
import { BarChart3, Activity, TrendingUp, Users, Clock, UserPlus, Eye, Brain, Cog } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend, BarChart, Bar
} from 'recharts';
import { Navbar } from '../../components/layout/Navbar';
import { Sidebar } from '../../components/layout/Sidebar';
import { LoadingSpinner } from '../../components/shared';
import { analyticsAPI } from '../../api/client';
import { AnalyticsData, AuditLog } from '../../types';

const sexColors = {
  male: '#185FA5',
  female: '#BA7517',
};

export const AnalyticsPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analyticsResponse, logsResponse] = await Promise.all([
          analyticsAPI.getUsage(),
          analyticsAPI.getPerformance(),
        ]);

        if (analyticsResponse.success && analyticsResponse.data) {
          setAnalytics(analyticsResponse.data);
        }
        if (logsResponse.success && logsResponse.data) {
          setAuditLogs(logsResponse.data);
        }
      } catch (error) {
        toast.error('Failed to load analytics data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const getEventIcon = (event: AuditLog['event']) => {
    switch (event) {
      case 'User registered':
        return <UserPlus className="h-4 w-4 text-primary-500" />;
      case 'Image uploaded':
        return <Eye className="h-4 w-4 text-warning-500" />;
      case 'Prediction made':
        return <Brain className="h-4 w-4 text-success-500" />;
      case 'Model activated':
        return <Cog className="h-4 w-4 text-danger-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getEventColor = (event: AuditLog['event']) => {
    switch (event) {
      case 'User registered':
        return 'bg-primary-100 text-primary-700';
      case 'Image uploaded':
        return 'bg-warning-100 text-warning-700';
      case 'Prediction made':
        return 'bg-success-100 text-success-700';
      case 'Model activated':
        return 'bg-danger-100 text-danger-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex">
        <Navbar />
        <div className="flex-1 pt-16 flex">
          <Sidebar />
          <main className="flex-1 p-8">
            <LoadingSpinner fullPage text="Loading analytics..." />
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
            <h1 className="text-3xl font-bold text-gray-900">System Analytics</h1>
            <p className="text-gray-600 mt-1">Overview of system usage and performance metrics</p>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary-100 rounded-xl">
                  <Activity className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{analytics?.totalAnalyses || 1247}</p>
                  <p className="text-sm text-gray-500">Total Analyses</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-success-100 rounded-xl">
                  <TrendingUp className="h-6 w-6 text-success-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{analytics?.thisMonth || 183}</p>
                  <p className="text-sm text-gray-500">This Month</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-warning-100 rounded-xl">
                  <BarChart3 className="h-6 w-6 text-warning-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{analytics?.avgConfidence || 87.3}%</p>
                  <p className="text-sm text-gray-500">Avg Confidence</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-100 rounded-xl">
                  <Clock className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{analytics?.avgProcessingTime || 1.8}s</p>
                  <p className="text-sm text-gray-500">Avg Processing</p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* Daily Uploads */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Daily Uploads - Last 30 Days</h3>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={analytics?.dailyUploads || []} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorUploads" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#185FA5" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#185FA5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 10 }}
                    tickFormatter={(value) => value.slice(5)}
                  />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    labelFormatter={(label) => `Date: ${label}`}
                    formatter={(value: number) => [value, 'Uploads']}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#185FA5"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorUploads)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Grade Trend */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Grade Trend Over Time</h3>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart
                  data={[
                    { month: 'Jan', normal: 45, immature: 30, mature: 25 },
                    { month: 'Feb', normal: 40, immature: 35, mature: 25 },
                    { month: 'Mar', normal: 38, immature: 33, mature: 29 },
                    { month: 'Apr', normal: 42, immature: 31, mature: 27 },
                    { month: 'May', normal: 43, immature: 32, mature: 25 },
                    { month: 'Jun', normal: 42, immature: 31, mature: 27 },
                  ]}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="normal" stroke="#0F6E56" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="immature" stroke="#BA7517" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="mature" stroke="#A32D2D" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Demographics */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Demographic Breakdown</h3>
                <Users className="h-5 w-5 text-gray-400" />
              </div>

              {/* Age Groups */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-600 mb-4">Age Groups</h4>
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart
                    data={analytics?.demographicBreakdown.ageGroups || []}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal />
                    <XAxis type="number" tick={{ fontSize: 10 }} />
                    <YAxis type="category" dataKey="group" tick={{ fontSize: 10 }} width={35} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#185FA5" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Sex Distribution */}
              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-4">Sex Distribution</h4>
                <div className="flex items-center gap-6">
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Male</span>
                      <span className="font-medium">{analytics?.demographicBreakdown.sexDistribution.male || 54}%</span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${analytics?.demographicBreakdown.sexDistribution.male || 54}%`,
                          backgroundColor: sexColors.male
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Female</span>
                      <span className="font-medium">{analytics?.demographicBreakdown.sexDistribution.female || 46}%</span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${analytics?.demographicBreakdown.sexDistribution.female || 46}%`,
                          backgroundColor: sexColors.female
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Activity Log */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Recent Activity Log</h3>
                <Activity className="h-5 w-5 text-gray-400" />
              </div>

              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {auditLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-start gap-4 p-3 bg-gray-50 rounded-xl"
                  >
                    <div className="flex-shrink-0">
                      {getEventIcon(log.event)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${getEventColor(log.event)}`}>
                          {log.event}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">{log.userEmail}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(log.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AnalyticsPage;
