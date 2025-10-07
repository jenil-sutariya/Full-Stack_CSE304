<<<<<<< HEAD
import React, { useState, useEffect } from 'react';

function RealTimeVoting() {
  const [feedback, setFeedback] = useState({
    excellent: 0,
    good: 0,
    average: 0,
    poor: 0,
  });

  useEffect(() => {
    const timerId = setInterval(() => {
      const options = ['excellent', 'good', 'average', 'poor'];
      const randomOption = options[Math.floor(Math.random() * options.length)];
      setFeedback((prevFeedback) => ({
        ...prevFeedback,
        [randomOption]: prevFeedback[randomOption] + 1,
      }));
    }, 2000);

    return () => clearInterval(timerId);
  }, []);

  return (
    <div className="real-time-voting">
      <h2>Real-Time Feedback Voting Panel</h2>
      <div className="results">
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

function RealTimeVoting() {
  const [feedback, setFeedback] = useState({
    excellent: 0,
    good: 0,
    average: 0,
    poor: 0,
  });
  const [participantCount, setParticipantCount] = useState(0);

  useEffect(() => {
    // Listen for real-time feedback updates from server
    socket.on('feedbackUpdate', (data) => {
      setFeedback(data.feedbackData);
      setParticipantCount(data.participantCount);
    });

    // Listen for initial feedback data
    socket.on('feedbackData', (data) => {
      setFeedback(data.feedbackData);
      setParticipantCount(data.participantCount);
    });

    // Listen for participant count updates
    socket.on('participantCountUpdate', (data) => {
      setParticipantCount(data.participantCount);
    });

    return () => {
      socket.off('feedbackUpdate');
      socket.off('feedbackData');
      socket.off('participantCountUpdate');
    };
  }, []);

  return (
    <div className="real-time-voting">
      <h2>Real-Time Feedback Voting Panel</h2>
      <p className="participant-count">Active Participants: {participantCount}</p>
      <div className="results">
        <p>Excellent: {feedback.excellent}</p>
        <p>Good: {feedback.good}</p>
        <p>Average: {feedback.average}</p>
        <p>Poor: {feedback.poor}</p>
      </div>
      <div className="total-votes">
        <p>Total Votes: {feedback.excellent + feedback.good + feedback.average + feedback.poor}</p>
      </div>
    </div>
  );
}
>>>>>>> 1b66281 (chore: add Full-Stack folder and commit current changes)
export default RealTimeVoting;