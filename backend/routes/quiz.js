const express = require('express');
const { askGemini } = require('../services/gemini');

const router = express.Router();

router.post('/evaluate', async (req, res) => {
  try {
    const { category = 'General', wrongAnswers = [] } = req.body || {};
    const prompt = `You are a learning coach. Category: ${category}. Wrong answers: ${JSON.stringify(wrongAnswers)}. Return strict JSON with keys weak_areas (array of short strings) and suggestions (array of actionable suggestions).`;

    const raw = await askGemini(
      prompt,
      '{"weak_areas":["Concept clarity","Question interpretation"],"suggestions":["Review fundamentals","Practice timed quizzes"]}'
    );

    let parsed;
    try {
      parsed = JSON.parse(String(raw).replace(/```json|```/g, '').trim());
    } catch {
      parsed = {
        weak_areas: ['Concept clarity'],
        suggestions: ['Practice more category-focused questions']
      };
    }

    res.json({
      weak_areas: Array.isArray(parsed.weak_areas) ? parsed.weak_areas : [],
      suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : []
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to evaluate quiz results.' });
  }
});

module.exports = router;
