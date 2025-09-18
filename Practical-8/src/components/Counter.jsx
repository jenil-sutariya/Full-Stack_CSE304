import { useState, useEffect } from "react";

const Counter = () => {
  const [count, setCount] = useState(() => {
    const saved = localStorage.getItem("repCount");
    return saved !== null ? parseInt(saved) : 0;
  });

  useEffect(() => {
    localStorage.setItem("repCount", count);
  }, [count]);

  return (
    <>
      <div className="counter-display">{count}</div>
      <div className="buttons">
        <button onClick={() => setCount(Math.max(0, count - 1))}>-</button>
        <button onClick={() => setCount(count + 1)}>+</button>
      </div>
      <button className="reset-btn" onClick={() => setCount(0)}>
        Reset
      </button>
    </>
  );
};

export default Counter;
