import React, { useState, useRef, useEffect } from "react";

export default function Timer() {
  const [mode, setMode] = useState("pomodoro"); 
  const [customMin, setCustomMin] = useState(25)
  const [customSec, setCustomSec] = useState(0)
  const [timeLeft, setTimeLeft] = useState(customMin * 25); 
  const [isRunning, setIsRunning] = useState(false);
  const [showCustomInput, setShowCustomInput] = useState(false)
  const Ref = useRef(null);

  // Mode times
  const times = {
    pomodoro: 1500,
    shortBreak: 300,
    longBreak: 900,
  };
  
  //Sets time
  const setTime = (e) =>{
    const totalSec = Number(customMin * 60) + Number(customSec)
    setTimeLeft(totalSec)
  }

  // Start timer
  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
      Ref.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(Ref.current);
            setIsRunning(false);
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

  // Reset timer
  const resetTimer = () => {
    clearInterval(Ref.current);
    setIsRunning(false);
    setTimeLeft(times[mode]);
  };

  // Change mode
  const changeMode = (newMode) => {
    setMode(newMode);
    setTimeLeft(times[newMode]);
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
    <div className="flex flex-col items-center justify-center bg-gray-700 text-white gap-8 w-100 mt-8">
      <h1 className="text-4xl font-bold">Pomodoro Timer</h1>

      {/* Mode Buttons */}
      <div className="flex gap- bg-gray-500 rounded-lg">
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
        <div className="flex items-center gap-2 mb-4">
        <input
          type="number"
          min="0"
          value={customMin}
          onChange={(e) => setCustomMin(e.target.value)}
          className="w-30 text-6xl font-mono bg-gray-800 rounded-md p-4 shadow-3xl"
        />
        <span className="text-2xl">:</span>
        <input
          type="number"
          min="0"
          max="59"
          value={customSec}
          onChange={(e) => setCustomSec(e.target.value)}
          className="w-30 text-6xl font-mono bg-gray-800 rounded-md p-4 shadow-3xl"
        />
        <button
      onClick={setTime}
      className="ml-4 px-4 py-2 bg-gray-500 rounded hover:brightness-110">
      Set
    </button>
      </div>) : 
      (<div className="text-6xl font-mono bg-gray-800 rounded-md p-4 shadow-3xl">{formatTime(timeLeft)}</div>)}

      {/* Control Buttons */}
      <div className="flex gap-4">
        {!isRunning ? (
          <button onClick={startTimer} className="px-6 py-2 bg-green-500 rounded hover:brightness-110">
            Start
          </button>
        ) : (
          <button onClick={pauseTimer} className="px-6 py-2 bg-yellow-500 rounded hover:brightness-110">
            Pause
          </button>
        )}
        <button onClick={resetTimer} className="px-6 py-2 bg-gray-500 rounded hover:brightness-110">
          Reset
        </button>
        <button onClick={() => setShowCustomInput((prev) => !prev)} className="px-6 py-2 bg-gray-500 rounded hover:brightness-110">{showCustomInput ? "Hide Custom Time" : "Customize Time"}</button>
      </div>
    </div>
  );
}
