import React, { useState, useEffect } from "react";
import "./App.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { MdOutlineModeNight } from "react-icons/md";
import { WiDaySunny } from "react-icons/wi";

function App() {
  const [newTask, setNewTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("All");
  const [editTaskText, setEditTaskText] = useState("");
  const [editTaskId, setEditTaskId] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks"));
    const savedMode = localStorage.getItem("darkMode");

    if (savedTasks) {
      setTasks(savedTasks);
    }

    if (savedMode === "true") {
      setIsDarkMode(true);
    }

    // const handleStorageChange = (event) => {
    //   if (event.key === 'tasks') {
    //     const updatedTasks = JSON.parse(event.newValue);
    //     setTasks(updatedTasks);
    //   }
    //   if (event.key === 'darkMode') {
    //     const updatedDarkMode = JSON.parse(event.newValue);
    //     setIsDarkMode(updatedDarkMode);
    //   }
    // };

    // window.addEventListener('storage', handleStorageChange);

    
    // return () => {
    //   window.removeEventListener('storage', handleStorageChange);
    // };
  }, []);

  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    } else {
      localStorage.removeItem("tasks");
    }
    localStorage.setItem("darkMode", isDarkMode);
    
  }, [tasks, isDarkMode]);

  const addTask = () => {
    if (newTask.trim() === "") {
      setNewTask("");
      return; //Checking the empty input validation
    }

    //method to add NewTask
    const newTaskItem = {
      id: Date.now(),
      text: newTask,
      completed: false,
    };
    setTasks([...tasks, newTaskItem]);
    setNewTask("");
  };

  //save the task again after performing edit on it
  const saveTask = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, text: editTaskText } : task
      )
    );
    setEditTaskId(null);
  };

  //Toggling between marking as complete or not complete
  const toggle = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  //Method to delete task
  const deleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "All") return true;
    if (filter === "Active") return !task.completed;
    if (filter === "Completed") return task.completed;
    return true;
  });

  const editTask = (taskId, text) => {
    setEditTaskId(taskId);
    setEditTaskText(text);
  };

  //function to toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={isDarkMode ? "dark-mode" : "App"}>
      <header>
        <button onClick={toggleDarkMode}>
          {/* {isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"} */}
          {isDarkMode?(<WiDaySunny className="icon"/>):(<MdOutlineModeNight className="icon"/>)}
        </button>
      </header>

      <div
        className={isDarkMode ? "task-container-dark-mode" : "task-container"}
      >
        <h1>Add Your List here</h1>

        <div className="input-task-container">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Enter new task"
            className="task-input"
          />
          <button onClick={addTask} className="add-task-button">
            Add Task
          </button>
        </div>

        {/* Filtering */}
        {tasks.length > 0 && (
          <div className="filter-container">
            <i className="fas fa-hourglass-start filter-icon"></i>
            <span className="filter-label">Filter:</span>
            <button className="filter-button" onClick={() => setFilter("All")}>
              All
            </button>
            <button
              className="filter-button"
              onClick={() => setFilter("Active")}
            >
              Active
            </button>
            <button
              className="filter-button"
              onClick={() => setFilter("Completed")}
            >
              Completed
            </button>
          </div>
        )}
      </div>

      <table>
        {filteredTasks.length > 0 && (
          <thead>
            <tr>
              <th>S.No</th>
              <th>Task</th>
              <th>Status</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
        )}
        <tbody>
          {filteredTasks.map((task, index) => (
            <tr key={task.id}>
              <td className={isDarkMode ? "index-dark" : "index"} data-label="S.No">
                {index + 1}
              </td>

              {/* edit functionality */}
              <td style={{ width: "50%" }} data-label="Task">
                {editTaskId === task.id ? (
                  <div>
                    <input
                      type="text"
                      value={editTaskText}
                      onChange={(e) => setEditTaskText(e.target.value)}
                    />
                    <button onClick={() => saveTask(task.id)}>Save</button>
                  </div>
                ) : (
                  <span
                    onClick={() => toggle(task.id)}
                    style={{
                      textDecoration: task.completed ? "line-through" : "",
                      color: task.completed ? "green" : "red",
                      cursor: "pointer",
                    }}
                  >
                    {task.text}
                  </span>
                )}
              </td>

              {/* toggle */}
              <td>
                <button
                  onClick={() => toggle(task.id)} data-label="Status"
                  style={{
                    backgroundColor: "blue",
                    color: "white",
                    width: "250px",
                  }}
                >
                  {task.completed
                    ? "Mark as not completed"
                    : "Mark as completed"}
                </button>
              </td>

              {/* Edit button */}
              <td>
                <button
                  onClick={() => editTask(task.id, task.text)}
                  style={{ backgroundColor: "#737373" }}
                  data-label="Edit"
                >
                  Edit
                </button>
              </td>

              {/* Delete button */}
              <td>
                <button
                  onClick={() => deleteTask(task.id)}
                  style={{ backgroundColor: "red", color: "white" }}
                  data-label="Delete"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
