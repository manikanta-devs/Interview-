function ReportsPage() {
  const reports = JSON.parse(localStorage.getItem('reports') || '[]');

  return (
    <div className="page">
      <div className="card">
        <h2>Session Reports</h2>
        {reports.length === 0 ? (
          <p>No reports yet. Complete a session to see insights.</p>
        ) : (
          <div className="reports-list">
            {reports.map((report, index) => (
              <div className="result-card" key={`${report.type}-${index}`}>
                <p><strong>Type:</strong> {report.type}</p>
                <p><strong>Score:</strong> {report.score}</p>
                <p><strong>Strengths:</strong> {report.strengths?.join(', ')}</p>
                <p><strong>Weaknesses:</strong> {report.weaknesses?.join(', ')}</p>
                <p><strong>Suggestions:</strong> {report.suggestions?.join(', ')}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ReportsPage;
