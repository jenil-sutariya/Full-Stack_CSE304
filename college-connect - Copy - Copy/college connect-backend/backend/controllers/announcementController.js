import Announcement from "../models/announcementModel.js";
import User from "../models/userModel.js";
import { v2 as cloudinary } from "cloudinary";

// Create new announcement (Professor only)
const createAnnouncement = async (req, res) => {
	try {
		const { title, content, targetDepartments, targetBatches, priority, category, expiryDate, photos } = req.body;
		const userId = req.user._id;

		// Check if user is professor
		if (req.user.role !== "professor" && req.user.role !== "admin") {
			return res.status(403).json({ error: "Only professors can create announcements" });
		}

		// Debug Cloudinary config and received data
		console.log("Received request body keys:", Object.keys(req.body));
		console.log("Photos received:", photos ? `${photos.length} photos` : "No photos");
		
		if (photos && photos.length > 0) {
			console.log("Cloudinary Environment Check:");
			console.log("CLOUDINARY_CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME ? "✓ Set" : "✗ Missing");
			console.log("CLOUDINARY_API_KEY:", process.env.CLOUDINARY_API_KEY ? "✓ Set" : "✗ Missing");
			console.log("CLOUDINARY_API_SECRET:", process.env.CLOUDINARY_API_SECRET ? "✓ Set" : "✗ Missing");
		}

		if (!title || !content || !targetDepartments || !targetBatches) {
			return res.status(400).json({ error: "Title, content, target departments and batches are required" });
		}

		// Upload photos to Cloudinary if provided
		let uploadedPhotos = [];
		
		if (photos && Array.isArray(photos) && photos.length > 0) {
			try {
				console.log(`Processing ${photos.length} photos for upload...`);
				console.log("Photo data types:", photos.map(p => typeof p));
				console.log("Photo data lengths:", photos.map(p => p ? p.length : 0));
				
				for (let i = 0; i < photos.length; i++) {
					const photo = photos[i];
					console.log(`Uploading photo ${i + 1}/${photos.length}...`);
					
					// Ensure the photo is a valid base64 string
					if (!photo || typeof photo !== 'string') {
						console.log(`Skipping invalid photo at index ${i}`);
						continue;
					}

					// Check if it's a valid base64 data URL
					if (!photo.startsWith('data:image/')) {
						console.log(`Skipping invalid photo format at index ${i}`);
						continue;
					}
					
					console.log(`Photo ${i + 1} format:`, photo.substring(0, 50) + "...");
					
					const uploadedResponse = await cloudinary.uploader.upload(photo, {
						folder: "announcements",
						resource_type: "auto",
						quality: "auto:good",
						format: "jpg"
					});
					
					uploadedPhotos.push(uploadedResponse.secure_url);
					console.log(`Successfully uploaded photo ${i + 1}: ${uploadedResponse.secure_url}`);
				}
				
				console.log(`Upload complete. ${uploadedPhotos.length} photos uploaded successfully.`);
			} catch (uploadError) {
				console.error("Cloudinary upload error:", uploadError);
				console.error("Error details:", uploadError);
				return res.status(500).json({ 
					error: "Failed to upload photos to Cloudinary",
					details: uploadError.message 
				});
			}
		}

		const newAnnouncement = new Announcement({
			title,
			content,
			postedBy: userId,
			targetDepartments: Array.isArray(targetDepartments) ? targetDepartments : [targetDepartments],
			targetBatches: Array.isArray(targetBatches) ? targetBatches : [targetBatches],
			priority: priority || "medium",
			category: category || "general",
			expiryDate: expiryDate || null,
			photos: uploadedPhotos,
		});

		await newAnnouncement.save();
		await newAnnouncement.populate("postedBy", "username name profilePic role professorInfo");

		console.log(`Announcement created successfully with ${newAnnouncement.photos.length} photos`);

		res.status(201).json({
			message: "Announcement created successfully",
			announcement: newAnnouncement,
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
		console.log("Error in createAnnouncement: ", error.message);
	}
};

// Get announcements for student's feed (filtered by department and batch)
const getAnnouncementsForStudent = async (req, res) => {
	try {
		const userId = req.user._id;
		const user = await User.findById(userId);

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		// Extract department code and student year from user
		const userDepartment = user.department.code;
		const userBatch = user.studentYear;

		if (!userDepartment || !userBatch) {
			return res.status(400).json({ error: "User department or batch information missing" });
		}

		// Find announcements targeted to user's department and batch
		const announcements = await Announcement.find({
			isActive: true,
			$or: [
				{ expiryDate: null },
				{ expiryDate: { $gte: new Date() } }
			],
			targetDepartments: { $in: [userDepartment, "ALL"] },
			targetBatches: { $in: [userBatch, "ALL"] },
		})
		.populate("postedBy", "username name profilePic role professorInfo")
		.sort({ priority: -1, createdAt: -1 })
		.limit(20);

		res.status(200).json(announcements);
	} catch (error) {
		res.status(500).json({ error: error.message });
		console.log("Error in getAnnouncementsForStudent: ", error.message);
	}
};

// Get all announcements for professor dashboard
const getAnnouncementsForProfessor = async (req, res) => {
	try {
		const userId = req.user._id;

		// Check if user is professor
		if (req.user.role !== "professor" && req.user.role !== "admin") {
			return res.status(403).json({ error: "Access denied" });
		}

		const announcements = await Announcement.find({ postedBy: userId })
			.populate("postedBy", "username name profilePic role professorInfo")
			.sort({ createdAt: -1 });

		// Debug: Log what we're sending back
		announcements.forEach((ann, index) => {
			console.log(`Announcement ${index + 1}: ${ann.title}, Photos: ${ann.photos ? ann.photos.length : 0}`);
			if (ann.photos && ann.photos.length > 0) {
				console.log("Photo URLs:", ann.photos);
			}
		});

		res.status(200).json(announcements);
	} catch (error) {
		res.status(500).json({ error: error.message });
		console.log("Error in getAnnouncementsForProfessor: ", error.message);
	}
};

// Update announcement
const updateAnnouncement = async (req, res) => {
	try {
		const { id } = req.params;
		const userId = req.user._id;

		const announcement = await Announcement.findById(id);
		if (!announcement) {
			return res.status(404).json({ error: "Announcement not found" });
		}

		// Check if user owns the announcement
		if (announcement.postedBy.toString() !== userId.toString()) {
			return res.status(403).json({ error: "You can only update your own announcements" });
		}

		const updatedAnnouncement = await Announcement.findByIdAndUpdate(id, req.body, { new: true })
			.populate("postedBy", "username name profilePic role professorInfo");

		res.status(200).json(updatedAnnouncement);
	} catch (error) {
		res.status(500).json({ error: error.message });
		console.log("Error in updateAnnouncement: ", error.message);
	}
};

// Delete announcement
const deleteAnnouncement = async (req, res) => {
	try {
		const { id } = req.params;
		const userId = req.user._id;

		const announcement = await Announcement.findById(id);
		if (!announcement) {
			return res.status(404).json({ error: "Announcement not found" });
		}

		// Check if user owns the announcement
		if (announcement.postedBy.toString() !== userId.toString()) {
			return res.status(403).json({ error: "You can only delete your own announcements" });
		}

		await Announcement.findByIdAndDelete(id);
		res.status(200).json({ message: "Announcement deleted successfully" });
	} catch (error) {
		res.status(500).json({ error: error.message });
		console.log("Error in deleteAnnouncement: ", error.message);
	}
};

// Like/Unlike announcement
const likeUnlikeAnnouncement = async (req, res) => {
	try {
		const { id: announcementId } = req.params;
		const userId = req.user._id;

		const announcement = await Announcement.findById(announcementId);
		if (!announcement) {
			return res.status(404).json({ error: "Announcement not found" });
		}

		const userLikedAnnouncement = announcement.likes.includes(userId);

		if (userLikedAnnouncement) {
			// Unlike announcement
			await Announcement.updateOne({ _id: announcementId }, { $pull: { likes: userId } });
			res.status(200).json({ message: "Announcement unliked successfully" });
		} else {
			// Like announcement
			announcement.likes.push(userId);
			await announcement.save();
			res.status(200).json({ message: "Announcement liked successfully" });
		}
	} catch (error) {
		res.status(500).json({ error: error.message });
		console.log("Error in likeUnlikeAnnouncement: ", error.message);
	}
};

// Add reply to announcement
const replyToAnnouncement = async (req, res) => {
	try {
		const { id: announcementId } = req.params;
		const { text, mentions } = req.body;
		const userId = req.user._id;
		const { username, profilePic } = req.user;

		if (!text) {
			return res.status(400).json({ error: "Text field is required" });
		}

		const announcement = await Announcement.findById(announcementId);
		if (!announcement) {
			return res.status(404).json({ error: "Announcement not found" });
		}

		const reply = { 
			userId, 
			text, 
			userProfilePic: profilePic, 
			username,
			mentions: mentions || [],
			likes: [],
			createdAt: new Date()
		};
		
		announcement.replies.push(reply);
		await announcement.save();

		// TODO: Send notifications to mentioned users
		if (mentions && mentions.length > 0) {
			console.log(`Mentioned users in announcement comment: ${mentions.join(', ')}`);
		}

		res.status(200).json(reply);
	} catch (error) {
		res.status(500).json({ error: error.message });
		console.log("Error in replyToAnnouncement: ", error.message);
	}
};

// Mark announcement as viewed
const markAnnouncementViewed = async (req, res) => {
	try {
		const { id: announcementId } = req.params;
		const userId = req.user._id;

		const announcement = await Announcement.findById(announcementId);
		if (!announcement) {
			return res.status(404).json({ error: "Announcement not found" });
		}

		// Check if user already viewed
		const alreadyViewed = announcement.viewedBy.some(view => view.user.toString() === userId.toString());
		
		if (!alreadyViewed) {
			announcement.viewedBy.push({ user: userId, viewedAt: new Date() });
			await announcement.save();
		}

		res.status(200).json({ message: "Announcement marked as viewed" });
	} catch (error) {
		res.status(500).json({ error: error.message });
		console.log("Error in markAnnouncementViewed: ", error.message);
	}
};

// Test endpoint to verify Cloudinary configuration
const testCloudinary = async (req, res) => {
	try {
		// Test with a simple base64 image (1x1 pixel PNG)
		const testImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==";
		
		console.log("Testing Cloudinary upload...");
		const result = await cloudinary.uploader.upload(testImage, {
			folder: "test",
		});
		
		console.log("Cloudinary test successful:", result.secure_url);
		res.status(200).json({
			success: true,
			message: "Cloudinary is working",
			testUrl: result.secure_url
		});
	} catch (error) {
		console.error("Cloudinary test failed:", error);
		res.status(500).json({
			success: false,
			error: error.message
		});
	}
};

// Delete a reply/comment from an announcement
const deleteAnnouncementReply = async (req, res) => {
	try {
		const { id: announcementId, replyId } = req.params;
		const userId = req.user._id;

		const announcement = await Announcement.findById(announcementId);
		if (!announcement) {
			return res.status(404).json({ error: "Announcement not found" });
		}

		const replyIndex = announcement.replies.findIndex(reply => reply._id.toString() === replyId);
		if (replyIndex === -1) {
			return res.status(404).json({ error: "Reply not found" });
		}

		const reply = announcement.replies[replyIndex];
		
		// Check if user owns the reply or is admin
		if (reply.userId.toString() !== userId.toString() && req.user.role !== "admin") {
			return res.status(403).json({ error: "You can only delete your own replies" });
		}

		announcement.replies.splice(replyIndex, 1);
		await announcement.save();

		res.status(200).json({ message: "Reply deleted successfully" });
	} catch (error) {
		res.status(500).json({ error: error.message });
		console.log("Error in deleteAnnouncementReply: ", error.message);
	}
};

// Like/unlike an announcement reply
const likeUnlikeAnnouncementReply = async (req, res) => {
	try {
		const { id: announcementId, replyId } = req.params;
		const userId = req.user._id;

		const announcement = await Announcement.findById(announcementId);
		if (!announcement) {
			return res.status(404).json({ error: "Announcement not found" });
		}

		const reply = announcement.replies.find(reply => reply._id.toString() === replyId);
		if (!reply) {
			return res.status(404).json({ error: "Reply not found" });
		}

		if (!reply.likes) {
			reply.likes = [];
		}

		const userLikedReply = reply.likes.includes(userId);

		if (userLikedReply) {
			reply.likes = reply.likes.filter(id => id.toString() !== userId.toString());
		} else {
			reply.likes.push(userId);
		}

		await announcement.save();

		res.status(200).json({ 
			message: userLikedReply ? "Reply unliked" : "Reply liked",
			likes: reply.likes.length 
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
		console.log("Error in likeUnlikeAnnouncementReply: ", error.message);
	}
};

export {
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
};
