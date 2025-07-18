import React, { useState } from "react";
import "./App.css";
import { FaEdit, FaTrash } from "react-icons/fa";

function App() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [editId, setEditId] = useState(null);

  const handleAddTask = () => {
    if (task.trim() === "") return;

    if (editId !== null) {
      const updatedTasks = tasks.map((t, i) => (i === editId ? task : t));
      setTasks(updatedTasks);
      setEditId(null);
    } else {
      setTasks([...tasks, task]);
    }

    setTask("");
  };

  const handleEdit = (index) => {
    setTask(tasks[index]);
    setEditId(index);
  };

  const handleDelete = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
    if (editId === index) {
      setTask("");
      setEditId(null);
    }
  };

  return (
    <div className="container">
      <h2>Get Things Done !</h2>
      <div className="input-section">
        <input
          type="text"
          placeholder="What is the task today?"
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <button onClick={handleAddTask}>
          {editId !== null ? "Update" : "Add Task"}
        </button>
      </div>
      <div className="task-list">
        {tasks.map((t, i) => (
          <div key={i} className="task">
            <span>{t}</span>
            <div className="actions">
              <FaEdit onClick={() => handleEdit(i)} className="icon edit" />
              <FaTrash
                onClick={() => handleDelete(i)}
                className="icon delete"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
