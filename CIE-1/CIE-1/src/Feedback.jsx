<<<<<<< HEAD
import React, { useState } from 'react';


function Feedback() {
  const [feedback, setFeedback] = useState({
    excellent: 0,
    good: 0,
    average: 0,
    poor: 0,
  });


  //NaN erroe

  const handleFeedback = (type) => {
    setFeedback((prevFeedback) => ({
      ...prevFeedback,
      [type]: prevFeedback[type] + 1,
    }))
  }
  return (
    <div className="feedback-panel">
      <h2>Feedback Voting Panel</h2>
      <div className="buttons">
        <button onClick={() => handleFeedback('excellent')}>Excellent</button>
        <button onClick={() => handleFeedback('good')}>Good</button>
        <button onClick={() => handleFeedback('average')}>Average</button>
        <button onClick={() => handleFeedback('poor')}>Poor</button>
      </div>
      <div className="results">
        <h3>Feedback Results:</h3>
        <p>Excellent: {feedback.excellent}</p>
        <p>Good: {feedback.good}</p>
        <p>Average: {feedback.average}</p>
        <p>Poor: {feedback.poor}</p>
      </div>
    </div>
  );
}
=======
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3002');

function Feedback() {
  const [feedback, setFeedback] = useState({
    excellent: 0,
    good: 0,
    average: 0,
    poor: 0,
  });
  const [userId] = useState(() => `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    // Listen for real-time feedback updates
    socket.on('feedbackUpdate', (data) => {
      setFeedback(data.feedbackData);
    });

    // Listen for initial feedback data
    socket.on('feedbackData', (data) => {
      setFeedback(data.feedbackData);
    });

    return () => {
      socket.off('feedbackUpdate');
      socket.off('feedbackData');
    };
  }, []);

  const handleFeedback = (type) => {
    // Send feedback to server via socket
    socket.emit('submitFeedback', {
      feedbackType: type,
      userId: userId
    });
  }
  return (
    <div className="feedback-panel">
      <h2>Feedback Voting Panel</h2>
      <div className="buttons">
        <button onClick={() => handleFeedback('excellent')}>Excellent</button>
        <button onClick={() => handleFeedback('good')}>Good</button>
        <button onClick={() => handleFeedback('average')}>Average</button>
        <button onClick={() => handleFeedback('poor')}>Poor</button>
      </div>
      <div className="results">
        <h3>Feedback Results:</h3>
        <p>Excellent: {feedback.excellent}</p>
        <p>Good: {feedback.good}</p>
        <p>Average: {feedback.average}</p>
        <p>Poor: {feedback.poor}</p>
      </div>
    </div>
  );
}
>>>>>>> 1b66281 (chore: add Full-Stack folder and commit current changes)
export default Feedback;