import React from 'react';
import { useEffect } from 'react';
function Liveclock() {
  const [time, setTime] = React.useState(new Date().toLocaleTimeString());

  React.useEffect(() => {
    const timerId = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  return (
    <div className="liveclock">
      <h1>Current Time</h1>
      <p>{time}</p>
    </div>
  );
}
export default Liveclock;