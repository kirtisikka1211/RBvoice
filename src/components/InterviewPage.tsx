import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Bot, 
  Clock, 
  CheckCircle, 
  Volume2,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  SkipForward,
  Settings,
  Wifi,
  WifiOff
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface InterviewQuestion {
  id: number;
  question: string;
  answer?: string;
  duration?: number;
}

interface ChatMessage {
  id: string;
  type: 'bot' | 'user' | 'system';
  content: string;
  timestamp: Date;
  status?: 'sending' | 'sent' | 'error';
}

interface InterviewPageProps {
  userEmail: string;
  onComplete: (script: any) => void;
  interviewType: 'pre-screen' | 'technical';
}

const mockQuestions: InterviewQuestion[] = [
  { id: 1, question: "Tell me about yourself and your professional background." },
  { id: 2, question: "What interests you most about this position and our company?" },
  { id: 3, question: "Describe a challenging project you've worked on recently and how you overcame obstacles." },
  { id: 4, question: "How do you handle working under pressure and tight deadlines?" },
  { id: 5, question: "Where do you see yourself professionally in the next 3-5 years?" }
];

// Exactly 5 mock answers mapped 1:1 to the 5 questions above
const mockAnswers: string[] = [
  "My name is John Doe. I have five years of experience as a full‑stack developer, working primarily with React and Node.js, and I enjoy building reliable products end‑to‑end.",
  "I'm excited about this role because it combines user impact with technical depth. Your product focus on accessibility and performance aligns with how I like to build software.",
  "Recently, I led a migration to a new authentication system under a tight deadline. I broke the project into phases, wrote automated tests, and coordinated with stakeholders to ensure a smooth rollout.",
  "I prioritize, communicate trade‑offs, and focus on incremental delivery. I set short timeboxes, remove blockers early, and keep the team aligned on the next most valuable step.",
  "I see myself as a senior engineer mentoring others, owning key domains, and continuing to ship user‑centric features while improving system reliability."
];

const getMockAnswer = (index: number): string => mockAnswers[index] ?? '';

