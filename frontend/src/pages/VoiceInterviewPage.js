import { useState } from 'react';
import api from '../api';

function VoiceInterviewPage({ saveReport }) {
  const [transcript, setTranscript] = useState('');
  const [result, setResult] = useState(null);

  const startRecording = () => {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) {
      alert('Speech recognition is not supported in this browser. You can type manually.');
      return;
    }

    const recognition = new Recognition();
    recognition.lang = 'en-US';
    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
    };
    recognition.start();
  };

  const analyzeTranscript = async () => {
    if (!transcript.trim()) return;
    const response = await api.post('/ai/analyze', {
      question: 'Tell me about your key achievement.',
      answer: transcript
    });
    setResult(response.data);
    saveReport({
      type: 'voice',
      score: response.data.score,
      strengths: ['Clear spoken response'],
      weaknesses: [response.data.feedback],
      suggestions: [response.data.improved_answer]
    });
  };

  return (
    <div className="page">
      <div className="card">
        <h2>Voice Interview</h2>
        <div className="row wrap">
          <button onClick={startRecording}>Record Voice</button>
          <button onClick={analyzeTranscript}>Analyze</button>
        </div>
        <textarea
          rows={4}
          value={transcript}
          onChange={(event) => setTranscript(event.target.value)}
          placeholder="Transcript appears here (or type your answer)..."
        />
        {result && (
          <div className="result-card">
            <p><strong>Question:</strong> {result.question}</p>
            <p><strong>Score:</strong> {result.score}</p>
            <p><strong>Feedback:</strong> {result.feedback}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default VoiceInterviewPage;
