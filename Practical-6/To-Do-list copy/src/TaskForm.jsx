import React, { useState } from "react";

function TaskForm({ onAdd }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (firstName && lastName && endDate) {
      onAdd(firstName, lastName, endDate);
      setFirstName("");
      setLastName("");
      setEndDate("");
    } else {
      alert("Please fill in all fields.");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "1.5rem" }}>
      <div>
        <label>First Name: </label>
        <input
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
      </div>
      <br />
      <div>
        <label>Last Name: </label>
        <input
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
      </div>
      <br />
      <div>
        <label>End Date: </label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
        />
      </div>
      <br />
      <button type="submit">Add Task</button>
    </form>
  );
}

export default TaskForm;
