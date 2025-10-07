@echo off
echo Starting deployment process...

REM Check if we're in the right directory
if not exist "package.json" (
    echo Error: package.json not found. Please run this script from the backend directory.
    exit /b 1
)

REM Install dependencies
echo Installing dependencies...
npm install

REM Check if all required environment variables are set
echo Checking environment variables...
if "%MONGO_URI%"=="" (
    echo Warning: MONGO_URI not set
)

if "%JWT_SECRET%"=="" (
    echo Warning: JWT_SECRET not set
)

if "%CLOUDINARY_CLOUD_NAME%"=="" (
    echo Warning: CLOUDINARY_CLOUD_NAME not set
)

REM Start the application
echo Starting the application...
npm start
