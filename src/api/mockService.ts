import { User, Prediction, ModelVersion, AnalyticsData, AuditLog, Grade, ImageUpload } from '../types';

// Mock delay to simulate network requests
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Simulated database
let mockUsers: User[] = [
  {
    id: 'user-admin',
    email: 'admin@cataractai.com',
    fullName: 'Admin User',
    role: 'admin',
    age: 35,
    sex: 'Male',
    createdAt: '2026-01-01T00:00:00Z',
    lastLogin: new Date().toISOString(),
    status: 'Active',
  },
  {
    id: 'user-1',
    email: 'dr.sarah.wilson@hospital.com',
    fullName: 'Dr. Sarah Wilson',
    role: 'doctor',
    age: 42,
    sex: 'Female',
    createdAt: '2026-02-15T08:30:00Z',
    status: 'Active',
  },
  {
    id: 'user-2',
    email: 'john.doe@gmail.com',
    fullName: 'John Doe',
    role: 'patient',
    age: 58,
    sex: 'Male',
    createdAt: '2026-03-10T14:22:00Z',
    status: 'Active',
  },
  {
    id: 'user-3',
    email: 'jane.smith@yahoo.com',
    fullName: 'Jane Smith',
    role: 'patient',
    age: 67,
    sex: 'Female',
    createdAt: '2026-03-20T09:15:00Z',
    status: 'Active',
  },
  {
    id: 'user-4',
    email: 'dr.michael.chen@clinic.com',
    fullName: 'Dr. Michael Chen',
    role: 'doctor',
    age: 38,
    sex: 'Male',
    createdAt: '2026-04-01T11:45:00Z',
    status: 'Active',
  },
  {
    id: 'user-5',
    email: 'patient.emma@outlook.com',
    fullName: 'Emma Davis',
    role: 'patient',
    age: 72,
    sex: 'Female',
    createdAt: '2026-04-12T16:30:00Z',
    status: 'Active',
  },
  {
    id: 'user-6',
    email: 'robert.brown@email.com',
    fullName: 'Robert Brown',
    role: 'patient',
    age: 45,
    sex: 'Male',
    createdAt: '2026-04-20T10:00:00Z',
    status: 'Inactive',
  },
  {
    id: 'user-7',
    email: 'lisa.johnson@gmail.com',
    fullName: 'Lisa Johnson',
    role: 'patient',
    age: 61,
    sex: 'Female',
    createdAt: '2026-05-01T13:20:00Z',
    status: 'Active',
  },
];

const generateMockPredictions = (): Prediction[] => {
  const grades: Grade[] = ['Normal', 'Immature Cataract', 'Mature Cataract'];
  const eyeSides: ('Left' | 'Right' | 'Not specified')[] = ['Left', 'Right', 'Not specified'];
  const sexes: ('Male' | 'Female' | 'Prefer not to say')[] = ['Male', 'Female', 'Prefer not to say'];

  const predictions: Prediction[] = [];
  const now = new Date();

  // Generate 47 predictions spread over the last 6 months
  for (let i = 0; i < 47; i++) {
    const date = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000 * 4)); // Every ~4 days
    const random = Math.random();
    let grade: Grade;
    if (random < 0.42) grade = 'Normal';
    else if (random < 0.73) grade = 'Immature Cataract';
    else grade = 'Mature Cataract';

    const confidence = grade === 'Normal'
      ? 88 + Math.random() * 10
      : grade === 'Immature Cataract'
      ? 82 + Math.random() * 14
      : 91 + Math.random() * 8;

    const baseNormal = grade === 'Normal' ? confidence : (100 - confidence) * 0.6 + Math.random() * 5;
    const baseImmature = grade === 'Immature Cataract' ? confidence : (100 - confidence) * 0.3 + Math.random() * 3;
    const baseMature = grade === 'Mature Cataract' ? confidence : (100 - confidence) * 0.1 + Math.random() * 2;

    predictions.push({
      id: `pred-${String(i + 1).padStart(4, '0')}`,
      userId: mockUsers[(i % 7) + 1].id,
      imageId: `img-${String(i + 1).padStart(4, '0')}`,
      imageUrl: `https://images.unsplash.com/photo-1559181567-c3190ca995b6?w=224&h=224&fit=crop`,
      grade,
      confidence: Math.min(99.9, confidence),
      probabilities: {
        normal: Math.min(99.9, baseNormal),
        immature: Math.min(99.9, baseImmature),
        mature: Math.min(99.9, baseMature),
      },
      age: 45 + Math.floor(Math.random() * 30),
      sex: sexes[Math.floor(Math.random() * sexes.length)],
      eyeSide: eyeSides[Math.floor(Math.random() * eyeSides.length)],
      notes: i % 3 === 0 ? 'Routine check-up' : undefined,
      preprocessingSteps: [
        'Resized to 224×224',
        'CLAHE contrast enhancement applied',
        'Pixel values normalized to [0, 1]',
        'Batch dimension added',
      ],
      modelVersion: 'resnet50_v1',
      processingTime: 1.5 + Math.random() * 1.5,
      createdAt: date.toISOString(),
    });
  }

  return predictions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

