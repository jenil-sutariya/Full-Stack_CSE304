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
export default RealTimeVoting;