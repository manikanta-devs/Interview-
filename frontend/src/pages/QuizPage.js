import { useMemo, useState } from 'react';
import api from '../api';

const QUIZ_BANK = {
  HR: [
    {
      question: 'What is your biggest strength?',
      options: ['Avoiding teamwork', 'Clear communication', 'Ignoring deadlines', 'Micromanagement'],
      answer: 'Clear communication'
    }
  ],
  Technical: [
    {
      question: 'Which HTTP method is idempotent?',
      options: ['POST', 'PATCH', 'DELETE', 'TRACE'],
      answer: 'DELETE'
    }
  ],
  Aptitude: [
    {
      question: 'If x + 5 = 12, what is x?',
      options: ['5', '7', '12', '17'],
      answer: '7'
    }
  ]
};

function QuizPage({ saveReport }) {
  const [category, setCategory] = useState('HR');
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const questions = useMemo(() => QUIZ_BANK[category], [category]);

  const submit = async () => {
    const wrongAnswers = [];
    let score = 0;

    questions.forEach((question, index) => {
      const picked = answers[index];
      if (picked === question.answer) {
        score += 1;
      } else {
        wrongAnswers.push({ question: question.question, selected: picked || '', correct: question.answer });
      }
    });

    const percent = Math.round((score / questions.length) * 100);
    const ai = await api.post('/quiz/evaluate', { category, wrongAnswers });

    const payload = {
      score: percent,
      wrongAnswers,
      weakAreas: ai.data.weak_areas,
      suggestions: ai.data.suggestions
    };

    setResult(payload);
    saveReport({
      type: `quiz-${category.toLowerCase()}`,
      score: percent,
      strengths: percent >= 70 ? ['Strong quiz performance'] : ['Attempt completed'],
      weaknesses: payload.weakAreas,
      suggestions: payload.suggestions
    });
  };

  return (
    <div className="page">
      <div className="card">
        <h2>Quiz</h2>
        <div className="row wrap">
          {Object.keys(QUIZ_BANK).map((item) => (
            <button key={item} className={item === category ? 'active' : ''} onClick={() => setCategory(item)}>
              {item}
            </button>
          ))}
        </div>

        {questions.map((question, index) => (
          <div key={question.question} className="quiz-question">
            <p>{question.question}</p>
            {question.options.map((option) => (
              <label key={option} className="option">
                <input
                  type="radio"
                  name={`q-${index}`}
                  checked={answers[index] === option}
                  onChange={() => setAnswers((prev) => ({ ...prev, [index]: option }))}
                />
                {option}
              </label>
            ))}
          </div>
        ))}

        <button onClick={submit}>Submit Quiz</button>

        {result && (
          <div className="result-card">
            <p><strong>Score:</strong> {result.score}</p>
            <p><strong>Weak areas:</strong> {result.weakAreas.join(', ') || 'None'}</p>
            <p><strong>Suggestions:</strong> {result.suggestions.join(', ') || 'Keep practicing'}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default QuizPage;
