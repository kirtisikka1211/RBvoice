import React, { useState, useEffect } from 'react';
import { 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  User,
  Bot,
  Volume2,
  Home,
  Edit3,
  Save,
  RotateCcw
} from 'lucide-react';
import Login from './Login';

interface InterviewQuestion {
  id: number;
  question: string;
  answer?: string;
  duration?: number;
}

interface InterviewScript {
  questions: InterviewQuestion[];
  totalDuration: number;
  feedback?: string;
  timestamp: string;
}

function App() {
  const [interviewStatus, setInterviewStatus] = useState<'login' | 'landing' | 'idle' | 'preparing' | 'active' | 'paused' | 'completed'>('login');
  const [isRecording, setIsRecording] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [interviewScript, setInterviewScript] = useState<InterviewScript | null>(null);
  const [interviewDuration, setInterviewDuration] = useState(0);
  const [currentQuestionText, setCurrentQuestionText] = useState('');
  const [isEditingTranscript, setIsEditingTranscript] = useState(false);
  const [editableScript, setEditableScript] = useState<InterviewScript | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const mockQuestions: InterviewQuestion[] = [
    { id: 1, question: "Tell me about yourself and your professional background." },
    { id: 2, question: "What interests you most about this position and our company?" },
    { id: 3, question: "Describe a challenging project you've worked on recently and how you overcame obstacles." },
    { id: 4, question: "How do you handle working under pressure and tight deadlines?" },
    { id: 5, question: "Where do you see yourself professionally in the next 3-5 years?" }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (interviewStatus === 'active') {
      interval = setInterval(() => {
        setInterviewDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [interviewStatus]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startInterview = () => {
    setInterviewStatus('idle');
    setCurrentQuestion(0);
    setInterviewDuration(0);
  };

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In a real app, you would validate credentials here
    if (email && password) {
      setUserEmail(email);
      setInterviewStatus('landing');
    }
    
    setIsLoading(false);
  };

  const beginInterview = () => {
    setInterviewStatus('preparing');
    setCurrentQuestion(0);
    setInterviewDuration(0);
    
    setTimeout(() => {
      setInterviewStatus('active');
      setIsRecording(true);
      setCurrentQuestionText(mockQuestions[0].question);
    }, 3000);
  };

  const nextQuestion = () => {
    if (currentQuestion < mockQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setCurrentQuestionText(mockQuestions[currentQuestion + 1].question);
    } else {
      completeInterview();
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    setInterviewStatus(isRecording ? 'paused' : 'active');
  };

  const completeInterview = () => {
    setIsRecording(false);
    setInterviewStatus('completed');
    
    // Generate mock interview script
    const script: InterviewScript = {
      questions: mockQuestions.map((q, index) => ({
        ...q,
        answer: `This is a mock answer for question ${index + 1}. In a real implementation, this would contain the candidate's actual response recorded during the interview.`,
        duration: Math.floor(Math.random() * 120) + 30 // Random duration between 30-150 seconds
      })),
      totalDuration: interviewDuration,
      feedback: "Strong communication skills demonstrated throughout the interview. Good technical knowledge and problem-solving approach. Consider highlighting specific examples of leadership experience in future interviews.",
      timestamp: new Date().toLocaleString()
    };
    
    setInterviewScript(script);
  };



  const resetInterview = () => {
    setInterviewStatus('login');
    setIsRecording(false);
    setCurrentQuestion(0);
    setInterviewDuration(0);
    setInterviewScript(null);
    setCurrentQuestionText('');
    setIsEditingTranscript(false);
    setEditableScript(null);
  };

  const handleLogout = () => {
    setInterviewStatus('login');
    setUserEmail('');
    setIsRecording(false);
    setCurrentQuestion(0);
    setInterviewDuration(0);
    setInterviewScript(null);
    setCurrentQuestionText('');
    setIsEditingTranscript(false);
    setEditableScript(null);
  };

  const startTranscriptEditing = () => {
    if (!interviewScript) return;
    setEditableScript(JSON.parse(JSON.stringify(interviewScript))); // Deep copy
    setIsEditingTranscript(true);
  };

  const saveTranscript = () => {
    if (!editableScript) return;
    setInterviewScript(editableScript);
    setIsEditingTranscript(false);
    setEditableScript(null);
  };

  const cancelEditing = () => {
    setIsEditingTranscript(false);
    setEditableScript(null);
  };

  const updateQuestionAnswer = (questionId: number, newAnswer: string) => {
    if (!editableScript) return;
    setEditableScript(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        questions: prev.questions.map(q => 
          q.id === questionId ? { ...q, answer: newAnswer } : q
        )
      };
    });
  };

  const updateFeedback = (newFeedback: string) => {
    if (!editableScript) return;
    setEditableScript(prev => {
      if (!prev) return prev;
      return { ...prev, feedback: newFeedback };
    });
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Hidden on login page */}
      {interviewStatus !== 'login' && (
        <div className="w-64 bg-slate-700 text-white flex flex-col">
          <div className="p-6 border-b border-slate-600">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center font-bold">
                R
              </div>
              <div>
              <h1 className="font-semibold">RBvoice</h1>
                {/* <p className="text-xs text-slate-400">AI-Based Platform</p> */} 
              </div>
            </div>
          </div>
          
          <nav className="flex-1 p-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-3 px-3 py-2 rounded bg-slate-600 text-white">
                <Home size={20} />
                <span>Interview</span>
              </div>
            </div>
          </nav>
          
          <div className="p-4 border-t border-slate-600">
            <div className="mb-4 p-3 bg-slate-600 rounded-lg">
              <div className="flex items-center space-x-3 mb-3">
                <User size={16} className="text-slate-300" />
                <span className="text-sm text-slate-300">Signed in as</span>
              </div>
              <div className="text-sm text-white font-medium mb-3">
                {userEmail || 'candidate@example.com'}
              </div>
              <button
                onClick={handleLogout}
                className="w-full text-xs text-slate-300 hover:text-white bg-slate-500 hover:bg-slate-400 px-3 py-2 rounded transition-colors"
              >
                Sign Out
              </button>
            </div>
            <div className="text-xs text-slate-400">
              RBvoice <br />
              Copyright © 2025
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={`flex-1 flex flex-col ${interviewStatus === 'login' ? 'w-full' : ''}`}>
        {/* Header - Hidden on login page */}
        {interviewStatus !== 'login' && (
          <div className="bg-white border-b border-gray-200 px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">Interview</h2>
                <p className="text-gray-600">Complete your interview with our AI assistant</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <User size={16} />
                  <span>Candidate Portal</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className={`flex-1 ${interviewStatus === 'login' ? 'p-0' : 'p-8'}`}>
          {interviewStatus === 'login' && (
            <Login onLogin={handleLogin} isLoading={isLoading} />
          )}

          {interviewStatus === 'landing' && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <div className="text-center">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Bot size={40} className="text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    Welcome to Your Interview!
                  </h3>
                  <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                    Please ensure your microphone is working and you're in a quiet environment. 
                    Click "Start Interview" to begin your AI-powered interview experience.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="text-center p-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Mic size={24} className="text-green-600" />
                      </div>
                      <h4 className="font-medium text-gray-900 mb-2">Voice Recognition</h4>
                      <p className="text-sm text-gray-600">Advanced AI listens and analyzes your responses</p>
                    </div>
                    <div className="text-center p-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Clock size={24} className="text-purple-600" />
                      </div>
                      <h4 className="font-medium text-gray-900 mb-2">15-20 Minutes</h4>
                      <p className="text-sm text-gray-600">Complete interview at your own pace</p>
                    </div>
                    <div className="text-center p-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <FileText size={24} className="text-blue-600" />
                      </div>
                      <h4 className="font-medium text-gray-900 mb-2">Instant Results</h4>
                      <p className="text-sm text-gray-600">Get detailed script and feedback immediately</p>
                    </div>
                  </div>

                  <button
                    onClick={startInterview}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 mx-auto"
                  >
                    <Bot size={20} />
                    <span>Start Interview</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {interviewStatus === 'idle' && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <div className="text-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Mic size={40} className="text-green-600" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    Ready to Begin Your Interview?
                  </h3>
                  <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                    You're all set! Click the button below to start your AI-powered interview. 
                    Make sure you're in a quiet environment and your microphone is working properly.
                  </p>
                  
                  <div className="bg-blue-50 rounded-lg p-6 mb-8 max-w-2xl mx-auto">
                    <h4 className="font-medium text-blue-900 mb-3">Quick Checklist:</h4>
                    <ul className="text-left text-blue-800 space-y-2">
                      <li className="flex items-center space-x-2">
                        <CheckCircle size={16} className="text-green-600" />
                        <span>Find a quiet, private location</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle size={16} className="text-green-600" />
                        <span>Test your microphone</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle size={16} className="text-green-600" />
                        <span>Have a glass of water ready</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle size={16} className="text-green-600" />
                        <span>Take a deep breath and relax</span>
                      </li>
                    </ul>
                  </div>

                  <button
                    onClick={beginInterview}
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 mx-auto"
                  >
                    <Mic size={20} />
                    <span>Begin Interview Now</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {interviewStatus === 'preparing' && (
            <div className="max-w-2xl mx-auto text-center">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                  <Bot size={32} className="text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Preparing Your Interview
                </h3>
                <p className="text-gray-600 mb-6">
                  Please ensure your microphone is working and you're in a quiet environment. 
                  The interview will begin shortly.
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{width: '66%'}}></div>
                </div>
              </div>
            </div>
          )}

          {(interviewStatus === 'active' || interviewStatus === 'paused') && (
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Interview Panel */}
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Bot size={20} className="text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">AI Interviewer</h3>
                          <p className="text-sm text-gray-500">
                            {interviewStatus === 'active' ? 'Speaking...' : 'Paused'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock size={16} className="text-gray-400" />
                        <span className="text-sm text-gray-600">{formatTime(interviewDuration)}</span>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6 mb-6">
                      <div className="flex items-start space-x-3">
                        <Volume2 size={20} className="text-blue-600 mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-900 mb-2">
                            Question {currentQuestion + 1} of {mockQuestions.length}
                          </p>
                          <p className="text-gray-700 leading-relaxed">
                            {currentQuestionText || mockQuestions[currentQuestion]?.question}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-center space-x-4">
                      <button
                        onClick={toggleRecording}
                        className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                          isRecording 
                            ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
                            : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
                        }`}
                      >
                        {isRecording ? <MicOff size={24} /> : <Mic size={24} />}
                      </button>
                      
                      <button
                        onClick={nextQuestion}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                      >
                        {currentQuestion < mockQuestions.length - 1 ? 'Next Question' : 'Complete Interview'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Progress Panel */}
                <div className="space-y-4">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Progress</h4>
                    <div className="space-y-3">
                      {mockQuestions.map((_, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                            index < currentQuestion ? 'bg-green-100 text-green-600' :
                            index === currentQuestion ? 'bg-blue-100 text-blue-600' :
                            'bg-gray-100 text-gray-400'
                          }`}>
                            {index < currentQuestion ? <CheckCircle size={16} /> : index + 1}
                          </div>
                          <span className={`text-sm ${
                            index <= currentQuestion ? 'text-gray-900' : 'text-gray-400'
                          }`}>
                            Question {index + 1}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Interview Stats</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Duration</span>
                        <span className="text-gray-900 font-medium">{formatTime(interviewDuration)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Questions</span>
                        <span className="text-gray-900 font-medium">{currentQuestion + 1}/{mockQuestions.length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Status</span>
                        <span className={`font-medium ${
                          interviewStatus === 'active' ? 'text-green-600' : 'text-yellow-600'
                        }`}>
                          {interviewStatus === 'active' ? 'Recording' : 'Paused'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {interviewStatus === 'completed' && interviewScript && !isEditingTranscript && (
            <div className="max-w-6xl mx-auto">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} className="text-green-600" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                    Interview Completed!
                  </h3>
                  <p className="text-gray-600">
                    Your interview script and AI feedback are ready for review.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-1">{formatTime(interviewScript.totalDuration)}</div>
                    <div className="text-sm text-blue-700">Total Duration</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600 mb-1">{interviewScript.questions.length}</div>
                    <div className="text-sm text-purple-700">Questions</div>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-orange-600 mb-1">
                      {Math.round(interviewScript.totalDuration / interviewScript.questions.length / 60 * 10) / 10}m
                    </div>
                    <div className="text-sm text-orange-700">Avg Response</div>
                  </div>
                </div>

                <div className="flex justify-center space-x-4 mb-8">
                  <button
                    onClick={startTranscriptEditing}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
                  >
                    <Edit3 size={20} />
                    <span>Edit Transcript</span>
                  </button>
                  <button
                    onClick={resetInterview}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
                  >
                    <RotateCcw size={20} />
                    <span>Take Another Interview</span>
                  </button>
                </div>
              </div>

              {/* Interview Script */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-2 mb-6">
                  <FileText size={24} className="text-blue-600" />
                  <h4 className="text-xl font-semibold text-gray-900">Interview Script</h4>
                </div>

                <div className="space-y-6">
                  {interviewScript.questions.map((q, index) => (
                    <div key={q.id} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                      <div className="flex items-start space-x-4">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-sm font-medium text-blue-600">Q{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <div className="mb-3">
                            <p className="text-sm font-medium text-gray-900 mb-1">{q.question}</p>
                            <p className="text-xs text-gray-500">Duration: {formatTime(q.duration || 0)}</p>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-gray-700 leading-relaxed">{q.answer}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* AI Feedback */}
                <div className="mt-8 bg-blue-50 rounded-lg p-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <Bot size={20} className="text-blue-600" />
                    <h5 className="font-semibold text-gray-900">AI Feedback</h5>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{interviewScript.feedback}</p>
                </div>
              </div>
            </div>
          )}

          {/* Transcript Editing Interface */}
          {isEditingTranscript && editableScript && (
            <div className="max-w-6xl mx-auto">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Edit3 size={32} className="text-yellow-600" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                    Edit Transcript
                  </h3>
                  <p className="text-gray-600">
                    Review and edit your interview transcript before finalizing.
                  </p>
                </div>

                <div className="flex justify-center space-x-4 mb-8">
                  <button
                    onClick={saveTranscript}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
                  >
                    <Save size={20} />
                    <span>Save Changes</span>
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
                  >
                    <RotateCcw size={20} />
                    <span>Cancel</span>
                  </button>
                </div>
              </div>

              {/* Editable Interview Script */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-2 mb-6">
                  <Edit3 size={24} className="text-yellow-600" />
                  <h4 className="text-xl font-semibold text-gray-900">Edit Interview Script</h4>
                </div>

                <div className="space-y-6">
                  {editableScript.questions.map((q, index) => (
                    <div key={q.id} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                      <div className="flex items-start space-x-4">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-sm font-medium text-blue-600">Q{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <div className="mb-3">
                            <p className="font-medium text-gray-900 mb-1">{q.question}</p>
                            <p className="text-xs text-gray-500">Duration: {formatTime(q.duration || 0)}</p>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Edit Answer:
                            </label>
                            <textarea
                              value={q.answer || ''}
                              onChange={(e) => updateQuestionAnswer(q.id, e.target.value)}
                              className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                              placeholder="Edit your answer here..."
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Editable AI Feedback */}
                <div className="mt-8 bg-blue-50 rounded-lg p-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <Bot size={20} className="text-blue-600" />
                    <h5 className="font-semibold text-gray-900">Edit AI Feedback</h5>
                  </div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Edit Feedback:
                  </label>
                  <textarea
                    value={editableScript.feedback || ''}
                    onChange={(e) => updateFeedback(e.target.value)}
                    className="w-full h-24 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    placeholder="Edit feedback here..."
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;