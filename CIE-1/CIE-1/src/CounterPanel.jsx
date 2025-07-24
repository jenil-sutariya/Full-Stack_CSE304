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
export default CounterPanel;