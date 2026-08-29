export type UserRole = 'patient' | 'doctor' | 'admin';
export type Grade = 'Normal' | 'Immature Cataract' | 'Mature Cataract';
export type EyeSide = 'Left' | 'Right' | 'Not specified';
export type Sex = 'Male' | 'Female' | 'Prefer not to say';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  age?: number;
  sex?: Sex;
  createdAt: string;
  lastLogin?: string;
  status: 'Active' | 'Inactive';
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  age?: number;
  sex?: Sex;
  role: UserRole;
}

export interface ImageUpload {
  id: string;
  userId: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  storageUrl: string;
  createdAt: string;
}

export interface Prediction {
  id: string;
  userId: string;
  imageId: string;
  imageUrl: string;
  grade: Grade;
  confidence: number;
  probabilities: {
    normal: number;
    immature: number;
    mature: number;
  };
  age?: number;
  sex?: Sex;
  eyeSide?: EyeSide;
  notes?: string;
  preprocessingSteps: string[];
  modelVersion: string;
  processingTime: number;
  createdAt: string;
}

export interface PredictionRequest {
  imageId: string;
  age?: number;
  sex?: Sex;
  eyeSide?: EyeSide;
  notes?: string;
}

export interface ModelVersion {
  id: string;
  name: string;
  accuracy: number;
  sensitivity: number;
  specificity: number;
  auc: number;
  deployedAt: string;
  status: 'Active' | 'Inactive';
}

export interface AnalyticsData {
  totalAnalyses: number;
  thisMonth: number;
  avgConfidence: number;
  avgProcessingTime: number;
  dailyUploads: { date: string; count: number }[];
  gradeDistribution: { grade: string; percentage: number }[];
  demographicBreakdown: {
    ageGroups: { group: string; count: number }[];
    sexDistribution: { male: number; female: number };
  };
}

export interface AuditLog {
  id: string;
  event: 'User registered' | 'Image uploaded' | 'Prediction made' | 'Model activated' | 'User updated';
  userEmail: string;
  timestamp: string;
  details?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message: string;
}
