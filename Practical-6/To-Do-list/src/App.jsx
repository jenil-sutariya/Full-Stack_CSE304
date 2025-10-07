import React, { useState, useEffect } from "react";
import "./App.css";
import { FaEdit, FaTrash } from "react-icons/fa";

const API_BASE_URL = 'http://localhost:3001/api';

function App() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch tasks from backend
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/tasks`);
      const data = await response.json();
      if (data.success) {
        setTasks(data.tasks);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async () => {
    if (task.trim() === "") return;

    try {
      setLoading(true);
      
      if (editId !== null) {
        // Update existing task
        const response = await fetch(`${API_BASE_URL}/tasks/${editId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text: task }),
        });
        
        const data = await response.json();
        if (data.success) {
          setTasks(tasks.map(t => t.id === editId ? data.task : t));
          setEditId(null);
        }
      } else {
        // Add new task
        const response = await fetch(`${API_BASE_URL}/tasks`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text: task }),
        });
        
        const data = await response.json();
        if (data.success) {
          setTasks([...tasks, data.task]);
        }
      }
      
      setTask("");
    } catch (error) {
      console.error('Error saving task:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (taskId) => {
    const taskToEdit = tasks.find(t => t.id === taskId);
    setTask(taskToEdit.text);
    setEditId(taskId);
  };

  const handleDelete = async (taskId) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      if (data.success) {
        setTasks(tasks.filter(t => t.id !== taskId));
        if (editId === taskId) {
          setTask("");
          setEditId(null);
        }
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleComplete = async (taskId) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: !task.completed }),
      });
      
      const data = await response.json();
      if (data.success) {
        setTasks(tasks.map(t => t.id === taskId ? data.task : t));
      }
    } catch (error) {
      console.error('Error updating task:', error);
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
          disabled={loading}
        />
        <button onClick={handleAddTask} disabled={loading}>
          {loading ? "..." : editId !== null ? "Update" : "Add Task"}
        </button>
      </div>
      <div className="task-list">
        {tasks.map((t) => (
          <div key={t.id} className={`task ${t.completed ? 'completed' : ''}`}>
            <span 
              onClick={() => toggleComplete(t.id)}
              style={{ cursor: 'pointer', textDecoration: t.completed ? 'line-through' : 'none' }}
            >
              {t.text}
            </span>
            <div className="actions">
              <FaEdit onClick={() => handleEdit(t.id)} className="icon edit" />
              <FaTrash
                onClick={() => handleDelete(t.id)}
                className="icon delete"
              />
            </div>
          </div>
        ))}
        {tasks.length === 0 && !loading && (
          <p style={{ textAlign: 'center', color: '#666', marginTop: '20px' }}>
            No tasks yet. Add one above!
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
