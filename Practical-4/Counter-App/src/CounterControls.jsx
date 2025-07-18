import React from "react";

function CounterControls({ count, setCount }) {
  return (
    <div>
      <h2>Count: {count}</h2>
      <button onClick={() => setCount(0)}>Reset</button>{" "}
      <button onClick={() => setCount((prev) => prev + 1)}>Increment</button>{" "}
      <button onClick={() => setCount((prev) => prev - 1)}>Decrement</button>{" "}
      <button onClick={() => setCount((prev) => prev + 5)}>Increment 5</button>
    </div>
  );
}

export default CounterControls;
