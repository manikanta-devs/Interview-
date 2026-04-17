# AI Interview Preparation Platform

Full-stack MVP with React frontend + Express backend + Gemini prompt-chained multi-agent interview processing.

## Structure

- `/frontend` - React UI (auth, dashboard, chat, voice, virtual interview, quiz, reports)
- `/backend` - Express API (`/api/ai/chat`, `/api/ai/analyze`, `/api/quiz/evaluate`)
- `/server.js` - root entry that runs backend server

## Setup

1. Install all dependencies:

```bash
npm install
```

2. Configure backend env:

```bash
cp /home/runner/work/Interview-/Interview-/backend/.env.example /home/runner/work/Interview-/Interview-/backend/.env
# set GEMINI_API_KEY in backend/.env
```

3. Start frontend:

```bash
npm start
```

4. Start backend in another terminal:

```bash
node /home/runner/work/Interview-/Interview-/server.js
```

Frontend runs on `http://localhost:3000`, backend on `http://localhost:5000`.
