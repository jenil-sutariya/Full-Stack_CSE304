import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Counter from "./components/Counter.jsx";

function App() {
  return (
    <>
      <div className="container">
        <h1>Rep Counter</h1>
        <Counter />
      </div>
    </>
  );
}

export default App;
