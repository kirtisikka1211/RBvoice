import React, { useState, useEffect } from 'react';
import { 
  Mic, 
  MicOff, 
  Bot, 
  Clock, 
  CheckCircle, 
  Volume2 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface InterviewQuestion {
  id: number;
  question: string;
  answer?: string;
  duration?: number;
}

interface InterviewPageProps {
  userEmail: string;
  onComplete: (script: any) => void;
}

const mockQuestions: InterviewQuestion[] = [
  { id: 1, question: "Tell me about yourself and your professional background." },
  { id: 2, question: "What interests you most about this position and our company?" },
  { id: 3, question: "Describe a challenging project you've worked on recently and how you overcame obstacles." },
  { id: 4, question: "How do you handle working under pressure and tight deadlines?" },
  { id: 5, question: "Where do you see yourself professionally in the next 3-5 years?" }
];

const InterviewPage: React.FC<InterviewPageProps> = ({ userEmail, onComplete }) => {
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [interviewDuration, setInterviewDuration] = useState(0);
  const [currentQuestionText, setCurrentQuestionText] = useState(mockQuestions[0].question);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setInterviewDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  const nextQuestion = () => {
    if (currentQuestion < mockQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setCurrentQuestionText(mockQuestions[currentQuestion + 1].question);
    } else {
      completeInterview();
    }
  };

  const completeInterview = () => {
    setIsRecording(false);
    
    // Generate mock interview script
    const script = {
      questions: mockQuestions.map((q, index) => ({
        ...q,
        answer: `This is a mock answer for question ${index + 1}. In a real implementation, this would contain the candidate's actual response recorded during the interview.`,
        duration: Math.floor(Math.random() * 120) + 30 // Random duration between 30-150 seconds
      })),
      totalDuration: interviewDuration,
      feedback: "Strong communication skills demonstrated throughout the interview. Good technical knowledge and problem-solving approach. Consider highlighting specific examples of leadership experience in future interviews.",
      timestamp: new Date().toLocaleString()
    };
    
    onComplete(script);
    navigate('/interview/completed');
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Interview Panel */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Bot size={16} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">AI Interviewer</h3>
                  <p className="text-xs text-gray-500">
                    {isRecording ? 'Speaking...' : 'Paused'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <Clock size={14} className="text-gray-400" />
                <span className="text-xs text-gray-600">{formatTime(interviewDuration)}</span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex items-start space-x-2">
                <Volume2 size={16} className="text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900 mb-1">
                    Question {currentQuestion + 1} of {mockQuestions.length}
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {currentQuestionText}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-3">
              <button
                onClick={toggleRecording}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                  isRecording 
                    ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
                }`}
              >
                {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
              </button>
              
              <button
                onClick={nextQuestion}
                className="px-4 py-2 bg-[#2B5EA1] hover:bg-[#244E85] text-white rounded-lg font-medium transition-colors text-sm"
              >
                {currentQuestion < mockQuestions.length - 1 ? 'Next Question' : 'Complete Interview'}
              </button>
            </div>
          </div>
        </div>

        {/* Progress Panel */}
        <div className="space-y-3">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
            <h4 className="font-medium text-gray-900 mb-2">Progress</h4>
            <div className="space-y-2">
              {mockQuestions.map((_, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                    index < currentQuestion ? 'bg-green-100 text-green-600' :
                    index === currentQuestion ? 'bg-blue-100 text-blue-600' :
                    'bg-gray-100 text-gray-400'
                  }`}>
                    {index < currentQuestion ? <CheckCircle size={12} /> : index + 1}
                  </div>
                  <span className={`text-xs ${
                    index <= currentQuestion ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                    Question {index + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
            <h4 className="font-medium text-gray-900 mb-2">Interview Stats</h4>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">Duration</span>
                <span className="text-gray-900 font-medium">{formatTime(interviewDuration)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">Questions</span>
                <span className="text-gray-900 font-medium">{currentQuestion + 1}/{mockQuestions.length}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">Status</span>
                <span className={`font-medium ${
                  isRecording ? 'text-green-600' : 'text-yellow-600'
                }`}>
                  {isRecording ? 'Recording' : 'Paused'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewPage;
