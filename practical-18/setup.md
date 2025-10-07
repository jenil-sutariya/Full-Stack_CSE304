# Quick Setup Guide

## Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or cloud service like MongoDB Atlas)

## Installation Steps

### 1. Install Dependencies
```bash
cd practical-18
npm install
```

### 2. Set up Environment Variables
```bash
# Copy the example environment file
cp .env.example .env

# Edit the .env file with your MongoDB connection string
# For local MongoDB:
MONGODB_URI=mongodb://localhost:27017/notes-app

# For MongoDB Atlas (cloud):
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/notes-app
```

### 3. Start MongoDB (if using local installation)
```bash
# On Windows (if MongoDB is installed as a service)
net start MongoDB

# On macOS (if installed via Homebrew)
brew services start mongodb-community

# On Linux
sudo systemctl start mongod
```

### 4. Start the Server
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3000`

### 5. Test the API
```bash
# Run the test script
npm test

# Or manually test with curl
curl http://localhost:3000/
```

## Quick Test with cURL

### Create a note:
```bash
curl -X POST http://localhost:3000/api/notes \
  -H "Content-Type: application/json" \
  -d '{"title": "Hello World", "content": "This is my first note!"}'
```

### Get all notes:
```bash
curl http://localhost:3000/api/notes
```

## Using Postman

1. Import the `Notes-API.postman_collection.json` file into Postman
2. Set the base URL variable to `http://localhost:3000`
3. Start testing the endpoints!

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check your connection string in the `.env` file
- For MongoDB Atlas, ensure your IP is whitelisted

### Port Already in Use
- Change the PORT in your `.env` file
- Or kill the process using the port: `npx kill-port 3000`

### Module Not Found Errors
- Run `npm install` again
- Delete `node_modules` and `package-lock.json`, then run `npm install`
