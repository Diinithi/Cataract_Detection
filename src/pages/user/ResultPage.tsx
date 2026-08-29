import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Download, ArrowRight, Eye, AlertTriangle, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { Badge, ConfidenceBar, LoadingSpinner } from '../../components/shared';
import { Navbar } from '../../components/layout/Navbar';
import { mockApi } from '../../api/mockService';
import { Prediction, Grade } from '../../types';

const gradeConfig: Record<Grade, {
  bgGradient: string;
  borderColor: string;
  textColor: string;
  recommendation: string;
}> = {
  'Normal': {
    bgGradient: 'from-success-50 to-success-100',
    borderColor: 'border-success-200',
    textColor: 'text-success-700',
    recommendation: 'No cataract detected. Continue routine eye check-ups annually. Consult an ophthalmologist if you notice changes in vision.',
  },
  'Immature Cataract': {
    bgGradient: 'from-warning-50 to-warning-100',
    borderColor: 'border-warning-200',
    textColor: 'text-warning-700',
    recommendation: 'Early-stage cataract detected. Schedule a consultation with an ophthalmologist within 3-6 months. Monitor for changes in vision clarity.',
  },
  'Mature Cataract': {
    bgGradient: 'from-danger-50 to-danger-100',
    borderColor: 'border-danger-200',
    textColor: 'text-danger-700',
    recommendation: 'Advanced cataract detected. Immediate referral to an ophthalmologist is strongly recommended. Surgical intervention may be required.',
  },
};

