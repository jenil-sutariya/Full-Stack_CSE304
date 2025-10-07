Practical 15 — Session-based Library Portal
===========================================

This mini app demonstrates simple login/logout using server sessions. Users "log in" by submitting a name; the server stores it in a session along with the login time. The profile view fetches and displays the session data. Logging out destroys the session.

Tech stack
---------
- Express 4
- express-session
- Plain HTML/CSS/JS frontend

Getting started
---------------
1. Install dependencies:

   ```bash
   cd Practical-15
   npm install
   ```

2. Run the server:

   ```bash
   npm start
   ```

3. Open the app at:

   `http://localhost:3000`

Endpoints
---------
- `POST /api/login` — body: `{ name: string }` — creates session `{ name, loginTime }`
- `GET /api/profile` — returns `{ user }` if logged in, `401` otherwise
- `POST /api/logout` — destroys session

Notes
-----
- For demo purposes only. Do not use the hard-coded session secret in production.
- Cookie max age is set to 1 hour.



