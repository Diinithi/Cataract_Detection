import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Eye, X, CheckCircle, AlertCircle, Brain } from 'lucide-react';
import toast from 'react-hot-toast';
import { imageAPI, predictionAPI } from '../../api/client';
import { Navbar } from '../../components/layout/Navbar';
import { LoadingSpinner } from '../../components/shared';

type EyeSide = 'Left' | 'Right' | 'Not specified';
type Sex = 'Male' | 'Female' | 'Prefer not to say';

interface PreprocessingStep {
  label: string;
  completed: boolean;
}

const initialPreprocessingSteps: PreprocessingStep[] = [
  { label: 'Image loaded', completed: false },
  { label: 'Resizing to 224x224', completed: false },
  { label: 'CLAHE contrast enhancement', completed: false },
  { label: 'Normalising pixel values', completed: false },
  { label: 'Ready for analysis', completed: false },
];

export const UploadPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [preprocessingSteps, setPreprocessingSteps] = useState<PreprocessingStep[]>(initialPreprocessingSteps);
  const [showPreprocessing, setShowPreprocessing] = useState(false);

  // Form state
  const [age, setAge] = useState('');
  const [sex, setSex] = useState<Sex>('Prefer not to say');
  const [eyeSide, setEyeSide] = useState<EyeSide>('Not specified');
  const [notes, setNotes] = useState('');

  const validateFile = (file: File): boolean => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a JPG or PNG image');
      return false;
    }

    if (file.size > maxSize) {
      toast.error('Image must be smaller than 5MB');
      return false;
    }

    return true;
  };

  const handleFileSelect = useCallback((file: File) => {
    if (!validateFile(file)) return;

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setPreprocessingSteps(initialPreprocessingSteps);
    setShowPreprocessing(true);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const removeImage = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setShowPreprocessing(false);
    setPreprocessingSteps(initialPreprocessingSteps);
  };

  // Animate preprocessing steps when image is selected
  useEffect(() => {
    if (showPreprocessing && previewUrl) {
      const animateSteps = async () => {
        for (let i = 0; i < preprocessingSteps.length; i++) {
          await new Promise(resolve => setTimeout(resolve, 500));
          setPreprocessingSteps(prev => {
            const newSteps = [...prev];
            newSteps[i] = { ...newSteps[i], completed: true };
            return newSteps;
          });
        }
      };
      animateSteps();
    }
  }, [showPreprocessing, previewUrl]);

  const handleAnalyze = async () => {
    if (!selectedFile) {
      toast.error('Please select an image first');
      return;
    }

    setIsAnalyzing(true);

    try {
      // Upload image
      const uploadResponse = await imageAPI.upload(selectedFile);

      if (!uploadResponse.success || !uploadResponse.data) {
        throw new Error(uploadResponse.message || 'Upload failed');
      }

      // Get prediction
      const predictionResponse = await predictionAPI.predict(
        uploadResponse.data.id,
        age ? parseInt(age) : undefined,
        sex !== 'Prefer not to say' ? sex : undefined,
        eyeSide !== 'Not specified' ? eyeSide : undefined,
        notes || undefined
      );

      if (!predictionResponse.success || !predictionResponse.data) {
        throw new Error(predictionResponse.message || 'Prediction failed');
      }

      toast.success('Analysis complete!');
      navigate(`/results/${predictionResponse.data.id}`);
    } catch (error: any) {
      toast.error(error.message || 'Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Full-page loading overlay */}
      {isAnalyzing && (
        <div className="fixed inset-0 bg-white/95 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="text-center">
            <Brain className="h-16 w-16 text-primary-500 mx-auto mb-4 animate-pulse" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Analyzing your eye image...</h2>
            <p className="text-gray-600 mb-6">Running ResNet50 inference</p>
            <div className="flex items-center justify-center gap-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="h-2 w-2 bg-primary-500 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Upload Eye Image</h1>
          <p className="text-gray-600 mt-1">Upload a clear digital eye image for cataract detection</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Upload Area */}
          <div className="space-y-6">
            <div
              className={`relative drop-zone ${isDragging ? 'active' : ''} ${previewUrl ? 'p-0 overflow-hidden' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {previewUrl ? (
                <div className="relative">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-80 object-cover rounded-xl"
                  />
                  <button
                    onClick={removeImage}
                    className="absolute top-3 right-3 bg-white/90 hover:bg-white text-gray-700 p-2 rounded-full shadow-lg transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    onChange={handleInputChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-700 mb-1">
                    Drag & drop your eye image here
                  </p>
                  <p className="text-gray-500">or click to browse</p>
                  <p className="text-xs text-gray-400 mt-4">
                    Accepted: JPG, PNG | Max: 5MB
                  </p>
                </>
              )}
            </div>

            {selectedFile && (
              <div className="bg-white rounded-xl p-4 border border-gray-100 animate-slide-up">
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{selectedFile.name}</p>
                    <p className="text-gray-500">{formatFileSize(selectedFile.size)}</p>
                  </div>
                  <span className="px-2 py-1 bg-success-100 text-success-700 rounded text-xs font-medium">
                    {selectedFile.type.split('/')[1].toUpperCase()}
                  </span>
                </div>
              </div>
            )}

            {/* Preprocessing checklist */}
            {showPreprocessing && (
              <div className="bg-white rounded-xl p-6 border border-gray-100 animate-slide-up">
                <h3 className="font-medium text-gray-900 mb-4">Image Preprocessing</h3>
                <div className="space-y-3">
                  {preprocessingSteps.map((step, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-3 transition-all duration-300 ${
                        step.completed ? 'opacity-100' : 'opacity-40'
                      }`}
                    >
                      <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                        step.completed ? 'bg-success-500' : 'bg-gray-200'
                      }`}>
                        {step.completed && <CheckCircle className="h-4 w-4 text-white" />}
                      </div>
                      <span className={`text-sm ${step.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                        {step.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Patient Details Form */}
          <div className="bg-white rounded-2xl border border-gray-100 p-8 h-fit">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Patient Details</h2>
            <p className="text-gray-600 text-sm mb-6">(Optional but improves accuracy)</p>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Enter age"
                  min="1"
                  max="120"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sex</label>
                <select
                  value={sex}
                  onChange={(e) => setSex(e.target.value as Sex)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Eye Side</label>
                <div className="flex gap-3">
                  {(['Left', 'Right', 'Not specified'] as EyeSide[]).map((side) => (
                    <button
                      key={side}
                      type="button"
                      onClick={() => setEyeSide(side)}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border transition-all ${
                        eyeSide === side
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      <Eye className="h-4 w-4" />
                      {side}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                  <span className="text-gray-400 font-normal"> (optional)</span>
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value.slice(0, 200))}
                  placeholder="Any additional notes..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 resize-none"
                />
                <p className="text-xs text-gray-400 mt-1 text-right">{notes.length}/200</p>
              </div>

              <button
                onClick={handleAnalyze}
                disabled={!selectedFile || isAnalyzing}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2 ${
                  selectedFile && !isAnalyzing
                    ? 'bg-primary-500 hover:bg-primary-600 text-white shadow-lg hover:shadow-xl btn-hover-lift'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Brain className="h-5 w-5" />
                {isAnalyzing ? 'Analyzing...' : 'Analyse Image'}
              </button>

              <p className="text-xs text-gray-500 text-center">
                Processing takes ~2-5 seconds | Your data is encrypted and private
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UploadPage;
