import express from "express";
import {
	createAnnouncement,
	getAnnouncementsForStudent,
	getAnnouncementsForProfessor,
	updateAnnouncement,
	deleteAnnouncement,
	likeUnlikeAnnouncement,
	replyToAnnouncement,
	markAnnouncementViewed,
	testCloudinary,
	deleteAnnouncementReply,
	likeUnlikeAnnouncementReply,
} from "../controllers/announcementController.js";
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router();

// Get announcements for student feed
router.get("/feed", protectRoute, getAnnouncementsForStudent);

// Professor routes
router.get("/professor", protectRoute, getAnnouncementsForProfessor);
router.post("/create", protectRoute, createAnnouncement);
router.put("/:id", protectRoute, updateAnnouncement);
router.delete("/:id", protectRoute, deleteAnnouncement);

// Student interaction routes
router.put("/:id/like", protectRoute, likeUnlikeAnnouncement);
router.post("/:id/reply", protectRoute, replyToAnnouncement);
router.put("/:id/view", protectRoute, markAnnouncementViewed);

// Test route
router.get("/test-cloudinary", protectRoute, testCloudinary);

// Comment/Reply management routes
router.delete("/:id/reply/:replyId", protectRoute, deleteAnnouncementReply);
router.put("/:id/reply/:replyId/like", protectRoute, likeUnlikeAnnouncementReply);

export default router;
