<div align="center">
  <img src="https://img.icons8.com/?size=100&id=J44OLnasJaAS&format=png&color=FFFFFF"/>
</div>


# Adaptive Habit Tracker

An AI-powered habit tracker that automatically makes habits easier or harder based on how consistently you complete them.

Built with **Next.js** (frontend), **Express** (backend), and the **OpenAI API**.

## Features

- Adaptive habit difficulty
- AI-generated adjustments
- Daily completion tracking
- Custom habits

## Tech Stack

- Next.js
- Express.js
- Node.js
- OpenAI API

## Setup

1. Clone the repo

```bash
git clone https://github.com/yourusername/adaptive-habit-tracker.git
cd adaptive-habit-tracker
```

2. Install dependencies

```bash
cd frontend
npm install
cd ../backend
npm install
```

3. Create `backend/.env`

```env
OPENAI_API_KEY=your_api_key
SUPABASE_URL=your_url
SUPABASE_SERVICE_ROLE_KEY=your_key
```

4. Run locally

```bash
# backend
cd backend
npm run dev

# frontend
cd frontend
npm run dev
```
