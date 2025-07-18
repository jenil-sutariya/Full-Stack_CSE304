import React from 'react';

function NameForm({ firstName, lastName, setFirstName, setLastName }) {
  return (
    <div>
      <label>
        First Name:
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          style={{ marginLeft: '10px' }}
        />
      </label>
      <br /><br />
      <label>
        Last Name:
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          style={{ marginLeft: '10px' }}
        />
      </label>
    </div>
  );
}

export default NameForm;
