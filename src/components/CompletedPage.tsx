import React, { useEffect, useState } from 'react';
import { 
  CheckCircle, 
  Edit3, 
  FileText, 
  Send,
  Save,
  AlertTriangle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface InterviewQuestion {
  id: number;
  question: string;
  answer?: string;
  duration?: number;
}

interface InterviewScript {
  questions?: InterviewQuestion[];
  totalDuration: number;
  feedback?: string;
  timestamp: string;
  type?: 'pre-screen' | 'technical';
  version?: number;
  transcript?: string;
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
  onReset: _onReset,
  onUpdateScript
}) => {
  const navigate = useNavigate();
  const [isEditingTranscript, setIsEditingTranscript] = useState(false);
  const [editableScript, setEditableScript] = useState<InterviewScript | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState<string>('');
  const [feedbackComment, setFeedbackComment] = useState('');
  const submittedKey = `interviewSubmitted:${userEmail}:${interviewScript.type || 'pre-screen'}`;
  const historyKey = `interviewScriptHistory:${userEmail}:${interviewScript.type || 'pre-screen'}`;
  const [history, setHistory] = useState<InterviewScript[]>([]);
  const [viewVersion, setViewVersion] = useState<InterviewScript | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(submittedKey);
      if (saved === 'true') {
        setIsSubmitted(true);
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submittedKey]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(historyKey);
      if (raw) setHistory(JSON.parse(raw));
    } catch {}
  }, [historyKey]);

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
    const nextVersion = (interviewScript.version || 1) + 1;
    const updated: InterviewScript = { ...editableScript, version: nextVersion };
    const newHistory = [...history, interviewScript];
    setHistory(newHistory);
    try { localStorage.setItem(historyKey, JSON.stringify(newHistory)); } catch {}
    onUpdateScript(updated);
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
        questions: prev.questions?.map(q => 
          q.id === questionId ? { ...q, answer: newAnswer } : q
        )
      };
    });
  };

  const handleSubmit = async () => {
    setShowFeedbackModal(true);
  };

  const submitFeedback = async () => {
    setShowConfirmationModal(true);
  };

  const confirmFinalSubmission = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In a real app, you would submit to backend here
    console.log('Submitting interview script with feedback:', {
      ...interviewScript,
      userFeedback: { emoji: selectedEmoji, comment: feedbackComment }
    });
    
    setIsSubmitting(false);
    
    // Mark as submitted and close modals
    setIsSubmitted(true);
    try {
      localStorage.setItem(submittedKey, 'true');
    } catch {}
    setShowFeedbackModal(false);
    setShowConfirmationModal(false);
    setSelectedEmoji('');
    setFeedbackComment('');
    
    // Redirect to landing page after a short delay
    setTimeout(() => {
      navigate('/');
    }, 1000);
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

        {/* Editing layout - now consistent for both interview types */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Original Q&A */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center space-x-2 mb-4">
              <FileText size={20} className="text-blue-600" />
              <h4 className="text-lg font-semibold text-gray-900">
                Original {editableScript.type === 'technical' ? 'Technical Q&A' : 'Interview Q&A'}
              </h4>
            </div>
            <div className="space-y-4">
              {interviewScript.questions?.map((q, index) => (
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
          {/* Editable Q&A */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center space-x-2 mb-4">
              <Edit3 size={20} className="text-blue-600" />
              <h4 className="text-lg font-semibold text-gray-900">
                Edit {editableScript.type === 'technical' ? 'Technical Q&A' : 'Interview Q&A'}
              </h4>
            </div>
            <div className="space-y-4">
              {editableScript.questions?.map((q, index) => (
                <div key={q.id} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-xs font-medium text-blue-600">Q{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <div className="mb-2">
                        <p className="text-xs font-medium text-gray-900 mb-1">{q.question}</p>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-3">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Edit Answer:</label>
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
          {interviewScript.type === 'technical' ? (
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-blue-600 mb-1">Technical</div>
              <div className="text-xs text-blue-700">Interview Type</div>
            </div>
          ) : (
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-blue-600 mb-1">{interviewScript.questions?.length || 0}</div>
              <div className="text-xs text-blue-700">Questions</div>
            </div>
          )}
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-blue-600 mb-1">
              {interviewScript.type === 'technical' 
                ? '30m' 
                : `${Math.round(interviewScript.totalDuration / (interviewScript.questions?.length || 1) / 60 * 10) / 10}m`
              }
            </div>
            <div className="text-xs text-blue-700">
              {interviewScript.type === 'technical' ? 'Due Before' : 'Due Before'}
            </div>
          </div>
        </div>

        {interviewScript.type === 'technical' ? (
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h4 className="text-lg font-semibold text-blue-900 mb-2">Instructions</h4>
            <div className="space-y-2 text-sm text-blue-800">
              <p>Review your transcript below. Click Review to make edits if needed.</p>
              {!isSubmitted && (
                <div className="flex items-center space-x-2 text-blue-900/80">
                  <AlertTriangle size={16} className="text-yellow-600" />
                  <span className="font-semibold">Edits are disabled after submission.</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h4 className="text-lg font-semibold text-blue-900 mb-2">Instructions</h4>
            <div className="space-y-2 text-sm text-blue-800">
              <p>Review your Q&A script below. Click Review to make edits before submitting.</p>
              {!isSubmitted && (
                <div className="flex items-center space-x-2 text-blue-900/80">
                  <AlertTriangle size={16} className="text-yellow-600" />
                  <span className="font-semibold">Edits are disabled after submission.</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-col items-center mb-4">
          {!isSubmitted && (
            <div className="flex space-x-3">
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
          )}
          {isSubmitted && (
            <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2 text-green-800 flex items-center space-x-2">
              <CheckCircle size={16} />
              <span>Interview Submitted Successfully!</span>
            </div>
          )}
          {/* {!isSubmitted && (
            <div className="mt-2 text-[11px] text-gray-500 flex items-center space-x-1">
              <Lock size={12} className="text-gray-400" />
              <span>Edits are disabled after submission.</span>
            </div>
          )} */}
        </div>
      </div>

      {/* Technical Q&A - now shows structured questions instead of just transcript */}
      {interviewScript.type === 'technical' && interviewScript.questions && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center space-x-2 mb-4">
            <FileText size={20} className="text-blue-600" />
            <h4 className="text-lg font-semibold text-gray-900">
              Technical Q&A {interviewScript.version ? `(v${interviewScript.version})` : '(v1)'}
            </h4>
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
                      {/* <p className="text-xs text-gray-500">Duration: {formatTime(q.duration || 0)}</p> */}
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
      )}

      {/* Q&A Script - for pre-screen */}
      {interviewScript.type !== 'technical' && interviewScript.questions && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center space-x-2 mb-4">
            <FileText size={20} className="text-blue-600" />
            <h4 className="text-lg font-semibold text-gray-900">
              Interview Q&A {interviewScript.version ? `(v${interviewScript.version})` : '(v1)'}
            </h4>
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
                      {/* <p className="text-xs text-gray-500">Duration: {formatTime(q.duration || 0)}</p> */}
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
      )}

      {/* Version history drawer - show for both types */}
      {history.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mt-4">
          <div className="flex items-center space-x-2 mb-3">
            <FileText size={18} className="text-blue-600" />
            <h4 className="text-base font-semibold text-gray-900">Version History</h4>
          </div>
          <div className="space-y-2">
            {history.map((h, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm bg-gray-50 rounded-md p-2">
                <div className="text-gray-700">
                  <span className="font-medium">v{h.version || idx + 1}</span> • {h.timestamp}
                </div>
                <button
                  onClick={() => setViewVersion(h)}
                  className="text-blue-600 hover:underline"
                >
                  View
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {viewVersion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {viewVersion.type === 'technical' ? 'Technical Q&A' : 'Interview Q&A'} v{viewVersion.version || 1}
              </h3>
              <p className="text-xs text-gray-500">{viewVersion.timestamp}</p>
            </div>
            {viewVersion.questions ? (
              <div className="space-y-3 max-h-96 overflow-auto pr-1">
                {viewVersion.questions.map((q, i) => (
                  <div key={q.id} className="border-b border-gray-200 pb-3 last:border-b-0 last:pb-0">
                    <div className="text-xs font-medium text-gray-900 mb-1">Q{i + 1}. {q.question}</div>
                    <div className="text-xs text-gray-500 mb-2">Duration: {formatTime(q.duration || 0)}</div>
                    <div className="bg-gray-50 rounded-md p-2">
                      <p className="text-sm text-gray-700 leading-relaxed">{q.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : viewVersion.transcript ? (
              <pre className="whitespace-pre-wrap text-sm text-gray-800 bg-gray-50 rounded-md p-3 max-h-96 overflow-auto">{viewVersion.transcript}</pre>
            ) : null}
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setViewVersion(null)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
              How was your interview experience?
            </h3>
            
            {/* Emoji Selection */}
            <div className="flex justify-center space-x-4 mb-6">
              <button
                onClick={() => setSelectedEmoji('😊')}
                className={`text-3xl p-2 rounded-lg transition-all ${
                  selectedEmoji === '😊' ? 'bg-blue-100 ring-2 ring-blue-500' : 'hover:bg-gray-100'
                }`}
              >
                😊
              </button>
              <button
                onClick={() => setSelectedEmoji('😐')}
                className={`text-3xl p-2 rounded-lg transition-all ${
                  selectedEmoji === '😐' ? 'bg-blue-100 ring-2 ring-blue-500' : 'hover:bg-gray-100'
                }`}
              >
                😐
              </button>
              <button
                onClick={() => setSelectedEmoji('😞')}
                className={`text-3xl p-2 rounded-lg transition-all ${
                  selectedEmoji === '😞' ? 'bg-blue-100 ring-2 ring-blue-500' : 'hover:bg-gray-100'
                }`}
              >
                😞
              </button>
            </div>

            {/* Comment Box */}
            <div className="mb-6">
              <label htmlFor="feedback-comment" className="block text-sm font-medium text-gray-700 mb-2">
                Additional comments (optional)
              </label>
              <textarea
                id="feedback-comment"
                value={feedbackComment}
                onChange={(e) => setFeedbackComment(e.target.value)}
                placeholder="Share your thoughts about the interview..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={3}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowFeedbackModal(false);
                  setSelectedEmoji('');
                  setFeedbackComment('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submitFeedback}
                disabled={!selectedEmoji}
                className="flex-1 px-4 py-2 bg-[#2B5EA1] text-white rounded-md hover:bg-[#244E85] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send Feedback
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⚠️</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Final Submission Warning
              </h3>
              <p className="text-sm text-gray-600">
                You won't be able to edit your interview after submission. Are you sure you want to submit?
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={() => setShowConfirmationModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmFinalSubmission}
                disabled={isSubmitting}
                className={`flex-1 px-4 py-2 bg-[#2B5EA1] text-white rounded-md hover:bg-[#244E85] transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                  </>
                ) : (
                  'Okay, Submit'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompletedPage;
