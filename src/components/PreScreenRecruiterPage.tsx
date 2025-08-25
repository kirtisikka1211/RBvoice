import React, { useState } from 'react';
import { 
  Plus, 
  Edit3, 
  Save, 
  Trash2, 
  FileText,
  Bot,
  CheckCircle,
  Mic
} from 'lucide-react';

interface PreScreenQuestion {
  id: number;
  question: string;
  category: string;
  type: 'behavioral' | 'technical' | 'situational' | 'general';
  estimatedTime: number; // in minutes
}

const PreScreenRecruiterPage: React.FC = () => {
  const [questions, setQuestions] = useState<PreScreenQuestion[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<PreScreenQuestion | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Sample pre-screen questions for demonstration
  const sampleQuestions: PreScreenQuestion[] = [
    {
      id: 1,
      question: "Tell me about yourself and your professional background.",
      category: "Introduction",
      type: "general",
      estimatedTime: 3
    },
    {
      id: 2,
      question: "What interests you most about this position and our company?",
      category: "Motivation",
      type: "behavioral",
      estimatedTime: 4
    },
    {
      id: 3,
      question: "Describe a challenging project you've worked on recently and how you overcame obstacles.",
      category: "Problem Solving",
      type: "situational",
      estimatedTime: 5
    },
    {
      id: 4,
      question: "How do you handle working under pressure and tight deadlines?",
      category: "Work Style",
      type: "behavioral",
      estimatedTime: 4
    },
    {
      id: 5,
      question: "Where do you see yourself professionally in the next 3-5 years?",
      category: "Career Goals",
      type: "general",
      estimatedTime: 3
    }
  ];

  const generateQuestions = async () => {
    setIsGenerating(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setQuestions(sampleQuestions);
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

  const addNewQuestion = () => {
    const newQuestion: PreScreenQuestion = {
      id: Date.now(),
      question: "New pre-screen question...",
      category: "General",
      type: "general",
      estimatedTime: 3
    };
    setQuestions(prev => [...prev, newQuestion]);
    setEditingQuestion(newQuestion);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'behavioral': return 'bg-blue-100 text-blue-800';
      case 'technical': return 'bg-purple-100 text-purple-800';
      case 'situational': return 'bg-orange-100 text-orange-800';
      case 'general': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = [
      'bg-indigo-100 text-indigo-800',
      'bg-pink-100 text-pink-800',
      'bg-yellow-100 text-yellow-800',
      'bg-teal-100 text-teal-800',
      'bg-red-100 text-red-800'
    ];
    return colors[Math.abs(category.length) % colors.length];
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Pre-Screen Questions</h1>
            <p className="text-gray-600">Configure pre-screen interview questions for candidates.</p>
          </div>
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
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Pre-Screen Assessment Questions ({questions.length})
              </h2>
              <button
                onClick={addNewQuestion}
                className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <Plus size={16} />
                <span>Add Question</span>
              </button>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {questions.map((question) => (
              <div key={question.id} className="p-6">
                {editingQuestion?.id === question.id ? (
                  // Editing Mode
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
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <input
                          type="text"
                          value={editingQuestion.category}
                          onChange={(e) => setEditingQuestion(prev => prev ? { ...prev, category: e.target.value } : null)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="e.g., Introduction, Motivation"
                        />
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Question Type</label>
                          <select
                            value={editingQuestion.type}
                            onChange={(e) => setEditingQuestion(prev => prev ? { ...prev, type: e.target.value as 'behavioral' | 'technical' | 'situational' | 'general' } : null)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="general">General</option>
                            <option value="behavioral">Behavioral</option>
                            <option value="technical">Technical</option>
                            <option value="situational">Situational</option>
                          </select>
                        </div>
                        <div>
                          {/* <label className="block text-sm font-medium text-gray-700 mb-1">Time (minutes)</label>
                          <input
                            type="number"
                            value={editingQuestion.estimatedTime}
                            onChange={(e) => setEditingQuestion(prev => prev ? { ...prev, estimatedTime: parseInt(e.target.value) || 0 } : null)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            min="1"
                            max="15"
                          /> */}
                        </div>
                      </div>
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
                  // Display Mode
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-gray-900 font-medium mb-2">{question.question}</p>
                        <div className="flex items-center space-x-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(question.category)}`}>
                            {question.category}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(question.type)}`}>
                            {question.type.charAt(0).toUpperCase() + question.type.slice(1)}
                          </span>
                          {/* <span className="text-sm text-gray-500">
                            {question.estimatedTime} min
                          </span> */}
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
