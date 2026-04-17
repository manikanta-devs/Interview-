import { useEffect, useState } from 'react';
import api from '../api';

function ChatInterviewPage({ saveReport }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const appendAiMessage = (payload) => {
    setMessages((prev) => [
      ...prev,
      { role: 'ai', text: payload.question, payload }
    ]);
  };

  useEffect(() => {
    const start = async () => {
      const response = await api.post('/ai/chat', { answer: '', previousQuestion: '' });
      appendAiMessage(response.data);
    };
    start();
  }, []);

  const submitAnswer = async () => {
    if (!input.trim() || loading) return;

    const previousQuestion = messages[messages.length - 1]?.text || '';
    const answer = input.trim();

    setMessages((prev) => [...prev, { role: 'user', text: answer }]);
    setInput('');
    setLoading(true);

    try {
      const response = await api.post('/ai/chat', { answer, previousQuestion });
      appendAiMessage(response.data);
      saveReport({
        type: 'chat',
        score: response.data.score,
        strengths: ['Good attempt and engagement'],
        weaknesses: [response.data.feedback],
        suggestions: [response.data.improved_answer]
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="card">
        <h2>AI Chat Interview</h2>
        <div className="chat-window">
          {messages.map((message, index) => (
            <div key={index} className={`bubble ${message.role}`}>
              <p>{message.text}</p>
              {message.payload && (
                <>
                  <small>Score: {message.payload.score}</small>
                  <small>Feedback: {message.payload.feedback}</small>
                  {message.payload.improved_answer && (
                    <small>STAR: {message.payload.improved_answer}</small>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
        <div className="row">
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Type your answer..."
          />
          <button onClick={submitAnswer} disabled={loading}>
            {loading ? 'Thinking...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatInterviewPage;
