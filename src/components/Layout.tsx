import React from 'react';
import { Home, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
  userEmail: string;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, userEmail, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-56 text-white flex flex-col h-full" style={{ backgroundColor: 'rgb(52, 77, 109)' }}>
        {/* Branding Section */}
        <div className="p-4 border-b" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
          <div className="flex flex-col items-center text-center mb-1">
            <div className="w-8 h-8 bg-white rounded flex items-center justify-center font-bold text-sm mb-2" style={{ color: 'rgb(52, 77, 109)' }}>
              R
            </div>
            <div>
              <h1 className="font-bold text-sm">RBvoice</h1>
              <p className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>AI-Based Platform</p>
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 p-3">
          <div className="space-y-1">
            {/* Active Navigation Item */}
            <div className="flex items-center space-x-2 px-2 py-1.5 rounded bg-white" style={{ color: 'rgb(52, 77, 109)' }}>
              <Home size={16} />
              <span className="text-sm font-medium">Home</span>
            </div>
            {/* Inactive Navigation Item */}
            <div className="flex items-center space-x-2 px-2 py-1.5 rounded text-white hover:bg-white hover:bg-opacity-10 transition-colors cursor-pointer">
              <User size={16} />
              <span className="text-sm">Profile</span>
            </div>
          </div>
        </nav>
        
        {/* User Section */}
        <div className="p-3 border-t" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
          <div className="mb-3 p-2 rounded-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
            <div className="flex items-center space-x-2 mb-2">
              <User size={14} style={{ color: 'rgba(255, 255, 255, 0.7)' }} />
              <span className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Signed in as</span>
            </div>
            <div className="text-xs text-white font-medium mb-2">
              {userEmail || 'candidate@example.com'}
            </div>
            <button
              onClick={handleLogout}
              className="w-full text-xs px-2 py-1.5 rounded transition-colors"
              style={{ 
                color: 'rgba(255, 255, 255, 0.7)',
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'white';
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              }}
            >
              Sign Out
            </button>
          </div>
          <div className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
            RBvoice <br />
            Copyright © 2025
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Interview</h2>
              <p className="text-sm text-gray-600">Complete your interview with our AI assistant</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <User size={14} />
                <span>Candidate Portal</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
