const express = require('express');
const cors = require('cors');
const path = require('path');
const { Server } = require('socket.io');
const http = require('http');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// In-memory storage for feedback data
let feedbackData = {
  excellent: 0,
  good: 0,
  average: 0,
  poor: 0
};

let participantCount = 0;
let userVotes = new Map(); // Track individual user votes

// Simulate real-time voting from other participants
setInterval(() => {
  const feedbackTypes = ['excellent', 'good', 'average', 'poor'];
  const randomType = feedbackTypes[Math.floor(Math.random() * feedbackTypes.length)];
  feedbackData[randomType]++;
  
  // Emit real-time update to all connected clients
  io.emit('feedbackUpdate', {
    type: 'simulated',
    feedbackData: feedbackData,
    participantCount: participantCount
  });
}, 2000); // Every 2 seconds

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  // Send current feedback data to newly connected user
  socket.emit('feedbackData', {
    feedbackData: feedbackData,
    participantCount: participantCount
  });

  // Handle user feedback submission
  socket.on('submitFeedback', (data) => {
    const { feedbackType, userId } = data;
    
    // Check if user already voted
    if (userVotes.has(userId)) {
      const previousVote = userVotes.get(userId);
      feedbackData[previousVote]--; // Remove previous vote
    }
    
    // Add new vote
    feedbackData[feedbackType]++;
    userVotes.set(userId, feedbackType);
    
    // Emit update to all clients
    io.emit('feedbackUpdate', {
      type: 'user',
      feedbackData: feedbackData,
      participantCount: participantCount,
      userId: userId,
      feedbackType: feedbackType
    });
  });

  // Handle participant count updates
  socket.on('updateParticipantCount', (data) => {
    participantCount = Math.max(0, participantCount + data.change);
    
    io.emit('participantCountUpdate', {
      participantCount: participantCount
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// API Routes
app.get('/api/feedback', (req, res) => {
  res.json({
    success: true,
    feedbackData: feedbackData,
    participantCount: participantCount
  });
});

app.post('/api/feedback', (req, res) => {
  const { feedbackType, userId } = req.body;
  
  if (!feedbackType || !userId) {
    return res.status(400).json({
      success: false,
      error: 'Feedback type and user ID are required'
    });
  }

  const validTypes = ['excellent', 'good', 'average', 'poor'];
  if (!validTypes.includes(feedbackType)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid feedback type'
    });
  }

  // Check if user already voted
  if (userVotes.has(userId)) {
    const previousVote = userVotes.get(userId);
    feedbackData[previousVote]--; // Remove previous vote
  }
  
  // Add new vote
  feedbackData[feedbackType]++;
  userVotes.set(userId, feedbackType);

  res.json({
    success: true,
    feedbackData: feedbackData,
    participantCount: participantCount
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
server.listen(PORT, () => {
  console.log(`📊 Feedback Dashboard Backend running on http://localhost:${PORT}`);
  console.log(`🔌 WebSocket server ready for real-time updates`);
  console.log(`📈 API endpoints available at http://localhost:${PORT}/api/feedback`);
});
