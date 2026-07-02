# 🍅 Pomodoro Tracker

A full-stack productivity web app that combines a Pomodoro timer with task management. Track focused work sessions, associate them with tasks, and monitor productivity — all with a responsive, modern UI.

## Live url: [https://pomexa.netlify.app/](https://pomexa.netlify.app/)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, React Router, Tailwind CSS |
| Backend | Node.js, Express |
| Database | MongoDB, Mongoose |
| Auth | express-session, bcryptjs |
| Build Tool | Vite |

## Features

- **Pomodoro Timer** — Three preset modes (25 min Focus, 5 min Short Break, 15 min Long Break) with custom time support, start/pause/reset controls, and audio notification on completion.
- **Task Management** — Full CRUD with inline editing, completion toggle, and per-task pomodoro count tracking (🍅).
- **Authentication** — Secure session-based auth with bcrypt password hashing, registration, login/logout, and protected routes.
- **Profile Management** — Update username, change password, and delete account with password confirmation.
- **Dual Storage** — Authenticated users sync tasks to MongoDB; guests use localStorage as fallback.
- **Responsive Design** — Mobile-first layout with hamburger navigation and adaptive controls across all screen sizes.

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (local or Atlas)

### Installation

1. **Clone the repo**
   ```bash
   git clone https://github.com/JibinBiju50/pomodoro-tracker.git
   cd pomodoro-tracker
   ```

2. **Setup backend**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in `/backend`:
   ```
   MONGODB_URI=your_mongodb_connection_string
   SECRET_SESSION=your_session_secret
   ```

3. **Setup frontend**
   ```bash
   cd ../frontend
   npm install
   ```

### Run the App

```bash
# Terminal 1 — Backend (port 3000)
cd backend
npm run dev

# Terminal 2 — Frontend (port 5173)
cd frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

