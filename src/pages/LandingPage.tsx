import React from 'react';
import { Link } from 'react-router-dom';
import {
  Eye,
  Brain,
  BarChart3,
  Upload,
  Settings,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';

const features = [
  {
    icon: Upload,
    title: 'Upload Any Eye Image',
    description: 'No specialized equipment needed. Any clear digital photo works.',
  },
  {
    icon: Brain,
    title: 'ResNet50 Deep Learning',
    description: 'Transfer learning fine-tuned on 1,500+ labeled cataract images.',
  },
  {
    icon: BarChart3,
    title: 'Instant Severity Grading',
    description: 'Get Normal / Immature / Mature classification with confidence score.',
  },
];

const steps = [
  {
    number: '01',
    title: 'Upload your eye image',
    description: 'Drag and drop or select a clear digital eye image from your device.',
  },
  {
    number: '02',
    title: 'AI preprocesses and analyses',
    description: 'ResNet50 model processes and analyzes your image in seconds.',
  },
  {
    number: '03',
    title: 'Receive grading + recommendation',
    description: 'Get instant cataract severity grade with clinical recommendations.',
  },
];

const stats = [
  { value: '94M', label: 'People affected worldwide' },
  { value: '3', label: 'Severity grades' },
  { value: 'ResNet50', label: 'Architecture' },
  { value: 'OpenCV', label: 'Preprocessing' },
];

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative gradient-hero overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="hero-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="1" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hero-pattern)" />
          </svg>
        </div>

        {/* Decorative circles */}
        <div className="absolute top-20 right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-primary-300/20 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 animate-fade-in">
              AI-Powered{' '}
              <span className="text-primary-200">Cataract Detection</span>
            </h1>
            <p className="text-lg sm:text-xl text-white/90 mb-10 max-w-2xl mx-auto animate-slide-up animation-delay-200">
              Upload a digital eye image and receive instant severity grading — Normal, Immature, or Mature Cataract — powered by ResNet50 deep learning.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up animation-delay-300">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-primary-50 transition-all btn-hover-lift shadow-lg"
              >
                Get Started Free
                <ArrowRight className="h-5 w-5" />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center justify-center gap-2 bg-white/10 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/20 transition-colors border border-white/20"
              >
                Learn More
              </a>
            </div>
          </div>

          {/* Hero image/mockup */}
          <div className="mt-16 max-w-5xl mx-auto animate-slide-up animation-delay-400">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 shadow-2xl border border-white/20">
              <div className="bg-white rounded-xl overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-200">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-danger-400" />
                    <div className="w-3 h-3 rounded-full bg-warning-400" />
                    <div className="w-3 h-3 rounded-full bg-success-400" />
                  </div>
                  <span className="text-sm text-gray-500 ml-2">cataractai.com/analyze</span>
                </div>
                <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                      <Eye className="h-16 w-16 text-gray-400" />
                    </div>
                    <div className="flex flex-col justify-center space-y-4">
                      <div className="inline-block px-4 py-2 bg-danger-100 text-danger-700 rounded-lg text-sm font-medium w-fit">
                        Mature Cataract
                      </div>
                      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-danger-500 rounded-full" style={{ width: '94%' }} />
                      </div>
                      <p className="text-2xl font-bold text-gray-900">94.2% Confidence</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-20">
            <path d="M0 120L48 110C96 100 192 80 288 70C384 60 480 60 576 65C672 70 768 80 864 85C960 90 1056 90 1152 85C1248 80 1344 70 1392 65L1440 60V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0Z" fill="#F8F9FA"/>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Advanced AI for Early Detection
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our deep learning model provides accurate cataract screening in seconds, helping detect issues early.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 card-hover"
                >
                  <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mb-6">
                    <Icon className="h-7 w-7 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get your cataract screening in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-primary-200 to-primary-100" style={{ width: 'calc(100% - 4rem)', left: 'calc(50% + 4rem)' }} />
                )}
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-500 text-white text-2xl font-bold mb-6 shadow-lg">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-primary-100 text-sm sm:text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl p-10 sm:p-16 shadow-xl">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Start Your Free Screening Today
            </h2>
            <p className="text-primary-100 text-lg mb-8 max-w-xl mx-auto">
              Join healthcare professionals using AI-powered cataract detection for faster, more accurate screening.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-primary-50 transition-all btn-hover-lift shadow-lg"
            >
              Get Started
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-primary-500">
                <Eye className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl">
                Cataract<span className="text-primary-400">AI</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm text-center">
              CataractAI — Final Year Research Project | Sabaragamuwa University of Sri Lanka
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
