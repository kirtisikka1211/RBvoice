import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useSearchParams } from 'react-router-dom';
import Login from './Login';
import Layout from './components/Layout';
import LandingPage from './components/LandingPage';
import IdlePage from './components/IdlePage';
import PreparingPage from './components/PreparingPage';
import InterviewPage from './components/InterviewPage';
import CompletedPage from './components/CompletedPage';

interface InterviewScript {
  questions?: Array<{
    id: number;
    question: string;
    answer?: string;
    duration?: number;
  }>;
  totalDuration: number;
  feedback?: string;
  timestamp: string;
  type?: 'pre-screen' | 'technical';
}

// Wrapper component to handle search params
const InterviewPageWrapper: React.FC<{ userEmail: string; onComplete: (script: InterviewScript) => void }> = ({ userEmail, onComplete }) => {
  const [searchParams] = useSearchParams();
  const interviewType = searchParams.get('type') as 'pre-screen' | 'technical' || 'pre-screen';
  
  return (
    <InterviewPage 
      userEmail={userEmail} 
      onComplete={onComplete}
      interviewType={interviewType}
    />
  );
};

function App() {
  const [userEmail, setUserEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [interviewScript, setInterviewScript] = useState<InterviewScript | null>(null);

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In a real app, you would validate credentials here
    if (email && password) {
      setUserEmail(email);
    }
    
    setIsLoading(false);
  };

  const handleLogout = () => {
    setUserEmail('');
    setInterviewScript(null);
  };

  const handleInterviewComplete = (script: InterviewScript) => {
    setInterviewScript(script);
  };

  const handleUpdateScript = (updatedScript: InterviewScript) => {
    setInterviewScript(updatedScript);
  };

  const handleReset = () => {
    setInterviewScript(null);
  };

  return (
    <Router>
      <div className="h-screen">
        <Routes>
          {/* Login Route */}
          <Route 
            path="/login" 
            element={
              userEmail ? (
                <Navigate to="/" replace />
              ) : (
            <Login onLogin={handleLogin} isLoading={isLoading} />
              )
            } 
          />

          {/* Protected Routes */}
          <Route 
            path="/" 
            element={
              !userEmail ? (
                <Navigate to="/login" replace />
              ) : (
                <Layout userEmail={userEmail} onLogout={handleLogout}>
                  <LandingPage userEmail={userEmail} />
                </Layout>
              )
            } 
          />

          <Route 
            path="/interview/idle" 
            element={
              !userEmail ? (
                <Navigate to="/login" replace />
              ) : (
                <Layout userEmail={userEmail} onLogout={handleLogout}>
                  <IdlePage userEmail={userEmail} />
                </Layout>
              )
            } 
          />

          <Route 
            path="/interview/preparing" 
            element={
              !userEmail ? (
                <Navigate to="/login" replace />
              ) : (
                <Layout userEmail={userEmail} onLogout={handleLogout}>
                  <PreparingPage userEmail={userEmail} />
                </Layout>
              )
            } 
          />

          <Route 
            path="/interview/active" 
            element={
              !userEmail ? (
                <Navigate to="/login" replace />
              ) : (
                <Layout userEmail={userEmail} onLogout={handleLogout}>
                  <InterviewPageWrapper 
                    userEmail={userEmail} 
                    onComplete={handleInterviewComplete}
                  />
                </Layout>
              )
            } 
          />

          <Route 
            path="/interview/completed" 
            element={
              !userEmail ? (
                <Navigate to="/login" replace />
              ) : !interviewScript ? (
                <Navigate to="/" replace />
              ) : (
                <Layout userEmail={userEmail} onLogout={handleLogout}>
                  <CompletedPage 
                    userEmail={userEmail}
                    interviewScript={interviewScript}
                    onReset={handleReset}
                    onUpdateScript={handleUpdateScript}
                  />
                </Layout>
              )
            } 
          />

          {/* Default redirect */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;