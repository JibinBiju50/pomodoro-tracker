# Pomodoro Timer & Task Manager

A frontend-only web application for implementing the Pomodoro Technique with integrated task management. Timer and task data persist in browser localStorage.

## Tech Stack

- **React** 19.1.1
- **Vite** 7.1.0
- **Tailwind CSS** 4.1.11
- **ESLint** 9.32.0

## Features

- **Timer modes**: Pomodoro (25 min), Short Break (5 min), Long Break (15 min)
- **Custom timer duration**: Set custom minutes and seconds
- **Timer controls**: Start, pause, and reset
- **Task management**: Add and remove tasks
- **Task persistence**: Tasks saved to browser localStorage
- **Task completion**: Checkbox to mark tasks as complete

## Local Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

4. Preview production build:
```bash
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Timer.jsx      # Pomodoro timer component
│   │   └── Task.jsx       # Task management component
│   ├── pages/
│   │   └── Home.jsx       # Main page layout
│   ├── css/
│   │   └── timer.css      # Timer-specific styles
│   ├── App.jsx            # Root component
│   └── main.jsx           # Application entry point
├── public/                # Static assets
├── package.json
└── vite.config.js
```

## Author

[Jibin Biju]
