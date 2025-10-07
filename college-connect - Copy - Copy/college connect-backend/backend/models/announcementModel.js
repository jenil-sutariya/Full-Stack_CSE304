import mongoose from "mongoose";

const announcementSchema = mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			maxLength: 200,
		},
		content: {
			type: String,
			required: true,
			maxLength: 2000,
		},
		postedBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		targetDepartments: [{
			type: String,
			required: true,
		}],
		targetBatches: [{
			type: String,
			required: true,
		}],
		priority: {
			type: String,
			enum: ["low", "medium", "high", "urgent"],
			default: "medium",
		},
		category: {
			type: String,
			enum: ["academic", "examination", "event", "general", "emergency"],
			default: "general",
		},
		attachments: [{
			url: String,
			filename: String,
			fileType: String,
		}],
		photos: [{
			type: String, // Cloudinary URLs
		}],
		isActive: {
			type: Boolean,
			default: true,
		},
		expiryDate: {
			type: Date,
			default: null,
		},
		viewedBy: [{
			user: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
			viewedAt: {
				type: Date,
				default: Date.now,
			},
		}],
		likes: {
			type: [mongoose.Schema.Types.ObjectId],
			ref: "User",
			default: [],
		},
		replies: [
			{
				userId: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "User",
					required: true,
				},
				text: {
					type: String,
					required: true,
				},
				userProfilePic: {
					type: String,
				},
				username: {
					type: String,
				},
				createdAt: {
					type: Date,
					default: Date.now,
				},
			},
		],
	},
	{
		timestamps: true,
	}
);

// Index for efficient querying
announcementSchema.index({ targetDepartments: 1, targetBatches: 1, isActive: 1, createdAt: -1 });
announcementSchema.index({ postedBy: 1, createdAt: -1 });

const Announcement = mongoose.model("Announcement", announcementSchema);

export default Announcement;
