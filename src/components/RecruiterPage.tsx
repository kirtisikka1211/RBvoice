import React, { useState } from 'react';
import { 
  Plus, 
  Edit3, 
  Save, 
  Trash2, 
  FileText,
  Bot,
  CheckCircle,
  Sliders,
  Layers
} from 'lucide-react';

interface TechnicalQuestion {
  id: number;
  question: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: number; // in minutes
  isFollowUp?: boolean;
}

type SkillLevelCounts = { easy: number; medium: number; hard: number };

const RecruiterPage: React.FC = () => {
  const [questions, setQuestions] = useState<TechnicalQuestion[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<TechnicalQuestion | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Configuration state
  const availableSkills = ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Express', 'SQL', 'NoSQL', 'System Design'];
  const [selectedSkills, setSelectedSkills] = useState<Record<string, SkillLevelCounts>>({});
  const [enableFollowUps, setEnableFollowUps] = useState<boolean>(false);

  // Sample technical questions for demonstration / fallback
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

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => {
      const copy = { ...prev };
      if (copy[skill]) {
        delete copy[skill];
      } else {
        copy[skill] = { easy: 1, medium: 2, hard: 1 };
      }
      return copy;
    });
  };

  const updateSkillCount = (skill: string, level: keyof SkillLevelCounts, value: number) => {
    setSelectedSkills(prev => ({
      ...prev,
      [skill]: { ...prev[skill], [level]: Math.max(0, Math.min(20, value || 0)) }
    }));
  };

  const generateFromConfig = async () => {
    setIsGenerating(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1200));

    const generated: TechnicalQuestion[] = [];
    const templates: Record<'easy' | 'medium' | 'hard', string[]> = {
      easy: [
        'Define KEY in SKILL and give a simple example.',
        'What problem does SKILL solve? Provide a one-line explanation.',
        'Name two common use-cases for SKILL.'
      ],
      medium: [
        'How would you debug ISSUE related to SKILL in a live app?',
        'Explain PATTERN in SKILL and when to apply it.',
        'Compare SKILL with ALTERNATIVE and discuss trade-offs.'
      ],
      hard: [
        'Design a scalable solution using SKILL for SCENARIO; detail components and failure handling.',
        'Optimize a bottleneck in SKILL-heavy service: outline profiling and improvements.',
        'Deep dive into internals of SKILL: how does FEATURE work under the hood?'
      ]
    };

    const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

    Object.entries(selectedSkills).forEach(([skill, counts]) => {
      (['easy', 'medium', 'hard'] as const).forEach(level => {
        const n = counts[level];
        for (let i = 0; i < n; i++) {
          const questionText = pick(templates[level])
            .replaceAll('SKILL', skill)
            .replace('KEY', skill === 'React' ? 'component' : 'concept')
            .replace('ISSUE', 'a performance issue')
            .replace('PATTERN', 'a common pattern')
            .replace('ALTERNATIVE', 'an alternative')
            .replace('SCENARIO', 'high traffic and strict latency')
            .replace('FEATURE', 'its core feature');
          const base: TechnicalQuestion = {
            id: Date.now() + generated.length,
            question: questionText,
            category: skill,
            difficulty: level,
            estimatedTime: level === 'easy' ? 3 : level === 'medium' ? 5 : 7
          };
          generated.push(base);

          if (enableFollowUps) {
            const bump = (lvl: 'easy'|'medium'|'hard'): 'easy'|'medium'|'hard' => lvl === 'easy' ? 'medium' : lvl === 'medium' ? 'hard' : 'hard';
            generated.push({
              id: Date.now() + generated.length + 10000,
              question: base.question + ' What trade-offs would you consider? Provide a deeper explanation.',
              category: base.category,
              difficulty: bump(base.difficulty),
              estimatedTime: base.estimatedTime + 2,
              isFollowUp: true
            });
          }
        }
      });
    });

    setQuestions(generated.length > 0 ? generated : sampleQuestions);
    setIsGenerating(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const generateQuestions = async () => {
    // If user configured skills, use that flow; otherwise fallback samples
    if (Object.keys(selectedSkills).length > 0) {
      return generateFromConfig();
    }
    setIsGenerating(true);
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
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Layers size={18} className="text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Technical Questions</h1>
              <p className="text-gray-600">Configure technical assessment questions for candidates.</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
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
        </div>

        {/* Config Panel */}
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
          <div className="flex items-center space-x-2 mb-3">
            <Sliders size={16} className="text-blue-700" />
            <h3 className="text-blue-900 font-semibold">Configuration</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Skill selector */}
            <div>
              <div className="text-sm font-medium text-blue-900 mb-2">Select stack/skills</div>
              <div className="flex flex-wrap gap-2">
                {availableSkills.map(skill => {
                  const active = !!selectedSkills[skill];
                  return (
                    <button
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                        active ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-700 border-blue-200 hover:bg-blue-50'
                      }`}
                    >
                      {skill}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Per-skill counts */}
            <div>
              <div className="text-sm font-medium text-blue-900 mb-2">Per-skill question counts</div>
              <div className="space-y-3 max-h-40 overflow-auto pr-2">
                {Object.entries(selectedSkills).length === 0 && (
                  <div className="text-xs text-blue-800">Select at least one skill to configure counts.</div>
                )}
                {Object.entries(selectedSkills).map(([skill, counts]) => (
                  <div key={skill} className="bg-white rounded-md border border-blue-100 p-2">
                    <div className="text-xs font-semibold text-blue-900 mb-2">{skill}</div>
                    <div className="grid grid-cols-3 gap-2">
                      {(['easy','medium','hard'] as const).map(level => (
                        <div key={level} className="flex items-center space-x-2">
                          <span className={`text-[11px] px-1.5 py-0.5 rounded ${
                            level==='easy' ? 'bg-green-100 text-green-800' : level==='medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                          }`}>{level}</span>
                          <input
                            type="number"
                            min={0}
                            max={20}
                            value={counts[level]}
                            onChange={(e) => updateSkillCount(skill, level, parseInt(e.target.value))}
                            className="w-16 px-2 py-1 border border-blue-200 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Full-width follow-ups row */}
          <div className="mt-4">
            <div className="w-full bg-white border border-blue-100 rounded-lg p-3">
              <div className="flex items-center">
                <input
                  id="enable-followups"
                  type="checkbox"
                  checked={enableFollowUps}
                  onChange={(e) => setEnableFollowUps(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-blue-300 rounded"
                />
                <label htmlFor="enable-followups" className="ml-2 text-sm font-medium text-blue-900">
                  Enable follow-up questions
                </label>
                <span className="ml-3 text-[11px] text-blue-800">
                  Adds one deeper follow-up per question with higher difficulty.
                </span>
              </div>
            </div>
          </div>
        </div>
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
                          {/* <label className="block text-sm font-medium text-gray-700 mb-1">Time (minutes)</label> */}
                          {/* <input
                            type="number"
                            value={editingQuestion.estimatedTime}
                            onChange={(e) => setEditingQuestion(prev => prev ? { ...prev, estimatedTime: parseInt(e.target.value) || 0 } : null)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            min="1"
                            max="60"
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
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
                            {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
                          </span>
                          {question.isFollowUp && (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                              Follow-up
                            </span>
                          )}
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
            <FileText size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No technical questions yet</h3>
          <p className="text-gray-600 mb-6">
            Select skills and levels in the configuration panel, or click "Generate Questions" to use defaults.
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
