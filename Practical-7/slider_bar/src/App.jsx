import React, { useState } from "react";
import "./App.css";
import Sidebar from "./components/Sidebar";
import SearchBar from "./components/SearchBar";

const App = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className="app-container">
      <div className="top-bar">
        <button className="menu-btn" onClick={toggleSidebar}>
          &#9776;
        </button>
        <SearchBar />
      </div>

      <Sidebar isOpen={isOpen} />

      <main className="main-content">
        <h1>Welcome to My Website</h1>
        <p>This is the main content of the webpage.</p>
      </main>
    </div>
  );
};

export default App;
