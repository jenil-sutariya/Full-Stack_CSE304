<<<<<<< HEAD
import React, { useState } from 'react';

function CounterPanel() {
  const [count, setCount] = useState(0);

  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  const reset = () => setCount(0);
  const incrementByFive = () => setCount(count + 5);

  return (
    <div className="counter-panel">
      <h2>Feedback Counter</h2>
      <p>Votes Submitted: {count}</p>
      <div className="buttons">
        <button onClick={increment}>Increment</button>
        <button onClick={decrement}>Decrement</button>
        <button onClick={reset}>Reset</button>
        <button onClick={incrementByFive}>Increment by 5</button>
      </div>
    </div>
  );
}
=======
import React, { useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3002');

function CounterPanel() {
  const [count, setCount] = useState(0);

  const increment = () => {
    const newCount = count + 1;
    setCount(newCount);
    socket.emit('updateParticipantCount', { change: 1 });
  };
  
  const decrement = () => {
    const newCount = Math.max(0, count - 1);
    setCount(newCount);
    socket.emit('updateParticipantCount', { change: -1 });
  };
  
  const reset = () => {
    setCount(0);
    socket.emit('updateParticipantCount', { change: -count });
  };
  
  const incrementByFive = () => {
    const newCount = count + 5;
    setCount(newCount);
    socket.emit('updateParticipantCount', { change: 5 });
  };

  return (
    <div className="counter-panel">
      <h2>Feedback Counter</h2>
      <p>Votes Submitted: {count}</p>
      <div className="buttons">
        <button onClick={increment}>Increment</button>
        <button onClick={decrement}>Decrement</button>
        <button onClick={reset}>Reset</button>
        <button onClick={incrementByFive}>Increment by 5</button>
      </div>
    </div>
  );
}
>>>>>>> 1b66281 (chore: add Full-Stack folder and commit current changes)
export default CounterPanel;