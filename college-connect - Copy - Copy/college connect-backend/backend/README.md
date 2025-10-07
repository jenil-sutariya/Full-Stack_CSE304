# College Connect Backend

A Node.js backend API for the College Connect application built with Express.js, MongoDB, and Socket.io.

## Features

- User authentication and authorization
- Post management
- Real-time messaging with Socket.io
- Announcements system
- File uploads with Cloudinary
- Department detection
- Automated cron jobs

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Real-time**: Socket.io
- **File Storage**: Cloudinary
- **Authentication**: JWT
- **File Upload**: Multer

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
MONGO_URI=mongodb://localhost:27017/college-connect

# Server
PORT=5000
NODE_ENV=development

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# CORS Origins (comma-separated for production)
CORS_ORIGINS=http://localhost:5173,http://localhost:5174
```

## Installation

1. Clone the repository
2. Navigate to the backend directory
3. Install dependencies:
   ```bash
   npm install
   ```

## Development

Start the development server:
```bash
npm run dev
```

## Production

Start the production server:
```bash
npm start
```

## API Endpoints

### Health Check
- `GET /api/health` - Server health status

### Users
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `GET /api/users/profile/:username` - Get user profile
- `PUT /api/users/update/:id` - Update user profile

### Posts
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create new post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post

### Messages
- `GET /api/messages/:conversationId` - Get messages for conversation
- `POST /api/messages` - Send new message

### Announcements
- `GET /api/announcements` - Get all announcements
- `POST /api/announcements` - Create new announcement
- `PUT /api/announcements/:id` - Update announcement
- `DELETE /api/announcements/:id` - Delete announcement

## Deployment

### Deploy to Render

1. Push your code to GitHub
2. Connect your GitHub repository to Render
3. Set the following environment variables in Render:
   - `MONGO_URI` - Your MongoDB connection string
   - `JWT_SECRET` - A secure JWT secret
   - `CLOUDINARY_CLOUD_NAME` - Your Cloudinary cloud name
   - `CLOUDINARY_API_KEY` - Your Cloudinary API key
   - `CLOUDINARY_API_SECRET` - Your Cloudinary API secret
   - `CORS_ORIGINS` - Your frontend domain(s)
4. Deploy!

The application will automatically build and start using the `render.yaml` configuration.

## Socket.io Events

- `connection` - User connects
- `disconnect` - User disconnects
- `sendMessage` - Send a new message
- `newMessage` - Receive a new message

## Cron Jobs

The application includes automated cron jobs for various tasks. Check `cron/cron.js` for details.

## File Structure

```
backend/
├── controllers/     # Route controllers
├── models/         # Database models
├── routes/         # API routes
├── middlewares/    # Custom middlewares
├── db/            # Database connection
├── socket/        # Socket.io configuration
├── cron/          # Cron jobs
├── utils/         # Utility functions
├── uploads/       # File uploads directory
└── server.js      # Main server file
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test your changes
5. Submit a pull request

## License

ISC