let mockPredictions = generateMockPredictions();

let mockModelVersions: ModelVersion[] = [
  {
    id: 'mv-1',
    name: 'resnet50_v1',
    accuracy: 91.2,
    sensitivity: 93.4,
    specificity: 88.9,
    auc: 0.961,
    deployedAt: '2026-03-01T00:00:00Z',
    status: 'Active',
  },
  {
    id: 'mv-0',
    name: 'resnet50_v0',
    accuracy: 84.7,
    sensitivity: 86.2,
    specificity: 81.5,
    auc: 0.921,
    deployedAt: '2026-01-15T00:00:00Z',
    status: 'Inactive',
  },
];

const generateDailyUploads = () => {
  const uploads: { date: string; count: number }[] = [];
  const now = new Date();

  for (let i = 29; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    uploads.push({
      date: date.toISOString().split('T')[0],
      count: 5 + Math.floor(Math.random() * 20),
    });
  }

  return uploads;
};

// Simulated JWT tokens
const generateTokens = (email: string) => ({
  accessToken: `mock_access_${btoa(email)}_${Date.now()}`,
  refreshToken: `mock_refresh_${btoa(email)}_${Date.now()}`,
});

// Mock API implementation
export const mockApi = {
  auth: {
    login: async (email: string, password: string) => {
      await delay(800);

      // Check for admin login
      if (email === 'admin@cataractai.com' && password === 'Admin1234!') {
        const user = mockUsers.find(u => u.email === email)!;
        return { success: true, data: { user, tokens: generateTokens(email) }, message: 'Login successful' };
      }

      // Check for existing user
      const existingUser = mockUsers.find(u => u.email === email);
      if (existingUser) {
        return { success: true, data: { user: existingUser, tokens: generateTokens(email) }, message: 'Login successful' };
      }

      // Create new user if not exists
      const newUser: User = {
        id: `user-${Date.now()}`,
        email,
        fullName: email.split('@')[0],
        role: 'patient',
        createdAt: new Date().toISOString(),
        status: 'Active',
      };
      mockUsers.push(newUser);
      return { success: true, data: { user: newUser, tokens: generateTokens(email) }, message: 'Login successful' };
    },

    register: async (data: {
      fullName: string;
      email: string;
      password: string;
      age?: number;
      sex?: string;
      role?: string;
    }) => {
      await delay(1000);

      if (mockUsers.some(u => u.email === data.email)) {
        return { success: false, message: 'Email already registered' };
      }

      const newUser: User = {
        id: `user-${Date.now()}`,
        email: data.email,
        fullName: data.fullName,
        role: (data.role as 'patient' | 'doctor') || 'patient',
        age: data.age,
        sex: data.sex as 'Male' | 'Female' | 'Prefer not to say',
        createdAt: new Date().toISOString(),
        status: 'Active',
      };
      mockUsers.push(newUser);

      return {
        success: true,
        data: { user: newUser, tokens: generateTokens(data.email) },
        message: 'Registration successful'
      };
    },

    changePassword: async () => {
      await delay(600);
      return { success: true, message: 'Password changed successfully' };
    },
  },

  images: {
    upload: async (file: File): Promise<{ success: boolean; data?: ImageUpload; message: string }> => {
      await delay(1200);

      const imageId = `img-${Date.now()}`;
      const image: ImageUpload = {
        id: imageId,
        userId: 'current-user',
        filename: file.name,
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
        storageUrl: URL.createObjectURL(file),
        createdAt: new Date().toISOString(),
      };

      return { success: true, data: image, message: 'Image uploaded successfully' };
    },
  },

  predictions: {
    predict: async (imageId: string, age?: number, sex?: string, eyeSide?: string, notes?: string) => {
      await delay(2000); // Simulate model inference time

      const random = Math.random();
      let grade: Grade;
      if (random < 0.40) grade = 'Normal';
      else if (random < 0.75) grade = 'Immature Cataract';
      else grade = 'Mature Cataract';

      const confidence = grade === 'Normal'
        ? 88 + Math.random() * 10
        : grade === 'Immature Cataract'
        ? 82 + Math.random() * 14
        : 91 + Math.random() * 8;

      const prediction: Prediction = {
        id: `pred-${Date.now()}`,
        userId: 'current-user',
        imageId,
        imageUrl: `https://images.unsplash.com/photo-1559181567-c3190ca995b6?w=224&h=224&fit=crop`,
        grade,
        confidence: Math.min(99.9, confidence),
        probabilities: {
          normal: grade === 'Normal' ? confidence : 5.2 + Math.random() * 10,
          immature: grade === 'Immature Cataract' ? confidence : 3.1 + Math.random() * 8,
          mature: grade === 'Mature Cataract' ? confidence : 1.4 + Math.random() * 5,
        },
        age,
        sex: sex as 'Male' | 'Female' | 'Prefer not to say',
        eyeSide: eyeSide as 'Left' | 'Right' | 'Not specified',
        notes,
        preprocessingSteps: [
          'Resized to 224×224',
          'CLAHE contrast enhancement applied',
          'Pixel values normalized to [0, 1]',
          'Batch dimension added',
        ],
        modelVersion: 'resnet50_v1',
        processingTime: 1.5 + Math.random() * 1.5,
        createdAt: new Date().toISOString(),
      };

      mockPredictions.unshift(prediction);

      return { success: true, data: prediction, message: 'Prediction completed' };
    },

    getHistory: async (params?: { page?: number; limit?: number; grade?: string; startDate?: string; endDate?: string }) => {
      await delay(500);

      let filtered = [...mockPredictions];

      if (params?.grade && params.grade !== 'All') {
        filtered = filtered.filter(p => p.grade === params.grade);
      }

      if (params?.startDate) {
        filtered = filtered.filter(p => new Date(p.createdAt) >= new Date(params.startDate!));
      }

      if (params?.endDate) {
        filtered = filtered.filter(p => new Date(p.createdAt) <= new Date(params.endDate!));
      }

      const page = params?.page || 1;
      const limit = params?.limit || 10;
      const start = (page - 1) * limit;
      const paginated = filtered.slice(start, start + limit);

      return {
        success: true,
        data: {
          predictions: paginated,
          total: filtered.length,
          page,
          totalPages: Math.ceil(filtered.length / limit),
        },
        message: 'History retrieved',
      };
    },

    getById: async (id: string) => {
      await delay(300);
      const prediction = mockPredictions.find(p => p.id === id);
      if (!prediction) {
        return { success: false, message: 'Prediction not found' };
      }
      return { success: true, data: prediction, message: 'Prediction found' };
    },

    delete: async (id: string) => {
      await delay(400);
      mockPredictions = mockPredictions.filter(p => p.id !== id);
      return { success: true, message: 'Prediction deleted' };
    },
  },

  users: {
    getProfile: async () => {
      await delay(300);
      // Return current user from store or default
      return { success: true, data: mockUsers[0], message: 'Profile retrieved' };
    },

    updateProfile: async (data: { fullName?: string; age?: number; sex?: string }) => {
      await delay(500);
      return { success: true, data: { ...mockUsers[0], ...data }, message: 'Profile updated' };
    },

    getStats: async () => {
      await delay(300);
      const userPredictions = mockPredictions.filter(p => p.userId === 'current-user' || mockUsers.indexOf(mockUsers[0]) === 0);
      return {
        success: true,
        data: {
          totalScans: userPredictions.length,
          lastScan: userPredictions[0]?.createdAt || null,
        },
        message: 'Stats retrieved',
      };
    },
  },

  admin: {
    getUsers: async (params?: { page?: number; limit?: number; role?: string; status?: string; search?: string }) => {
      await delay(600);

      let filtered = [...mockUsers];

      if (params?.role && params.role !== 'All') {
        filtered = filtered.filter(u => u.role === params.role!.toLowerCase());
      }

      if (params?.status && params.status !== 'All') {
        filtered = filtered.filter(u => u.status === params.status);
      }

      if (params?.search) {
        const search = params.search.toLowerCase();
        filtered = filtered.filter(u =>
          u.fullName.toLowerCase().includes(search) ||
          u.email.toLowerCase().includes(search)
        );
      }

      const page = params?.page || 1;
      const limit = params?.limit || 20;
      const start = (page - 1) * limit;
      const paginated = filtered.slice(start, start + limit);

      return {
        success: true,
        data: {
          users: paginated,
          total: filtered.length,
          page,
          totalPages: Math.ceil(filtered.length / limit),
        },
        message: 'Users retrieved',
      };
    },

    updateUser: async (id: string, data: { role?: string; status?: string }) => {
      await delay(500);
      const userIndex = mockUsers.findIndex(u => u.id === id);
      if (userIndex === -1) {
        return { success: false, message: 'User not found' };
      }
      mockUsers[userIndex] = { ...mockUsers[userIndex], ...data };
      return { success: true, data: mockUsers[userIndex], message: 'User updated' };
    },

    getUserStats: async () => {
      await delay(400);
      return {
        success: true,
        data: {
          total: mockUsers.length,
          active: mockUsers.filter(u => u.status === 'Active').length,
          doctors: mockUsers.filter(u => u.role === 'doctor').length,
          patients: mockUsers.filter(u => u.role === 'patient').length,
        },
        message: 'Stats retrieved',
      };
    },
  },

  analytics: {
    getPerformance: async () => {
      await delay(400);
      return {
        success: true,
        data: {
          accuracy: 91.2,
          sensitivity: 93.4,
          specificity: 88.9,
          auc: 0.961,
        },
        message: 'Performance data retrieved',
      };
    },

    getUsage: async (): Promise<{ success: boolean; data?: AnalyticsData; message: string }> => {
      await delay(500);

      const now = new Date();
      const thisMonthPredictions = mockPredictions.filter(p => {
        const predDate = new Date(p.createdAt);
        return predDate.getMonth() === now.getMonth() && predDate.getFullYear() === now.getFullYear();
      });

      return {
        success: true,
        data: {
          totalAnalyses: mockPredictions.length,
          thisMonth: thisMonthPredictions.length,
          avgConfidence: 87.3,
          avgProcessingTime: 1.8,
          dailyUploads: generateDailyUploads(),
          gradeDistribution: [
            { grade: 'Normal', percentage: 42 },
            { grade: 'Immature Cataract', percentage: 31 },
            { grade: 'Mature Cataract', percentage: 27 },
          ],
          demographicBreakdown: {
            ageGroups: [
              { group: '18-30', count: 45 },
              { group: '31-45', count: 187 },
              { group: '46-60', count: 423 },
              { group: '61-75', count: 398 },
              { group: '75+', count: 194 },
            ],
            sexDistribution: { male: 54, female: 46 },
          },
        },
        message: 'Usage data retrieved',
      };
    },

    getModelVersions: async () => {
      await delay(300);
      return { success: true, data: mockModelVersions, message: 'Model versions retrieved' };
    },

    activateModel: async (versionId: string) => {
      await delay(800);
      mockModelVersions = mockModelVersions.map(v => ({
        ...v,
        status: v.id === versionId ? 'Active' : 'Inactive',
      }));
      return { success: true, message: 'Model activated' };
    },

    getAuditLogs: async () => {
      await delay(400);
      const logs: AuditLog[] = [
        { id: 'log-10', event: 'Prediction made', userEmail: 'john.doe@gmail.com', timestamp: new Date().toISOString() },
        { id: 'log-9', event: 'Image uploaded', userEmail: 'jane.smith@yahoo.com', timestamp: new Date(Date.now() - 3600000).toISOString() },
        { id: 'log-8', event: 'User registered', userEmail: 'new.user@email.com', timestamp: new Date(Date.now() - 7200000).toISOString() },
        { id: 'log-7', event: 'Prediction made', userEmail: 'dr.sarah.wilson@hospital.com', timestamp: new Date(Date.now() - 10800000).toISOString() },
        { id: 'log-6', event: 'Model activated', userEmail: 'admin@cataractai.com', timestamp: new Date(Date.now() - 86400000).toISOString() },
        { id: 'log-5', event: 'Image uploaded', userEmail: 'patient.emma@outlook.com', timestamp: new Date(Date.now() - 172800000).toISOString() },
        { id: 'log-4', event: 'Prediction made', userEmail: 'robert.brown@email.com', timestamp: new Date(Date.now() - 259200000).toISOString() },
        { id: 'log-3', event: 'User updated', userEmail: 'admin@cataractai.com', timestamp: new Date(Date.now() - 345600000).toISOString() },
        { id: 'log-2', event: 'User registered', userEmail: 'lisa.johnson@gmail.com', timestamp: new Date(Date.now() - 432000000).toISOString() },
        { id: 'log-1', event: 'Prediction made', userEmail: 'john.doe@gmail.com', timestamp: new Date(Date.now() - 518400000).toISOString() },
      ];
      return { success: true, data: logs, message: 'Audit logs retrieved' };
    },
  },
};

export default mockApi;
