import { useMemo, useState } from 'react';
import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import ProtectedRoute from './components/ProtectedRoute';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import ChatInterviewPage from './pages/ChatInterviewPage';
import VoiceInterviewPage from './pages/VoiceInterviewPage';
import VirtualInterviewPage from './pages/VirtualInterviewPage';
import QuizPage from './pages/QuizPage';
import ReportsPage from './pages/ReportsPage';

function App() {
  const [user, setUser] = useState(() => {
    const current = localStorage.getItem('currentUser');
    return current ? JSON.parse(current) : null;
  });
  const [darkMode, setDarkMode] = useState(false);

  const saveReport = (report) => {
    const previous = JSON.parse(localStorage.getItem('reports') || '[]');
    const next = [{ ...report, createdAt: new Date().toISOString() }, ...previous].slice(0, 20);
    localStorage.setItem('reports', JSON.stringify(next));
  };

  const navLinks = useMemo(
    () => [
      { to: '/dashboard', label: 'Dashboard' },
      { to: '/chat', label: 'Chat' },
      { to: '/voice', label: 'Voice' },
      { to: '/virtual', label: 'Virtual' },
      { to: '/quiz', label: 'Quiz' },
      { to: '/reports', label: 'Reports' }
    ],
    []
  );

  const logout = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
  };

  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <div className={`app-shell ${darkMode ? 'dark' : ''}`}>
        <header className="topbar">
          <Link to="/dashboard" className="brand">AI Interview Coach</Link>
          {user && (
            <nav>
              {navLinks.map((link) => (
                <Link key={link.to} to={link.to}>{link.label}</Link>
              ))}
            </nav>
          )}
          <div className="row wrap">
            <button onClick={() => setDarkMode((prev) => !prev)}>{darkMode ? 'Light' : 'Dark'} mode</button>
            {user && <button onClick={logout}>Logout</button>}
          </div>
        </header>

        <Routes>
          <Route
            path="/"
            element={user ? <Navigate to="/dashboard" replace /> : <AuthPage mode="login" onLogin={setUser} />}
          />
          <Route path="/register" element={<AuthPage mode="register" onLogin={setUser} />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute user={user}>
                <DashboardPage user={user} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <ProtectedRoute user={user}>
                <ChatInterviewPage saveReport={saveReport} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/voice"
            element={
              <ProtectedRoute user={user}>
                <VoiceInterviewPage saveReport={saveReport} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/virtual"
            element={
              <ProtectedRoute user={user}>
                <VirtualInterviewPage saveReport={saveReport} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quiz"
            element={
              <ProtectedRoute user={user}>
                <QuizPage saveReport={saveReport} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute user={user}>
                <ReportsPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
