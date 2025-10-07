Tuition Admin - Students CRUD
=============================

Express + MongoDB app to add, view, edit, and delete student records with a minimal HTML UI.

Prerequisites
-------------
- Node.js 18+
- MongoDB running locally or a connection URI

Setup
-----
1. Copy `.env.example` to `.env` and adjust if needed:

   PORT=3000
   MONGODB_URI=mongodb://127.0.0.1:27017/tuition_admin

2. Install dependencies:

   npm install

Run
---
- Development (with reload):

  npm run dev

- Production:

  npm start

Usage
-----
- UI: open http://localhost:3000 in the browser.
- API endpoints:
  - GET    /api/students
  - GET    /api/students/:id
  - POST   /api/students
  - PUT    /api/students/:id
  - DELETE /api/students/:id

Student JSON body
-----------------
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "9999999999",
  "course": "Maths",
  "batch": "A1",
  "feesPaid": 1000,
  "notes": "Optional"
}

Notes
-----
- Unique constraint on `email` is enforced.
- Update requests validate fields via Mongoose.

