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
export default Feedback;