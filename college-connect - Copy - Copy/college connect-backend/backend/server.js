import path from "path";
import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/connectDB.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import announcementRoutes from "./routes/announcementRoutes.js";
import { v2 as cloudinary } from "cloudinary";
import { app, server } from "./socket/socket.js";
import job from "./cron/cron.js";

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

console.log("Environment variables:");
console.log("MONGO_URI:", process.env.MONGO_URI);
console.log("PORT:", process.env.PORT);
console.log("NODE_ENV:", process.env.NODE_ENV);

connectDB();
job.start();

const PORT = process.env.PORT || 5000;

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Middlewares
const corsOptions = {
	origin: process.env.NODE_ENV === "production" 
		? process.env.CORS_ORIGINS?.split(',') || ["https://your-frontend-domain.com"]
		: ["http://localhost:5173", "http://localhost:5174"],
	credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "50mb" })); // To parse JSON data in the req.body
app.use(express.urlencoded({ extended: true })); // To parse form data in the req.body
app.use(cookieParser());

// Health check endpoint
app.get("/api/health", (req, res) => {
	res.status(200).json({ 
		status: "OK", 
		message: "Server is running", 
		timestamp: new Date().toISOString() 
	});
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/announcements", announcementRoutes);

// API-only backend - no frontend serving needed

server.listen(PORT, () => console.log(`Server started at http://localhost:${PORT}`));
