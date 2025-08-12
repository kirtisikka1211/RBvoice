import React from 'react';
import { Bot, Mic, Clock, FileText, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LandingPageProps {
  userEmail: string;
}

const LandingPage: React.FC<LandingPageProps> = ({ userEmail }) => {
  const navigate = useNavigate();

  const startInterview = () => {
    navigate('/interview/idle');
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bot size={32} className="text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            Welcome to Your Interview!
          </h3>
          <p className="text-sm text-gray-600 mb-6 max-w-xl mx-auto">
            Please ensure your microphone is working and you're in a quiet environment. 
            Click "Start Interview" to begin your AI-powered interview experience.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Mic size={20} className="text-blue-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-1">Voice Recognition</h4>
              <p className="text-xs text-gray-600">Advanced AI listens and analyzes your responses</p>
            </div>
            <div className="text-center p-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Clock size={20} className="text-blue-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-1">15-20 Minutes</h4>
              <p className="text-xs text-gray-600">Complete interview at your own pace</p>
            </div>
            <div className="text-center p-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <FileText size={20} className="text-blue-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-1">Review</h4>
              <p className="text-xs text-gray-600">Get detailed script</p>
            </div>
          </div>

          <button
            onClick={startInterview}
            className="bg-[#2B5EA1] hover:bg-[#244E85] text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 mx-auto"
          >
            <Bot size={16} />
            <span>Start Interview</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
