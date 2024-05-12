// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import axios from "axios";

function App() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(`http://localhost:5173/`);
    setSocket(newSocket);
    fetchTasks();

    return () => newSocket.close();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:5173/tasks");
      if (response.data.success) {
        setTasks(response.data.tasks);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleAddTask = () => {
    if (task.trim() !== "" && socket) {
      socket.emit("add", task);
      setTasks((prevTasks) => [...prevTasks, task]);
      setTask("");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white-200">
      <div className="bg-white rounded shadow p-6 m-4 w-full lg:w-3/4 lg:max-w-lg">
        <div className="mb-4">
          <h1 className="text-black font-bold text-center text-4xl mb-4">
            Note App
          </h1>
          
          <div className="flex mt-4">
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 mr-4 text-grey-darker"
              type="text"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              onKeyPress={(e) => (e.key === "Enter" ? handleAddTask() : null)}
              placeholder="New Note...."
            />
            <button
              className="flex-no-shrink p-2 border-2 rounded text-teal-500 border-teal-500 hover:bg-teal-500 hover:text-white"
              onClick={handleAddTask}
            >
              Add Task
            </button>
          </div>
          <ul>
            {tasks.map((t, index) => (
              <><li key={index}>{t}</li><hr></hr></>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
