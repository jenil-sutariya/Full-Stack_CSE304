#!/bin/bash

# Deployment script for College Connect Backend
echo "Starting deployment process..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "Error: package.json not found. Please run this script from the backend directory."
    exit 1
fi

# Install dependencies
echo "Installing dependencies..."
npm install

# Check if all required environment variables are set
echo "Checking environment variables..."
if [ -z "$MONGO_URI" ]; then
    echo "Warning: MONGO_URI not set"
fi

if [ -z "$JWT_SECRET" ]; then
    echo "Warning: JWT_SECRET not set"
fi

if [ -z "$CLOUDINARY_CLOUD_NAME" ]; then
    echo "Warning: CLOUDINARY_CLOUD_NAME not set"
fi

# Start the application
echo "Starting the application..."
npm start
