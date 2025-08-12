import React, { useState } from 'react';
import { 
  CheckCircle, 
  Edit3, 
  FileText, 
  Send,
  Save 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

interface CompletedPageProps {
  userEmail: string;
  interviewScript: InterviewScript;
  onReset: () => void;
  onUpdateScript: (script: InterviewScript) => void;
}

const CompletedPage: React.FC<CompletedPageProps> = ({ 
  userEmail, 
  interviewScript, 
  onReset,
  onUpdateScript
}) => {
  const navigate = useNavigate();
  const [isEditingTranscript, setIsEditingTranscript] = useState(false);
  const [editableScript, setEditableScript] = useState<InterviewScript | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startTranscriptEditing = () => {
    setEditableScript(JSON.parse(JSON.stringify(interviewScript))); // Deep copy
    setIsEditingTranscript(true);
  };

  const saveTranscript = () => {
    if (!editableScript) return;
    // Update the main script with the edited version
    onUpdateScript(editableScript);
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

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In a real app, you would submit to backend here
    console.log('Submitting interview script:', interviewScript);
    
    setIsSubmitting(false);
    
    // Show success message or redirect
    alert('Interview submitted successfully!');
  };

  if (isEditingTranscript && editableScript) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-4">
          <div className="text-center mb-6">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Edit3 size={24} className="text-blue-600" />
          </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-1">
              Review & Edit Transcript
            </h3>
            <p className="text-sm text-gray-600">
              Review and edit your interview transcript. Original responses are shown on the left for reference.
            </p>
          </div>

          <div className="flex justify-center space-x-3 mb-6">
            <button
              onClick={saveTranscript}
              className="bg-[#2B5EA1] hover:bg-[#244E85] text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <Save size={16} />
              <span>Save Changes</span>
            </button>
            <button
              onClick={cancelEditing}
              className="bg-[#2B5EA1] hover:bg-[#244E85] text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <span>Cancel</span>
            </button>
          </div>
        </div>

        {/* Side-by-side Interview Script */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Original Transcript */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center space-x-2 mb-4">
              <FileText size={20} className="text-blue-600" />
              <h4 className="text-lg font-semibold text-gray-900">Original Transcript</h4>
            </div>

            <div className="space-y-4">
              {interviewScript.questions.map((q, index) => (
                <div key={q.id} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-xs font-medium text-blue-600">Q{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <div className="mb-2">
                        <p className="text-xs font-medium text-gray-900 mb-1">{q.question}</p>
                        <p className="text-xs text-gray-500">Duration: {formatTime(q.duration || 0)}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm text-gray-700 leading-relaxed">{q.answer}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Editable Transcript */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center space-x-2 mb-4">
              <Edit3 size={20} className="text-blue-600" />
              <h4 className="text-lg font-semibold text-gray-900">Edit Transcript</h4>
            </div>

            <div className="space-y-4">
              {editableScript.questions.map((q, index) => (
                <div key={q.id} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-xs font-medium text-blue-600">Q{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <div className="mb-2">
                        <p className="text-xs font-medium text-gray-900 mb-1">{q.question}</p>
                        <p className="text-xs text-gray-500">Duration: {formatTime(q.duration || 0)}</p>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-3">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Edit Answer:
                        </label>
                        <textarea
                          value={q.answer || ''}
                          onChange={(e) => updateQuestionAnswer(q.id, e.target.value)}
                          className="w-full h-24 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                          placeholder="Edit your answer here..."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-4">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <CheckCircle size={24} className="text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-1">
            Interview Completed!
          </h3>
          <p className="text-sm text-gray-600">
            Your interview script is ready for review and submission.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-blue-600 mb-1">{formatTime(interviewScript.totalDuration)}</div>
            <div className="text-xs text-blue-700">Total Duration</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-blue-600 mb-1">{interviewScript.questions.length}</div>
            <div className="text-xs text-blue-700">Questions</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-blue-600 mb-1">
              {Math.round(interviewScript.totalDuration / interviewScript.questions.length / 60 * 10) / 10}m
            </div>
            <div className="text-xs text-blue-700">Avg Response</div>
          </div>
        </div>

        <div className="flex justify-center space-x-3 mb-6">
          <button
            onClick={startTranscriptEditing}
            className="bg-[#2B5EA1] hover:bg-[#244E85] text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
          >
            <Edit3 size={16} />
            <span>Review</span>
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
              isSubmitting 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-[#2B5EA1] hover:bg-[#244E85] text-white'
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <Send size={16} />
                <span>Submit </span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Interview Script */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center space-x-2 mb-4">
          <FileText size={20} className="text-blue-600" />
          <h4 className="text-lg font-semibold text-gray-900">Interview Script</h4>
        </div>

        <div className="space-y-4">
          {interviewScript.questions.map((q, index) => (
            <div key={q.id} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-xs font-medium text-blue-600">Q{index + 1}</span>
                </div>
                <div className="flex-1">
                  <div className="mb-2">
                    <p className="text-xs font-medium text-gray-900 mb-1">{q.question}</p>
                    <p className="text-xs text-gray-500">Duration: {formatTime(q.duration || 0)}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-700 leading-relaxed">{q.answer}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompletedPage;