export const ResultPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [animatedBars, setAnimatedBars] = useState(false);

  useEffect(() => {
    const fetchPrediction = async () => {
      if (!id) return;

      try {
        const response = await predictionAPI.getById(id);
        if (response.success && response.data) {
          setPrediction(response.data);
          // Trigger bar animation after a short delay
          setTimeout(() => setAnimatedBars(true), 300);
        } else {
          toast.error('Prediction not found');
          navigate('/history');
        }
      } catch (error) {
        toast.error('Failed to load prediction');
        navigate('/history');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrediction();
  }, [id, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <LoadingSpinner fullPage text="Loading prediction results..." />
      </div>
    );
  }

  if (!prediction) {
    return null;
  }

  const config = gradeConfig[prediction.grade];

  const handleDownloadPdf = () => {
    toast.success('PDF report generated successfully!');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Card - Hero Section */}
        <div className={`bg-gradient-to-br ${config.bgGradient} rounded-3xl border ${config.borderColor} p-8 mb-8 animate-fade-in`}>
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Image */}
            <div className="flex-shrink-0">
              <div className="relative">
                <img
                  src={prediction.imageUrl}
                  alt="Eye scan"
                  className="w-48 h-48 object-cover rounded-2xl shadow-lg border-4 border-white"
                />
                <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg">
                  <Eye className="h-6 w-6 text-gray-600" />
                </div>
              </div>
            </div>

            {/* Result */}
            <div className="flex-1 text-center md:text-left">
              <div className="mb-4">
                <Badge grade={prediction.grade} size="lg" className={`${config.textColor} text-lg`} />
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start mb-4">
                <div className="text-4xl font-bold text-gray-900">
                  {prediction.confidence.toFixed(1)}%
                </div>
                <div className="text-gray-600">confidence score</div>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 justify-center md:justify-start">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>{format(new Date(prediction.createdAt), 'PPp')}</span>
                </div>
                <div className="px-3 py-1 bg-white/50 rounded-full">
                  Model: {prediction.modelVersion}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Section - Two Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Probability Breakdown Card */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 animate-slide-up animation-delay-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Probability Breakdown</h3>
            <div className="space-y-6">
              {/* Normal */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Normal</span>
                  <span className={`text-sm font-semibold ${animatedBars ? 'text-success-600' : 'text-gray-400'}`}>
                    {animatedBars ? prediction.probabilities.normal.toFixed(1) : '0.0'}%
                  </span>
                </div>
                <div className="h-4 bg-success-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-success-500 rounded-full transition-all ease-out duration-1000"
                    style={{ width: animatedBars ? `${prediction.probabilities.normal}%` : '0%' }}
                  />
                </div>
              </div>

              {/* Immature Cataract */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Immature Cataract</span>
                  <span className={`text-sm font-semibold ${animatedBars ? 'text-warning-600' : 'text-gray-400'}`}>
                    {animatedBars ? prediction.probabilities.immature.toFixed(1) : '0.0'}%
                  </span>
                </div>
                <div className="h-4 bg-warning-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-warning-500 rounded-full transition-all ease-out duration-1000"
                    style={{ width: animatedBars ? `${prediction.probabilities.immature}%` : '0%' }}
                  />
                </div>
              </div>

              {/* Mature Cataract */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Mature Cataract</span>
                  <span className={`text-sm font-semibold ${animatedBars ? 'text-danger-600' : 'text-gray-400'}`}>
                    {animatedBars ? prediction.probabilities.mature.toFixed(1) : '0.0'}%
                  </span>
                </div>
                <div className="h-4 bg-danger-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-danger-500 rounded-full transition-all ease-out duration-1000"
                    style={{ width: animatedBars ? `${prediction.probabilities.mature}%` : '0%' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Clinical Recommendation Card */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 animate-slide-up animation-delay-300">
            <div className="flex items-start gap-3 mb-4">
              {prediction.grade === 'Normal' ? (
                <CheckCircle className="h-6 w-6 text-success-500 flex-shrink-0" />
              ) : prediction.grade === 'Immature Cataract' ? (
                <AlertTriangle className="h-6 w-6 text-warning-500 flex-shrink-0" />
              ) : (
                <AlertCircle className="h-6 w-6 text-danger-500 flex-shrink-0" />
              )}
              <h3 className="text-lg font-semibold text-gray-900">Clinical Recommendation</h3>
            </div>
            <p className="text-gray-700 leading-relaxed mb-6">
              {config.recommendation}
            </p>
            <div className="bg-gray-50 rounded-xl p-4 text-xs text-gray-500">
              <strong>Disclaimer:</strong> This is an AI-generated screening result. It is not a medical diagnosis. Always consult a qualified ophthalmologist for proper evaluation and treatment.
            </div>
          </div>
        </div>

        {/* Patient Details Summary */}
        {(prediction.age || prediction.sex || prediction.eyeSide) && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8 animate-slide-up animation-delay-400">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Analysis Details</h3>
            <div className="grid sm:grid-cols-4 gap-4">
              {prediction.age && (
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <p className="text-2xl font-bold text-gray-900">{prediction.age}</p>
                  <p className="text-sm text-gray-600">Age</p>
                </div>
              )}
              {prediction.sex && (
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <p className="text-2xl font-bold text-gray-900">{prediction.sex}</p>
                  <p className="text-sm text-gray-600">Sex</p>
                </div>
              )}
              {prediction.eyeSide && (
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <p className="text-2xl font-bold text-gray-900">{prediction.eyeSide}</p>
                  <p className="text-sm text-gray-600">Eye Side</p>
                </div>
              )}
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <p className="text-2xl font-bold text-gray-900">{prediction.processingTime.toFixed(1)}s</p>
                <p className="text-sm text-gray-600">Processing Time</p>
              </div>
            </div>
          </div>
        )}

        {/* Preprocessing Applied */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8 animate-slide-up animation-delay-500">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Image Preprocessing Applied</h3>
          <div className="flex flex-wrap gap-3">
            {prediction.preprocessingSteps.map((step, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-primary-50 text-primary-700 rounded-full text-sm font-medium"
              >
                {step}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up animation-delay-600">
          <button
            onClick={handleDownloadPdf}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-white border border-gray-200 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
          >
            <Download className="h-5 w-5" />
            Download PDF Report
          </button>
          <button
            onClick={() => navigate('/upload')}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-primary-500 rounded-xl text-white font-semibold hover:bg-primary-600 transition-colors"
          >
            Analyse Another Image
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>

        <div className="text-center mt-6">
          <Link to="/history" className="text-primary-600 hover:text-primary-700 font-medium">
            View All History
          </Link>
        </div>
      </main>
    </div>
  );
};

export default ResultPage;
