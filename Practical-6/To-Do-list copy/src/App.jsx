import React, { useState } from "react";
import "./App.css";
import { FaEdit, FaTrash } from "react-icons/fa";

function App() {
  const [task, setTask] = useState("");
  const [endDate, setEndDate] = useState("");
  const [tasks, setTasks] = useState([]);
  const [editId, setEditId] = useState(null);

  const formatDate = (dateStr) => {
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  const today = new Date().toISOString().split("T")[0]; // format: yyyy-mm-dd

  const handleAddTask = () => {
    if (task.trim() === "" || endDate === "") return;

    const startDate = new Date().toLocaleDateString();

    if (editId !== null) {
      const updatedTasks = tasks.map((t, i) =>
        i === editId
          ? {
              ...t,
              text: task,
              endDate: formatDate(endDate),
              startDate: t.startDate,
            }
          : t
      );
      setTasks(updatedTasks);
      setEditId(null);
    } else {
      const newTask = {
        text: task,
        startDate,
        endDate: formatDate(endDate),
      };
      setTasks([...tasks, newTask]);
    }

    setTask("");
    setEndDate("");
  };

  const handleEdit = (index) => {
    const taskToEdit = tasks[index];
    setTask(taskToEdit.text);

    // Reformat dd/mm/yyyy back to yyyy-mm-dd to show in input
    const [day, month, year] = taskToEdit.endDate.split("/");
    setEndDate(`${year}-${month}-${day}`);

    setEditId(index);
  };

  const handleDelete = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
    if (editId === index) {
      setTask("");
      setEndDate("");
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
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          min={today}
        />
        <button onClick={handleAddTask}>
          {editId !== null ? "Update" : "Add Task"}
        </button>
      </div>
      <div className="task-list">
        {tasks.map((t, i) => (
          <div key={i} className="task">
            <div>
              <span>{t.text}</span>
              <p style={{ fontSize: "0.9rem", margin: "5px 0" }}>
                Start: {t.startDate} <br />
                End: {t.endDate}
              </p>
            </div>
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
