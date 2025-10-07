# Notes API

A RESTful API for a notes-taking app built with Express.js and MongoDB.

## Features

- Create, read, update, and delete notes
- Pagination support
- Input validation
- Error handling
- Timestamp tracking (createdAt, updatedAt)
- CORS enabled for cross-origin requests

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## Installation

1. Clone or navigate to the project directory
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` file with your MongoDB connection string:
   ```
   MONGODB_URI=mongodb://localhost:27017/notes-app
   PORT=3000
   NODE_ENV=development
   ```

4. Start the server:
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   ```

The server will start on `http://localhost:3000`

## API Endpoints

### Base URL: `http://localhost:3000/api/notes`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get all notes with pagination |
| GET | `/:id` | Get a specific note by ID |
| POST | `/` | Create a new note |
| PUT | `/:id` | Update an existing note |
| DELETE | `/:id` | Delete a specific note |
| DELETE | `/` | Delete all notes (useful for testing) |

## API Documentation

### Get All Notes
```http
GET /api/notes?page=1&limit=10&sort=createdAt
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Number of notes per page (default: 10)
- `sort` (optional): Sort field (default: createdAt)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "title": "My First Note",
      "content": "This is the content of my first note.",
      "createdAt": "2023-09-05T10:30:00.000Z",
      "updatedAt": "2023-09-05T10:30:00.000Z"
    }
  ],
  "pagination": {
    "current": 1,
    "pages": 1,
    "total": 1,
    "limit": 10
  }
}
```

### Get Specific Note
```http
GET /api/notes/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "title": "My First Note",
    "content": "This is the content of my first note.",
    "createdAt": "2023-09-05T10:30:00.000Z",
    "updatedAt": "2023-09-05T10:30:00.000Z"
  }
}
```

### Create Note
```http
POST /api/notes
Content-Type: application/json

{
  "title": "New Note Title",
  "content": "This is the content of the new note."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Note created successfully",
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "title": "New Note Title",
    "content": "This is the content of the new note.",
    "createdAt": "2023-09-05T10:30:00.000Z",
    "updatedAt": "2023-09-05T10:30:00.000Z"
  }
}
```

### Update Note
```http
PUT /api/notes/:id
Content-Type: application/json

{
  "title": "Updated Note Title",
  "content": "This is the updated content of the note."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Note updated successfully",
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "title": "Updated Note Title",
    "content": "This is the updated content of the note.",
    "createdAt": "2023-09-05T10:30:00.000Z",
    "updatedAt": "2023-09-05T11:45:00.000Z"
  }
}
```

### Delete Note
```http
DELETE /api/notes/:id
```

**Response:**
```json
{
  "success": true,
  "message": "Note deleted successfully",
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "title": "Deleted Note",
    "content": "This note was deleted.",
    "createdAt": "2023-09-05T10:30:00.000Z",
    "updatedAt": "2023-09-05T10:30:00.000Z"
  }
}
```

## Error Responses

All error responses follow this format:
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message (in development mode only)"
}
```

### Common Error Codes:
- `400`: Bad Request (validation errors, invalid data)
- `404`: Not Found (note doesn't exist)
- `500`: Internal Server Error (server-side errors)

## Validation Rules

- **Title**: Required, max 100 characters
- **Content**: Required, max 5000 characters
- **ID**: Must be a valid MongoDB ObjectId

## Testing with Postman

1. Import the API endpoints into Postman
2. Set the base URL to `http://localhost:3000/api/notes`
3. Test each endpoint with the examples provided above

## Testing with cURL

### Create a note:
```bash
curl -X POST http://localhost:3000/api/notes \
  -H "Content-Type: application/json" \
  -d '{"title": "Test Note", "content": "This is a test note content."}'
```

### Get all notes:
```bash
curl http://localhost:3000/api/notes
```

### Get a specific note:
```bash
curl http://localhost:3000/api/notes/NOTE_ID_HERE
```

### Update a note:
```bash
curl -X PUT http://localhost:3000/api/notes/NOTE_ID_HERE \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated Title", "content": "Updated content"}'
```

### Delete a note:
```bash
curl -X DELETE http://localhost:3000/api/notes/NOTE_ID_HERE
```

## Project Structure

```
practical-18/
├── models/
│   └── Note.js          # Note model/schema
├── routes/
│   └── notes.js         # API routes
├── .env.example         # Environment variables template
├── package.json         # Dependencies and scripts
├── server.js           # Main server file
└── README.md           # This file
```

## License

ISC
