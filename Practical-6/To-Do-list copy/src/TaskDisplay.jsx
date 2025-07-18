import React from "react";

function TaskDisplay({ tasks }) {
  return (
    <div>
      <h2>Task List</h2>
      {tasks.length === 0 ? (
        <p>No tasks added yet.</p>
      ) : (
        tasks.map((task, index) => (
          <div
            key={index}
            style={{
              marginBottom: "1rem",
              borderBottom: "1px solid #ccc",
              paddingBottom: "0.5rem",
            }}
          >
            <p>
              <strong>First Name:</strong> {task.firstName}
            </p>
            <p>
              <strong>Last Name:</strong> {task.lastName}
            </p>
            <p>
              <strong>Start Date:</strong> {task.startDate}
            </p>
            <p>
              <strong>End Date:</strong> {task.endDate}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default TaskDisplay;
