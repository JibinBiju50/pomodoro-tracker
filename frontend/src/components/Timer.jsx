import React, { useState, useRef, useEffect, useCallback } from "react";
import { taskService, authService } from "../service/service";

const TIMER_MODES = {
  pomodoro: 1500,
  shortBreak: 300,
  longBreak: 900,
};

export default function Timer() {
  const [mode, setMode] = useState("pomodoro"); 
  const [customMin, setCustomMin] = useState(25);
  const [customSec, setCustomSec] = useState(0);
  const [timeLeft, setTimeLeft] = useState(25 * 60); 
  const [isRunning, setIsRunning] = useState(false);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const Ref = useRef(null);

  // Task selection
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pomodoroCompleted, setPomodoroCompleted] = useState(false);
  // Reset timer
  const resetTimer = useCallback(() => {
    clearInterval(Ref.current);
    setIsRunning(false);
    setTimeLeft(TIMER_MODES[mode]);
  }, [mode]);
  
  // Fetch tasks on mount
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const authData = await authService.getAuthStatus();
        setIsAuthenticated(authData.isAuthenticated);
        
        if (authData.isAuthenticated) {
          const data = await taskService.getTasks();
          setTasks(data.tasks.filter(t => !t.completed));
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchTasks();

    // Listen for logout event to reset timer and tasks
    const handleLogoutReset = () => {
      resetTimer();
      setTasks([]);
      setSelectedTask(null);
    };
    window.addEventListener('user-logged-out', handleLogoutReset);
    return () => {
      window.removeEventListener('user-logged-out', handleLogoutReset);
    };
  }, [resetTimer]);

  // Sets time
  const setTime = () => {
    const totalSec = Number(customMin * 60) + Number(customSec);
    setTimeLeft(totalSec);
  };

  // Handle timer completion
  const handleTimerComplete = async () => {
    if (mode === "pomodoro" && selectedTask && isAuthenticated) {
      try {
        const data = await taskService.addPomodoro(selectedTask._id);
        // Update local task state
        setTasks(prev => prev.map(t => 
          t._id === selectedTask._id ? data.task : t
        ));
        setSelectedTask(data.task);
        setPomodoroCompleted(true);
        setTimeout(() => setPomodoroCompleted(false), 3000);
      } catch (err) {
        console.error(err);
      }
    }
    
    // Play sound notification
    playNotificationSound();
  };

  // Simple notification sound
  const playNotificationSound = () => {
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleym7NNHTqXVBAABXsOPkiwQA');
    audio.play().catch(() => {});
  };

  // Start timer
  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
      Ref.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(Ref.current);
            setIsRunning(false);
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  // Pause timer
  const pauseTimer = () => {
    clearInterval(Ref.current);
    setIsRunning(false);
  };



  // Change mode
  const changeMode = (newMode) => {
    setMode(newMode);
    setTimeLeft(TIMER_MODES[newMode]);
    clearInterval(Ref.current);
    setIsRunning(false);
  };

  // Clear interval on unmount
  useEffect(() => {
    return () => clearInterval(Ref.current);
  }, []);

  // Format time
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m < 10 ? "0" + m : m}:${s < 10 ? "0" + s : s}`;
  };

  // Button style helper
  const getButtonClasses = (btnMode) => {
    const isSelected = mode === btnMode;
    return `
      px-4 py-2 rounded transition-all duration-300 text-xl
      ${isSelected ? "bg-gray-800 " : "bg-transparent hover:bg-gray-800"}
    `;
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-700 text-white gap-6 md:gap-8 w-full px-2 sm:px-4 md:px-8 lg:px-16 xl:px-32 mt-6 md:mt-8">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center">Pomodoro Timer</h1>

      {/* Task Selection */}
      {isAuthenticated && tasks.length > 0 && (
        <div className="w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto">
          <label className="text-gray-300 text-sm font-medium mb-2 block">Working on:</label>
          <select
            value={selectedTask?._id || ""}
            onChange={(e) => {
              const task = tasks.find(t => t._id === e.target.value);
              setSelectedTask(task || null);
            }}
            className="w-full p-2 sm:p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:border-green-500 focus:outline-none cursor-pointer text-base sm:text-lg"
          >
            <option value="">Select a task...</option>
            {tasks.map(task => (
              <option key={task._id} value={task._id}>
                {task.title} {task.pomodorosSpent > 0 ? `(🍅 ${task.pomodorosSpent})` : ''}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Selected Task Display */}
      {selectedTask && (
        <div className="bg-gray-800 px-2 sm:px-4 py-2 rounded-lg flex flex-wrap items-center gap-2">
          <span className="text-green-400">📌</span>
          <span className="font-medium">{selectedTask.title}</span>
          <span className="text-red-400 text-sm">🍅 {selectedTask.pomodorosSpent}</span>
        </div>
      )}

      {/* Pomodoro Completed Notification */}
      {pomodoroCompleted && (
        <div className="bg-green-500/20 border border-green-500 text-green-400 px-2 sm:px-4 py-2 rounded-lg animate-pulse text-center text-sm sm:text-base">
          🍅 Pomodoro completed! +1 added to task
        </div>
      )}

      {/* Mode Buttons */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 bg-gray-500 rounded-lg w-full max-w-[220px] sm:max-w-sm md:max-w-md mx-auto">
        <button onClick={() => changeMode("pomodoro")} className={getButtonClasses("pomodoro")}>
          Pomodoro
        </button>
        <button onClick={() => changeMode("shortBreak")} className={getButtonClasses("shortBreak")}>
          Short Break
        </button>
        <button onClick={() => changeMode("longBreak")} className={getButtonClasses("longBreak")}>
          Long Break
        </button>
      </div>
      

      {/* Timer Display */}
      {showCustomInput ? (
        <div className="flex flex-row flex-wrap items-center gap-2 mb-4 w-full max-w-[220px] sm:max-w-sm md:max-w-md mx-auto">
        <input
          type="number"
          min="0"
          value={customMin}
          onChange={(e) => setCustomMin(e.target.value)}
          className="w-14 sm:w-28 text-2xl sm:text-5xl md:text-6xl font-mono bg-gray-800 rounded-md p-2 sm:p-4 shadow-3xl"
        />
        <span className="text-2xl">:</span>
        <input
          type="number"
          min="0"
          max="59"
          value={customSec}
          onChange={(e) => setCustomSec(e.target.value)}
          className="w-14 sm:w-28 text-2xl sm:text-5xl md:text-6xl font-mono bg-gray-800 rounded-md p-2 sm:p-4 shadow-3xl"
        />
        <button
      onClick={setTime}
      className="ml-4 px-4 py-2 bg-gray-500 rounded hover:brightness-110">
      Set
    </button>
      </div>) : 
      (<div className="text-2xl sm:text-5xl md:text-6xl font-mono bg-gray-800 rounded-md p-2 sm:p-4 shadow-3xl w-full max-w-[220px] sm:max-w-sm md:max-w-md mx-auto text-center">{formatTime(timeLeft)}</div>)}

      {/* Control Buttons */}
      <div className="flex flex-row gap-2 w-full max-w-[220px] sm:hidden mx-auto mt-2">
        {!isRunning ? (
          <button onClick={startTimer} className="px-3 py-2 bg-green-500 rounded hover:brightness-110 w-1/2">Start</button>
        ) : (
          <button onClick={pauseTimer} className="px-3 py-2 bg-yellow-500 rounded hover:brightness-110 w-1/2">Pause</button>
        )}
        <button onClick={resetTimer} className="px-3 py-2 bg-gray-500 rounded hover:brightness-110 w-1/2">Reset</button>
      </div>
      {/* Show customize button below for mobile */}
      <div className="flex w-full max-w-[220px] sm:hidden mx-auto mt-2">
        <button onClick={() => setShowCustomInput((prev) => !prev)} className="px-3 py-2 bg-gray-500 rounded hover:brightness-110 w-full">{showCustomInput ? "Hide Custom Time" : "Customize Time"}</button>
      </div>
      {/* For larger screens, keep previous layout */}
      <div className="hidden sm:flex flex-row gap-4 w-full max-w-sm md:max-w-md mx-auto mt-2">
        {!isRunning ? (
          <button onClick={startTimer} className="px-6 py-2 bg-green-500 rounded hover:brightness-110 w-auto">Start</button>
        ) : (
          <button onClick={pauseTimer} className="px-6 py-2 bg-yellow-500 rounded hover:brightness-110 w-auto">Pause</button>
        )}
        <button onClick={resetTimer} className="px-6 py-2 bg-gray-500 rounded hover:brightness-110 w-auto">Reset</button>
        <button onClick={() => setShowCustomInput((prev) => !prev)} className="px-6 py-2 bg-gray-500 rounded hover:brightness-110 w-auto">{showCustomInput ? "Hide Custom Time" : "Customize Time"}</button>
      </div>
    </div>
  );
}
