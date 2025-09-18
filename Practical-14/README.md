# Job Portal - Resume Upload System

A secure job portal application that allows users to upload their resumes with strict file validation.

## Features

- **File Type Validation**: Only PDF files are accepted
- **File Size Limit**: Maximum 2MB file size
- **Secure Upload**: Files are stored with unique names to prevent conflicts
- **User-Friendly Interface**: Modern, responsive design with drag-and-drop support
- **Error Handling**: Clear error messages for invalid files
- **Real-time Validation**: Client-side validation before upload

## Installation

1. Navigate to the project directory:
   ```bash
   cd Prectical-14
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Usage

1. Start the server:
   ```bash
   npm start
   ```
   
   For development with auto-restart:
   ```bash
   npm run dev
   ```

2. Open your browser and go to:
   ```
   http://localhost:3000
   ```

3. Fill in your details and upload a PDF resume (max 2MB)

## File Structure

```
Prectical-14/
├── server.js              # Express server with upload handling
├── package.json           # Dependencies and scripts
├── public/                # Static files
│   ├── index.html         # Main upload form
│   ├── style.css          # Styling
│   └── script.js          # Client-side validation
├── uploads/               # Directory for uploaded files (auto-created)
└── README.md              # This file
```

## API Endpoints

- `GET /` - Serves the main upload form
- `POST /upload-resume` - Handles file upload with validation

## Security Features

- **File Type Validation**: Server-side MIME type checking
- **File Size Limits**: 2MB maximum file size
- **Unique Filenames**: Prevents file conflicts and overwrites
- **Error Handling**: Comprehensive error messages for debugging

## File Validation Rules

1. **File Type**: Only PDF files (`application/pdf`) are accepted
2. **File Size**: Maximum 2MB (2,097,152 bytes)
3. **File Name**: Original filename is preserved in the response

## Error Messages

- "Only PDF files are allowed!" - When non-PDF file is uploaded
- "File too large! Maximum file size is 2MB." - When file exceeds size limit
- "No file uploaded. Please select a PDF file." - When no file is selected

## Technologies Used

- **Backend**: Express.js, Multer (file upload middleware)
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **File Handling**: Node.js File System (fs) module

## Development

The application uses nodemon for development, which automatically restarts the server when files change.

## License

MIT License
