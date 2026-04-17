const express = require('express');
const { runInterviewAgents } = require('../services/gemini');

const router = express.Router();

router.post('/chat', async (req, res) => {
  try {
    const { answer = '', previousQuestion = '' } = req.body || {};
    const result = await runInterviewAgents({ question: previousQuestion, answer });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to process chat interview request.' });
  }
});

router.post('/analyze', async (req, res) => {
  try {
    const { answer = '', question = '' } = req.body || {};
    const result = await runInterviewAgents({ question, answer });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to analyze interview answer.' });
  }
});

module.exports = router;
