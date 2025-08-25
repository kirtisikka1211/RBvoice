import React, { useState } from 'react';
import { 
  Plus, 
  Edit3, 
  Save, 
  Trash2, 
  FileText,
  Bot,
  CheckCircle
} from 'lucide-react';

interface TechnicalQuestion {
  id: number;
  question: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: number; // in minutes
}

const RecruiterPage: React.FC = () => {
  const [questions, setQuestions] = useState<TechnicalQuestion[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<TechnicalQuestion | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Sample technical questions for demonstration
  const sampleQuestions: TechnicalQuestion[] = [
    {
      id: 1,
      question: "Explain the difference between synchronous and asynchronous code in JavaScript and when you'd use each.",
      category: "JavaScript",
      difficulty: "medium",
      estimatedTime: 5
    },
    {
      id: 2,
      question: "What is a closure in JavaScript? Provide a practical use case.",
      category: "JavaScript",
      difficulty: "medium",
      estimatedTime: 4
    },
    {
      id: 3,
      question: "How would you optimize a React application that re-renders too frequently?",
      category: "React",
      difficulty: "hard",
      estimatedTime: 6
    },
    {
      id: 4,
      question: "Describe how you would design a REST API for a todo app. Include key endpoints and status codes.",
      category: "Backend",
      difficulty: "medium",
      estimatedTime: 5
    },
    {
      id: 5,
      question: "You're given a slow SQL query. What steps would you take to diagnose and improve its performance?",
      category: "Database",
      difficulty: "hard",
      estimatedTime: 7
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

  const startEditing = (question: TechnicalQuestion) => {
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
    const newQuestion: TechnicalQuestion = {
      id: Date.now(),
      question: "New technical question...",
      category: "General",
      difficulty: "medium",
      estimatedTime: 5
    };
    setQuestions(prev => [...prev, newQuestion]);
    setEditingQuestion(newQuestion);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = [
      'bg-blue-100 text-blue-800',
      'bg-purple-100 text-purple-800',
      'bg-indigo-100 text-indigo-800',
      'bg-pink-100 text-pink-800',
      'bg-orange-100 text-orange-800'
    ];
    return colors[Math.abs(category.length) % colors.length];
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Technical Questions</h1>
            <p className="text-gray-600">Configure technical assessment questions for candidates.</p>
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
                <Bot size={16} />
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
                Technical Assessment Questions ({questions.length})
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
                          placeholder="e.g., JavaScript, React"
                        />
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                          <select
                            value={editingQuestion.difficulty}
                            onChange={(e) => setEditingQuestion(prev => prev ? { ...prev, difficulty: e.target.value as 'easy' | 'medium' | 'hard' } : null)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
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
                            max="60" */}
                          {/* /> */}
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
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
                            {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
                          </span>
                          <span className="text-sm text-gray-500">
                            {/* {question.estimatedTime} min */}
                          </span>
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
            <FileText size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No technical questions yet</h3>
          <p className="text-gray-600 mb-6">
            Click "Generate Questions" to create a set of technical assessment questions for candidates.
          </p>
          <button
            onClick={generateQuestions}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center space-x-2 mx-auto"
          >
            <Bot size={16} />
            <span>Generate Questions</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default RecruiterPage;
