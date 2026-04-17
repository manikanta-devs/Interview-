# AI Interview Preparation Platform

Full-stack MVP with React frontend + Express backend + Gemini prompt-chained multi-agent interview processing.

## Live Demo

- Frontend: https://manikanta-devs.github.io/Interview-/

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

## Deployment

Frontend is deployed with GitHub Pages using GitHub Actions.

### Workflow

- Workflow file: `.github/workflows/deploy-frontend-pages.yml`
- Trigger: push to `main` (or manual workflow dispatch)
- Build output: `frontend/build`

### One-time repository setup

1. Open repository settings: `Settings -> Pages`
2. Under `Build and deployment`, select `Source: GitHub Actions`
3. Save

### Production environment variable

If backend is deployed publicly, add this repository secret so frontend API calls use production backend:

- Secret name: `REACT_APP_API_URL`
- Example value: `https://your-backend-domain/api`

Without the secret, frontend defaults to local backend URL (`http://localhost:5000/api`).
