import NavCard from '../components/NavCard';

function DashboardPage({ user }) {
  const reports = JSON.parse(localStorage.getItem('reports') || '[]');
  const lastScore = reports[0]?.score ?? 'N/A';

  return (
    <div className="page">
      <div className="card">
        <h1>Welcome, {user?.name || 'Candidate'} 👋</h1>
        <p>Last score: <strong>{lastScore}</strong></p>
      </div>

      <div className="nav-grid">
        <NavCard to="/chat" title="Chat Interview" description="Practice typed interviews with AI." />
        <NavCard to="/voice" title="Voice Interview" description="Speak and get instant transcript feedback." />
        <NavCard to="/virtual" title="Virtual Interview" description="Avatar-based interview simulation." />
        <NavCard to="/quiz" title="Quiz" description="HR, Technical, and Aptitude MCQ quiz." />
        <NavCard to="/reports" title="Reports" description="View strengths, weaknesses, and suggestions." />
      </div>
    </div>
  );
}

export default DashboardPage;