const InterviewPage: React.FC<InterviewPageProps> = ({ userEmail, onComplete, interviewType }) => {
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected'>('connected');
  const [technicalTimeRemaining, setTechnicalTimeRemaining] = useState(1800); // 30 minutes in seconds
  const [showCompletePopup, setShowCompletePopup] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize with bot greeting based on interview type
    if (interviewType === 'technical') {
              setChatMessages([
          {
            id: '1',
            type: 'bot',
            content: "Welcome to the technical interview! You have 30 minutes to work on the problem. Good luck!",
            timestamp: new Date(),
            status: 'sent'
          }
        ]);
    } else {
      setChatMessages([
        {
          id: '1',
          type: 'bot',
          content: "Hello! I'm your AI interviewer. I'll be asking you a few questions to understand your background and experience. Click the microphone button to begin the first question.",
          timestamp: new Date(),
          status: 'sent'
        }
      ]);
    }

    let interval: NodeJS.Timeout;
    if (isRecording && interviewType === 'technical') {
      interval = setInterval(() => {
        setTechnicalTimeRemaining(prev => {
          if (prev <= 1) {
            // Time's up - auto complete technical interview
            completeTechnicalInterview();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording, interviewType]);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, liveTranscript]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleRecording = () => {
    if (!isRecording) {
      // Start recording and begin interview flow
      setIsRecording(true);
      
      if (interviewType === 'pre-screen') {
        // For pre-screen interview, start the automatic question flow
        let questionIndex = 0;
        
        // Function to show question and answer
        const showQuestionAndAnswer = (index: number) => {
          if (index >= mockQuestions.length) {
            // Interview is over, bot asks if candidate has questions
            setTimeout(() => {
              setChatMessages(prev => [...prev, {
                id: Date.now().toString() + 'interview-over',
                type: 'bot',
                content: "Great! That concludes our interview. Do you have any questions for me?",
                timestamp: new Date(),
                status: 'sent'
              }]);
              
              // Candidate says no after 2 seconds
              setTimeout(() => {
                setChatMessages(prev => [...prev, {
                  id: Date.now().toString() + 'candidate-no',
                  type: 'user',
                  content: "No, I don't have any questions. Thank you.",
                  timestamp: new Date(),
                  status: 'sent'
                }]);
                
                // Bot wishes good luck after 1 second
                setTimeout(() => {
                  setChatMessages(prev => [...prev, {
                    id: Date.now().toString() + 'bot-goodbye',
                    type: 'bot',
                    content: "Perfect! Thank you for your time. I wish you the best of luck with your application. Have a great day!",
                    timestamp: new Date(),
                    status: 'sent'
                  }]);
                  
                  // Show complete interview popup after 1 second
                  setTimeout(() => {
                    setShowCompletePopup(true);
                  }, 1000);
                }, 1000);
              }, 2000);
            }, 1000);
            return;
          }
          
          // Show question
          setChatMessages(prev => [...prev, {
            id: Date.now().toString() + index,
            type: 'bot',
            content: mockQuestions[index].question,
            timestamp: new Date(),
            status: 'sent'
          }]);
          
          // Update current question
          setCurrentQuestion(index);
          
          // Show answer after 2 seconds
          setTimeout(() => {
            const answer = getMockAnswer(index);
            
            // Save answer directly to chat (no live transcript needed)
            setChatMessages(prev => [...prev, {
              id: Date.now().toString() + index + 'answer',
              type: 'user',
              content: answer,
              timestamp: new Date(),
              status: 'sent'
            }]);
            
            // Show next question after 2 more seconds
            setTimeout(() => {
              showQuestionAndAnswer(index + 1);
            }, 2000);
          }, 2000);
        };
        
        // Start with first question
        showQuestionAndAnswer(0);
      } else {
        // For technical interview, just start recording
        setLiveTranscript("I'm working on the technical problem...");
      }
    } else {
      // Stop recording
      setIsRecording(false);
      setLiveTranscript('');
    }
  };



  const completeInterview = () => {
    setIsRecording(false);
    
    // Generate script with exactly 5 mock Q&A mapped to questions
    const script = {
      questions: mockQuestions.map((q, index) => ({
        ...q,
        answer: getMockAnswer(index),
        duration: Math.floor(Math.random() * 120) + 30
      })),
      totalDuration: 0, // No timer for pre-screen interview
      feedback: "Strong communication skills demonstrated throughout the interview. Good technical knowledge and problem-solving approach.",
      timestamp: new Date().toLocaleString()
    };
    
    onComplete(script);
    navigate('/interview/completed');
  };



  const completeTechnicalInterview = () => {
    setIsRecording(false);
    
    const script = {
      type: 'technical',
      totalDuration: 0, // No timer for technical interview
      feedback: "Technical interview completed. Candidate demonstrated problem-solving skills.",
      timestamp: new Date().toLocaleString()
    };
    
    onComplete(script);
    navigate('/interview/completed');
  };



  return (
    <div className="h-full flex flex-col">
      {/* Interview Type Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between">
          {interviewType === 'technical' && (
            <div className="flex items-center space-x-2">
              <Clock size={16} className="text-gray-500" />
              <span className="text-sm text-gray-600">Time remaining:</span>
              <span className={`font-medium ${technicalTimeRemaining <= 300 ? 'text-red-600' : 'text-gray-900'}`}>
                {formatTime(technicalTimeRemaining)}
              </span>
            </div>
          )}
          {interviewType === 'pre-screen' && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Question {currentQuestion + 1} of {mockQuestions.length}</span>
              <div className="flex items-center space-x-1">
                {mockQuestions.map((_, index) => (
                  <div key={index} className={`w-2 h-2 rounded-full ${
                    index < currentQuestion ? 'bg-green-500' :
                    index === currentQuestion ? 'bg-blue-500' :
                    'bg-gray-300'
                  }`} />
                ))}
              </div>
            </div>
          )}
          {interviewType === 'technical' && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Technical Interview</span>
              <div className="w-2 h-2 rounded-full bg-blue-500" />
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {chatMessages.map((message) => (
            <div key={message.id} className={`flex ${message.type === 'bot' ? 'justify-start' : 'justify-end'}`}>
              <div className={`flex items-start gap-3 max-w-3xl ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.type === 'bot' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                }`}>
                  {message.type === 'bot' ? <Bot size={16} /> : '👤'}
                </div>
                <div className={`rounded-xl px-4 py-3 shadow-sm ${
                  message.type === 'bot' 
                    ? 'bg-white border border-gray-200' 
                    : 'bg-[#2B5EA1] text-white'
                }`}>
                  {message.type === 'bot' && (
                    <div className="text-xs text-gray-500 mb-1">AI Interviewer</div>
                  )}
                  <p className="text-sm leading-relaxed">{message.content}</p>
                </div>
              </div>
            </div>
          ))}
          


          {/* System Messages */}
          {connectionStatus === 'disconnected' && (
            <div className="flex justify-center">
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2 text-sm text-red-800 flex items-center gap-2">
                <WifiOff size={14} />
                Connection lost
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Sticky Recorder Dock */}
      <div className="border-t border-gray-200 bg-white px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Mic Button - Only show when not on last question and popup not shown */}
            {interviewType === 'pre-screen' && currentQuestion < mockQuestions.length - 1 && !showCompletePopup && (
              <button
                onClick={toggleRecording}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                  isRecording 
                    ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
                    : 'bg-[#2B5EA1] hover:bg-[#244E85] text-white'
                }`}
              >
                <Mic size={20} />
              </button>
            )}

            {/* Status */}
            <div className="text-sm text-gray-600">
              {showCompletePopup 
                ? 'Interview completed!'
                : interviewType === 'pre-screen' && currentQuestion < mockQuestions.length - 1 
                  ? (isRecording ? 'Recording ...' : 'Click to start')
                  : 'Interview complete'
              }
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-2">
           
            {interviewType === 'technical' && (
              <button
                onClick={completeTechnicalInterview}
                className="bg-[#2B5EA1] hover:bg-[#244E85] text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 text-sm"
              >
                <CheckCircle size={16} />
                <span>Complete Interview</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Complete Interview Popup */}
      {showCompletePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Interview Completed!
              </h3>
              <p className="text-sm text-gray-600">
                Thank you for completing the interview. You can now review and submit your responses.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
         
              <button
                onClick={completeInterview}
                className="flex-1 px-4 py-2 bg-[#2B5EA1] text-white rounded-md hover:bg-[#244E85] transition-colors"
              >
                Complete Interview
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default InterviewPage;
