import React, { useState } from "react";
import CounterControls from "./CounterControls";
import NameForm from "./NameForm";

function App() {
  const [count, setCount] = useState(0);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  return (
    <div style={{ textAlign: "center", padding: "2rem", fontFamily: "Arial" }}>
      <CounterControls count={count} setCount={setCount} />
      <hr />
      <h1>Welcome to CHARUSAT!!!</h1>
      <NameForm
        firstName={firstName}
        lastName={lastName}
        setFirstName={setFirstName}
        setLastName={setLastName}
      />
      <h3>First Name: {firstName}</h3>
      <h3>Last Name: {lastName}</h3>
    </div>
  );
}

export default App;
