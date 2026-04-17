import { useEffect, useState } from 'react';
import api from '../api';

function VirtualInterviewPage({ saveReport }) {
  const [question, setQuestion] = useState('Preparing your first question...');
  const [answer, setAnswer] = useState('');
  const [typing, setTyping] = useState(true);
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [latestScore, setLatestScore] = useState(null);
  const [latestFeedback, setLatestFeedback] = useState('');

  useEffect(() => {
    const loadQuestion = async () => {
      const response = await api.post('/ai/chat', { answer: '', previousQuestion: '' });
      setTimeout(() => {
        setQuestion(response.data.question);
        setTyping(false);
      }, 900);
    };
    loadQuestion();
  }, []);

  useEffect(() => {
    if (ttsEnabled && question && !typing) {
      const utterance = new SpeechSynthesisUtterance(question);
      window.speechSynthesis.speak(utterance);
    }
  }, [question, typing, ttsEnabled]);

  const submit = async () => {
    if (!answer.trim()) return;
    setTyping(true);
    const response = await api.post('/ai/chat', {
      previousQuestion: question,
      answer
    });
    setLatestScore(response.data.score);
    setLatestFeedback(response.data.feedback);
    saveReport({
      type: 'virtual',
      score: response.data.score,
      strengths: ['Adaptive response handling'],
      weaknesses: [response.data.feedback],
      suggestions: [response.data.improved_answer]
    });
    setAnswer('');
    setTimeout(() => {
      setQuestion(response.data.question);
      setTyping(false);
    }, 900);
  };

  return (
    <div className="page">
      <div className="card">
        <h2>Virtual Interview Simulator</h2>
        <div className="avatar-row">
          <div className="avatar" aria-label="interviewer avatar">🤖</div>
          <div>
            <p className="muted">Interviewer</p>
            <p>{typing ? 'Typing next question...' : question}</p>
          </div>
        </div>

        <div className="row wrap">
          <label className="toggle-row">
            <input
              type="checkbox"
              checked={ttsEnabled}
              onChange={(event) => setTtsEnabled(event.target.checked)}
            />
            Enable text-to-speech
          </label>
        </div>

        <textarea
          rows={4}
          value={answer}
          onChange={(event) => setAnswer(event.target.value)}
          placeholder="Answer via text (or paste voice transcript)..."
        />
        <button onClick={submit}>Submit Answer</button>

        {latestScore !== null && (
          <div className="result-card">
            <p><strong>Score:</strong> {latestScore}</p>
            <p><strong>Feedback:</strong> {latestFeedback}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default VirtualInterviewPage;
