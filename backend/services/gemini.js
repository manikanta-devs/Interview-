const axios = require('axios');

const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

function stripMarkdownJson(text = '') {
  return text.replace(/```json|```/g, '').trim();
}

function safeJsonParse(text, fallback = {}) {
  try {
    return JSON.parse(stripMarkdownJson(text));
  } catch {
    return fallback;
  }
}

async function askGemini(prompt, fallback) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return fallback;
  }

  const response = await axios.post(
    `${GEMINI_URL}?key=${apiKey}`,
    {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.6 }
    },
    { timeout: 30000 }
  );

  return (
    response.data?.candidates?.[0]?.content?.parts?.[0]?.text || fallback
  );
}

async function runInterviewAgents({ question = '', answer = '' }) {
  const safeAnswer = String(answer || '').slice(0, 2500);
  const safeQuestion = String(question || '').slice(0, 500);

  const interviewerPrompt = safeAnswer
    ? `You are an interviewer agent. Based on the previous question "${safeQuestion}" and this answer "${safeAnswer}", ask ONE concise follow-up interview question only.`
    : 'You are an interviewer agent. Ask one concise interview opener question for a job candidate.';

  const nextQuestion = await askGemini(
    interviewerPrompt,
    'Tell me about a time you solved a difficult problem at work.'
  );

  const analyzerPrompt = `You are analyzer agent. Analyze this interview answer for relevance, clarity, and structure. Keep feedback under 80 words. Answer: "${safeAnswer}"`;
  const feedback = safeAnswer
    ? await askGemini(
        analyzerPrompt,
        'Your answer is relevant but can be clearer and better structured with a clear context and outcome.'
      )
    : 'Please provide an answer to receive feedback.';

  const improverPrompt = `You are improver agent. Rewrite this answer using STAR (Situation, Task, Action, Result) in under 120 words. Answer: "${safeAnswer}"`;
  const improvedAnswer = safeAnswer
    ? await askGemini(
        improverPrompt,
        'Situation: My service had recurring incidents. Task: Reduce outages. Action: I added monitoring and improved on-call playbooks. Result: Incident volume dropped by 40% in one quarter.'
      )
    : '';

  const scorerPrompt = `You are scorer agent. Score this answer out of 100 using weights Content=40, Clarity=30, Confidence=30. Return strict JSON with keys score and reason. Answer: "${safeAnswer}"`;
  const scoreRaw = safeAnswer
    ? await askGemini(
        scorerPrompt,
        '{"score":75,"reason":"Decent content with room for clearer structure and confidence."}'
      )
    : '{"score":0,"reason":"No answer provided."}';
  const scoreJson = safeJsonParse(scoreRaw, { score: 0, reason: 'Scoring unavailable.' });
  const numericScore = Math.max(0, Math.min(100, Number(scoreJson.score) || 0));

  return {
    question: String(nextQuestion).trim(),
    feedback: `${String(feedback).trim()}${scoreJson.reason ? ` ${scoreJson.reason}` : ''}`.trim(),
    score: numericScore,
    improved_answer: String(improvedAnswer).trim()
  };
}

module.exports = {
  runInterviewAgents,
  askGemini
};
