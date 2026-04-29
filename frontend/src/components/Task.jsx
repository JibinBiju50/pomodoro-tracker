import React, { useEffect, useState } from "react";
import { taskService, authService } from "../service/service";

export default function Task() {
  const [task, setTask] = useState("");
  const [allTask, setAllTask] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  // Check auth and fetch tasks
  useEffect(() => {
    const init = async () => {
      try {
        const authData = await authService.getAuthStatus();
        setIsAuthenticated(authData.isAuthenticated);
        
        if (authData.isAuthenticated) {
          const data = await taskService.getTasks();
          setAllTask(data.tasks);
        } else {
          // Use localStorage for non-authenticated users
          const savedTasks = localStorage.getItem("allTask");
          setAllTask(savedTasks ? JSON.parse(savedTasks) : []);
        }
      } catch (err) {
        console.error(err);
        const savedTasks = localStorage.getItem("allTask");
        setAllTask(savedTasks ? JSON.parse(savedTasks) : []);
      } finally {
        setLoading(false);
      }
    };
    init();

    // Listen for logout event to reset tasks
    const handleLogoutReset = () => {
      setAllTask([]);
      localStorage.removeItem("allTask");
    };
    window.addEventListener('user-logged-out', handleLogoutReset);
    return () => {
      window.removeEventListener('user-logged-out', handleLogoutReset);
    };
  }, []);

  // Save to localStorage for non-authenticated users
  useEffect(() => {
    if (!isAuthenticated && !loading) {
      localStorage.setItem('allTask', JSON.stringify(allTask));
    }
  }, [allTask, isAuthenticated, loading]);

  // Handle task submission
  const handleSubmit = async () => {
    if (task.trim() === "") return;

    try {
      if (isAuthenticated) {
        const data = await taskService.createTask(task);
        setAllTask(prev => [data.task, ...prev]);
      } else {
        setAllTask(prev => [...prev, { title: task, completed: false, _id: Date.now() }]);
      }
      setTask("");
    } catch (err) {
      console.error(err);
    }
  };

  // Handle key press (Enter to submit)
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  // Remove task
  const removeTask = async (id, index) => {
    try {
      if (isAuthenticated) {
        await taskService.deleteTask(id);
        setAllTask(prev => prev.filter(t => t._id !== id));
      } else {
        setAllTask(prev => prev.filter((_, i) => i !== index));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle task completion
  const toggleComplete = async (id, index, currentStatus) => {
    try {
      if (isAuthenticated) {
        const data = await taskService.updateTask(id, { completed: !currentStatus });
        setAllTask(prev => prev.map(t => t._id === id ? data.task : t));
      } else {
        setAllTask(prev => prev.map((t, i) => 
          i === index ? { ...t, completed: !t.completed } : t
        ));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Start editing
  const startEdit = (id, title) => {
    setEditingId(id);
    setEditText(title);
  };

  // Save edit
  const saveEdit = async (id, index) => {
    if (editText.trim() === "") return;

    try {
      if (isAuthenticated) {
        const data = await taskService.updateTask(id, { title: editText });
        setAllTask(prev => prev.map(t => t._id === id ? data.task : t));
      } else {
        setAllTask(prev => prev.map((t, i) => 
          i === index ? { ...t, title: editText } : t
        ));
      }
      setEditingId(null);
      setEditText("");
    } catch (err) {
      console.error(err);
    }
  };

  // Cancel edit
  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  if (loading) {
    return (
      <div className="w-100 flex flex-col justify-center items-center">
        <p className="text-white text-xl">Loading tasks...</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col justify-center items-center px-2 sm:px-4 md:px-8 lg:px-16 xl:px-32 py-4">
      {/* Task entering field */}
      <h1 className="text-xl sm:text-2xl text-white font-bold mb-4 sm:mb-6 text-center">Add Tasks</h1>
      <div className="flex flex-col sm:flex-row w-full max-w-xs sm:max-w-sm md:max-w-md gap-2 sm:gap-4 mx-auto">
        <input 
          type="text" 
          placeholder="Enter the task" 
          className="font-semibold text-base sm:text-lg md:text-2xl bg-gray-200 rounded-md p-2 sm:p-3 shadow-2xl outline-none w-full"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button 
          className="px-2 py-2 sm:py-0 cursor-pointer hover:scale-110 transition-transform w-full sm:w-auto flex-shrink-0" 
          onClick={handleSubmit}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M8 12h8"></path>
            <path d="M12 8v8"></path>
          </svg>
        </button>
      </div>

      {/* Auth status hint */}
      {!isAuthenticated && (
        <p className="text-gray-400 text-xs sm:text-sm mt-2 text-center">
          Login to sync tasks across devices
        </p>
      )}
       
      {/* Task Displaying Field */}
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md min-h-[100px] mt-4 sm:mt-6 border-none rounded-lg bg-gray-800 p-4 sm:p-6 mb-4 mx-auto">
        {allTask.length === 0 ? (
          <p className="text-gray-400 text-center">No tasks yet. Add one above!</p>
        ) : (
          <ul className="flex flex-col justify-between gap-2 sm:gap-3">
            {allTask.map((item, index) => (
              <li 
                key={item._id || index} 
                className={`text-base sm:text-lg md:text-xl text-white font-bold flex flex-row gap-2 sm:gap-4 justify-between items-center p-2 rounded-lg hover:bg-gray-700 transition-colors ${item.completed ? 'opacity-60' : ''}`}
              >
                {editingId === item._id ? (
                  // Edit mode
                  <div className="flex flex-row gap-2 flex-1 w-full">
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="flex-1 p-2 rounded bg-gray-600 text-white outline-none text-base sm:text-lg"
                      autoFocus
                    />
                    <button onClick={() => saveEdit(item._id, index)} className="text-green-400 hover:text-green-300">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </button>
                    <button onClick={cancelEdit} className="text-red-400 hover:text-red-300">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </div>
                ) : (
                  // View mode
                  <>
                    <span className={`flex-1 ${item.completed ? 'line-through text-gray-400' : ''} text-base sm:text-lg`}> 
                      {item.title || item}
                    </span>
                    {isAuthenticated && item.pomodorosSpent > 0 && (
                      <span className="text-xs sm:text-sm text-red-400 mr-2">
                        🍅 {item.pomodorosSpent}
                      </span>
                    )}
                    <div className="flex flex-row gap-2 sm:gap-3 items-center mt-2 sm:mt-0">
                      {/* Edit button */}
                      <button 
                        onClick={() => startEdit(item._id, item.title || item)}
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </button>
                      {/* Checkbox */}
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 sm:w-5 sm:h-5 accent-green-500 cursor-pointer" 
                        checked={item.completed || false}
                        onChange={() => toggleComplete(item._id, index, item.completed)}
                      />
                      {/* Delete button */}
                      <button
                        onClick={() => removeTask(item._id, index)} 
                        className="cursor-pointer text-white hover:text-red-400 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M10 5a2 2 0 0 0-1.344.519l-6.328 5.74a1 1 0 0 0 0 1.481l6.328 5.741A2 2 0 0 0 10 19h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z"></path>
                          <path d="m12 9 6 6"></path>
                          <path d="m18 9-6 6"></path>
                        </svg>
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}