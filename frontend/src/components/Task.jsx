import React, { useEffect, useState } from "react";

export default function Task() {
  const [task, setTask] = useState("")
  
  const [allTask, setAllTask] = useState(()=> {
    const savedTasks = localStorage.getItem("allTask");
    const initialTasks = JSON.parse(savedTasks)
    return initialTasks || "";
  })
  
  //handle task submission
  const handleSubmit = (prev) => {
    if (task.trim() === "") return;
    setTask("")
    console.log(localStorage);
    
    setAllTask(prev => {
      return [...prev, task]
    })
  }
  
  // to remove task from array
  const removeTask = (index) => {
    setAllTask(prev => {return prev.filter((task, i) => i !== index)} 
    )
  }
  
  //add each task to local storage
  useEffect(() => {
        localStorage.setItem('allTask', JSON.stringify(allTask));
    }, [allTask]);

    return (
      
        <div className="w-100 flex flex-col justify-center items-center">
        {/* Task entering field */}
          <h1 className="text-2xl text-white font-bold mb-6">Add Tasks</h1>
          <div className="flex flex-row">
            <input type="text" 
            placeholder="Enter the task" 
            className="font-semibold text-2xl bg-gray-200 rounded-md p-3 shadow-2xl outline-none w-96"
            value={task}
            onChange={(e) => 
            setTask(e.target.value) 
            }/>
            <button 
            className="px-2 cursor-pointer" 
            onClick={handleSubmit}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M8 12h8"></path><path d="M12 8v8"></path></svg></button>
          </div>
           
           {/* Task Displaying Field */}
          <div className="w-2xl min-h-100 mt-6 border-none rounded-lg bg-gray-800 p-6 mb-4">
          <ul className="flex flex-col justify-between gap-2">
            {allTask.map((item, index) => <li key={index} className="text-xl text-white font-bold flex flex-row gap-2 justify-between">{item}
              <div className="flex flex-row gap-2">
                <input type="checkbox" className="w-4 accent-green-500" />
                <svg onClick={()=>removeTask(index)} className="cursor-pointer" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 5a2 2 0 0 0-1.344.519l-6.328 5.74a1 1 0 0 0 0 1.481l6.328 5.741A2 2 0 0 0 10 19h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z"></path><path d="m12 9 6 6"></path><path d="m18 9-6 6"></path></svg>
              </div>
            </li>)}
          </ul>

          </div>
        </div>
    )
}