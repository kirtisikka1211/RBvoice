import React, { useState } from 'react';
import { 
  Edit3, 
  Save, 
  Trash2, 
  CheckCircle,
  Mic,
  ChevronDown,
  Plus
} from 'lucide-react';

interface PreScreenQuestion {
  id: number;
  question: string;


  estimatedTime: number; // in minutes
  expectedAnswer: string;
}

const PreScreenRecruiterPage: React.FC = () => {
  const [questions, setQuestions] = useState<PreScreenQuestion[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<PreScreenQuestion | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [enableResumeTrivia, setEnableResumeTrivia] = useState<boolean>(false);
  const [openDefaultSection, setOpenDefaultSection] = useState<boolean>(true);
  const [openResumeSection, setOpenResumeSection] = useState<boolean>(true);

  // Sample pre-screen questions (HR-focused) for demonstration
  const sampleQuestions: PreScreenQuestion[] = [
    {
      id: 1,
      question: "What is your expected CTC (total annual compensation)?",

      estimatedTime: 2,
      expectedAnswer: "A clear range or figure (e.g., 16–20 LPA) with flexibility notes if any."
    },
    {
      id: 2,
      question: "What is your preferred work location?",

      estimatedTime: 2,
      expectedAnswer: "Specific city/region preference; mention multiple acceptable locations if applicable."
    },
    {
      id: 3,
      question: "What work mode do you prefer (Remote / Hybrid / WFO)?",
    
      estimatedTime: 2,
      expectedAnswer: "One of Remote/Hybrid/WFO; if Hybrid/WFO, include onsite days or commute constraints."
    },
    {
      id: 4,
      question: "Are you open to relocation if required?",

      estimatedTime: 2,
      expectedAnswer: "Yes/No; if yes, specify cities; if no, provide constraints or required support."
    },
    {
      id: 5,
      question: "What is your notice period and earliest joining date?",
   
      estimatedTime: 2,
      expectedAnswer: "Exact notice period (e.g., 30/60/90 days) and any buyout/negotiation possibilities."
    }
  ];

  // Resume-based pre-screen questions (shown only when enabled)
  const resumeSamples: PreScreenQuestion[] = [
    {
      id: 101,
      question: "You mentioned leading Project X. What business KPI improved and by how much?",
      estimatedTime: 3,
      expectedAnswer: "Concrete impact with metrics (e.g., +18% conversion, -25% latency)."
    },
    {
      id: 102,
      question: "4+ years of React: share a perf issue you solved and how you measured it.",
      estimatedTime: 3,
      expectedAnswer: "Profiling steps, hooks/memoization, before/after metrics."
    },
    {
      id: 103,
      question: "Scaled APIs to high traffic: what was the bottleneck and the fix?",
      estimatedTime: 3,
      expectedAnswer: "Bottleneck identification, mitigation (caching, queues), and monitoring."
    }
  ];

  const generateQuestions = async () => {
    setIsGenerating(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    const combined = enableResumeTrivia ? [...sampleQuestions.map(q => ({...q, })) , ...resumeSamples.map(q => ({...q, }))] : sampleQuestions.map(q => ({...q, }));
    setQuestions(combined);
    setIsGenerating(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const startEditing = (question: PreScreenQuestion) => {
    setEditingQuestion({ ...question });
  };

  const saveQuestion = () => {
    if (!editingQuestion) return;
    
    setQuestions(prev => 
      prev.map(q => q.id === editingQuestion.id ? editingQuestion : q)
    );
    setEditingQuestion(null);
  };

  const deleteQuestion = (id: number) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
  };

  // Reserved for future manual add; removed from UI to keep flow simple

  // Removed type pill; keeping category badge only

  
  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Pre-Screen Questions</h1>
            <p className="text-gray-600">Configure pre-screen interview questions for candidates.</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={generateQuestions}
              disabled={isGenerating}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                isGenerating 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Mic size={16} />
                  <span>Generate Questions</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Config Panel (match technical page style) */}
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
          <div className="w-full bg-white border border-blue-100 rounded-lg p-3">
            <div className="flex items-center">
              <input
                id="enable-resume-trivia"
                type="checkbox"
                checked={enableResumeTrivia}
                onChange={(e) => setEnableResumeTrivia(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-blue-300 rounded"
              />
              <label htmlFor="enable-resume-trivia" className="ml-2 text-sm font-medium text-blue-900">
                Enable resume-based questions
              </label>
              <span className="ml-3 text-[11px] text-blue-800">
                Tailor questions based on the candidate's resume highlights.
              </span>
            </div>
          </div>
        </div>

        {showSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-green-800 flex items-center space-x-2">
            <CheckCircle size={16} />
            <span>Questions generated successfully!</span>
          </div>
        )}
      </div>

      {/* Questions List */}
      {questions.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Default section */}
          <button
            onClick={() => setOpenDefaultSection(v => !v)}
            className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 border-b border-gray-200"
          >
            <span className="text-lg font-semibold text-gray-900">Questions</span>
            <ChevronDown size={18} className={`transition-transform ${openDefaultSection ? 'rotate-180' : ''}`} />
          </button>
          {openDefaultSection && (
            <div className="divide-y divide-gray-200">
              {questions
                .filter((q) => q.id < 100)
                .map((question) => (
                  <div key={question.id} className="p-6">
                    {editingQuestion?.id === question.id ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
                            <textarea
                              value={editingQuestion.question}
                              onChange={(e) => setEditingQuestion(prev => prev ? { ...prev, question: e.target.value } : null)}
                              className="w-full h-24 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                              placeholder="Enter your question..."
                            />
                          </div>
                          <div className="space-y-3"></div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Expected Answer</label>
                          <textarea
                            value={editingQuestion.expectedAnswer}
                            onChange={(e) => setEditingQuestion(prev => prev ? { ...prev, expectedAnswer: e.target.value } : null)}
                            className="w-full h-28 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                            placeholder="Guidance for a strong expected answer..."
                          />
                        </div>
                        <div className="flex space-x-3">
                          <button
                            onClick={saveQuestion}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
                          >
                            <Save size={16} />
                            <span>Save Changes</span>
                          </button>
                          <button
                            onClick={() => setEditingQuestion(null)}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-gray-900 font-medium mb-2">{question.question}</p>
                            <div className="mt-3">
                              <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">Expected answer</div>
                              <div className="text-sm text-gray-800 bg-gray-50 border border-gray-200 rounded-md p-3 whitespace-pre-wrap">
                                {question.expectedAnswer}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            <button
                              onClick={() => startEditing(question)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit question"
                            >
                              <Edit3 size={16} />
                            </button>
                            <button
                              onClick={() => deleteQuestion(question.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete question"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}

          {/* Resume section (only if present) */}
          {questions.some(q => q.id >= 100) && (
            <>
              <div className="h-px bg-gray-200" />
              <button
                onClick={() => setOpenResumeSection(v => !v)}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 border-b border-gray-200"
              >
                <span className="text-lg font-semibold text-gray-900">Resume Trivia</span>
                <ChevronDown size={18} className={`transition-transform ${openResumeSection ? 'rotate-180' : ''}`} />
              </button>
              {openResumeSection && (
                <div className="divide-y divide-gray-200">
                  <div className="px-6 py-3 flex items-center justify-end">
                    <button
                      onClick={() => {
                        const newQuestion: PreScreenQuestion = {
                          id: 100 + Date.now(),
                          question: 'New resume trivia question...',
                          estimatedTime: 2,
                          expectedAnswer: ''
                        };
                        setQuestions(prev => [...prev, newQuestion]);
                        setEditingQuestion(newQuestion);
                      }}
                      className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
                    >
                      <Plus size={16} />
                      <span>Add Question</span>
                    </button>
                  </div>
                  {questions
                    .filter((q) => q.id >= 100)
                    .map((question) => (
                      <div key={question.id} className="p-6">
                        {editingQuestion?.id === question.id ? (
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
                              <textarea
                                value={editingQuestion.question}
                                onChange={(e) => setEditingQuestion(prev => prev ? { ...prev, question: e.target.value } : null)}
                                className="w-full h-24 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                placeholder="Enter your question..."
                              />
                            </div>
                            <div className="flex space-x-3">
                              <button
                                onClick={saveQuestion}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
                              >
                                <Save size={16} />
                                <span>Save Changes</span>
                              </button>
                              <button
                                onClick={() => setEditingQuestion(null)}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="text-gray-900 font-medium">{question.question}</p>
                            </div>
                            <div className="flex items-center space-x-2 ml-4">
                              <button
                                onClick={() => startEditing(question)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Edit question"
                              >
                                <Edit3 size={16} />
                              </button>
                              <button
                                onClick={() => deleteQuestion(question.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete question"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Empty State */}
      {questions.length === 0 && !isGenerating && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mic size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No pre-screen questions yet</h3>
          <p className="text-gray-600 mb-6">
            Click "Generate Questions" to create a set of pre-screen interview questions for candidates.
          </p>
          <button
            onClick={generateQuestions}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center space-x-2 mx-auto"
          >
            <Mic size={16} />
            <span>Generate Questions</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default PreScreenRecruiterPage;
