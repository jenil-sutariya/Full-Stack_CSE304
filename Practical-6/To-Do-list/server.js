const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// In-memory storage (in production, use a database)
let tasks = [
  { id: 1, text: 'Learn React', completed: false, createdAt: new Date() },
  { id: 2, text: 'Build a todo app', completed: true, createdAt: new Date() },
  { id: 3, text: 'Deploy to production', completed: false, createdAt: new Date() }
];

let nextId = 4;

// API Routes
app.get('/api/tasks', (req, res) => {
  res.json({
    success: true,
    tasks: tasks
  });
});

app.post('/api/tasks', (req, res) => {
  const { text } = req.body;
  
  if (!text || text.trim() === '') {
    return res.status(400).json({
      success: false,
      error: 'Task text is required'
    });
  }

  const newTask = {
    id: nextId++,
    text: text.trim(),
    completed: false,
    createdAt: new Date()
  };

  tasks.push(newTask);
  
  res.status(201).json({
    success: true,
    task: newTask
  });
});

app.put('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { text, completed } = req.body;
  
  const taskIndex = tasks.findIndex(task => task.id === parseInt(id));
  
  if (taskIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Task not found'
    });
  }

  if (text !== undefined) {
    tasks[taskIndex].text = text.trim();
  }
  
  if (completed !== undefined) {
    tasks[taskIndex].completed = completed;
  }

  res.json({
    success: true,
    task: tasks[taskIndex]
  });
});

app.delete('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  
  const taskIndex = tasks.findIndex(task => task.id === parseInt(id));
  
  if (taskIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Task not found'
    });
  }

  const deletedTask = tasks.splice(taskIndex, 1)[0];
  
  res.json({
    success: true,
    task: deletedTask
  });
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Something went wrong!'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`📝 To-Do List Backend running on http://localhost:${PORT}`);
  console.log(`📊 API endpoints available at http://localhost:${PORT}/api/tasks`);
});
