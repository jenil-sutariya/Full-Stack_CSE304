import User from "../models/userModel.js";
import Post from "../models/postModel.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/helpers/generateTokenAndSetCookie.js";
import { departmentDetector, generateDepartmentBio, extractStudentYear, extractStudentId } from "../utils/helpers/departmentDetector.js";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";
import axios from "axios";

const isInstituteEmail = (email) => {
	// Define allowed institute domains
	const allowedDomains = ["charusat.edu.in", "charusat.ac.in", "charusat.org"]; // Add more as needed
	const emailDomain = email.split("@")[1];
	return allowedDomains.includes(emailDomain);
};
const getUserProfile = async (req, res) => {
	// We will fetch user profile either with username or userId
	// query is either username or userId
	const { query } = req.params;

	try {
		let user;

		// query is userId
		if (mongoose.Types.ObjectId.isValid(query)) {
			user = await User.findOne({ _id: query }).select("-password").select("-updatedAt");
		} else {
			// query is username
			user = await User.findOne({ username: query }).select("-password").select("-updatedAt");
		}

		if (!user) return res.status(404).json({ error: "User not found" });

		res.status(200).json(user);
	} catch (err) {
		res.status(500).json({ error: err.message });
		console.log("Error in getUserProfile: ", err.message);
	}
};

const signupUser = async (req, res) => {
	try {
		const { name, email, username, password } = req.body;
		if (!isInstituteEmail(email)) {
			return res.status(400).json({ error: "Enter a valid institute ID" });
		}
		const user = await User.findOne({ $or: [{ email }, { username }] });

		if (user) {
			return res.status(400).json({ error: "User already exists" });
		}
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		// Detect department from email
		const department = departmentDetector(email);
		const studentYear = extractStudentYear(email);
		
		// Generate bio with department information
		const autoBio = generateDepartmentBio(department, name);

		const newUser = new User({
			name,
			email,
			username,
			password: hashedPassword,
			bio: autoBio,
			department: department,
			studentYear: studentYear,
			role: department.isProfessor ? "professor" : "student",
		});
		await newUser.save();

		if (newUser) {
			generateTokenAndSetCookie(newUser._id, res);

			res.status(201).json({
				_id: newUser._id,
				name: newUser.name,
				email: newUser.email,
				username: newUser.username,
				bio: newUser.bio,
				profilePic: newUser.profilePic,
				department: newUser.department,
				studentYear: newUser.studentYear,
			});
		} else {
			res.status(400).json({ error: "Invalid user data" });
		}
	} catch (err) {
		res.status(500).json({ error: err.message });
		console.log("Error in signupUser: ", err.message);
	}
};

const loginUser = async (req, res) => {
	try {
		const { username, password } = req.body;
		const user = await User.findOne({ username });
		const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

		if (!user || !isPasswordCorrect) return res.status(400).json({ error: "Invalid username or password" });


		// Auto-detect and update role/department on login if not set or outdated
		let updatedUser = user;
		if (!user.role || !user.department || !user.department.detected) {
			const department = departmentDetector(user.email);
			const studentYear = extractStudentYear(user.email);
			const autoBio = generateDepartmentBio(department, studentYear);

			// Update user with detected information
			updatedUser = await User.findByIdAndUpdate(
				user._id,
				{
					$set: {
						department: department,
						studentYear: studentYear,
						role: department.isProfessor ? "professor" : "student",
						// Only update bio if it's empty or still the default
						...((!user.bio || user.bio.includes('Welcome to') || user.bio.length < 20) && { bio: autoBio })
					}
				},
				{ new: true }
			);
		}

		generateTokenAndSetCookie(updatedUser._id, res);

		res.status(200).json({
			_id: updatedUser._id,
			name: updatedUser.name,
			email: updatedUser.email,
			username: updatedUser.username,
			bio: updatedUser.bio,
			profilePic: updatedUser.profilePic,
			role: updatedUser.role,
			department: updatedUser.department,
			studentYear: updatedUser.studentYear,
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
		console.log("Error in loginUser: ", error.message);
	}
};

const logoutUser = (req, res) => {
	try {
		res.cookie("jwt", "", { maxAge: 1 });
		res.status(200).json({ message: "User logged out successfully" });
	} catch (err) {
		res.status(500).json({ error: err.message });
		console.log("Error in signupUser: ", err.message);
	}
};

const followUnFollowUser = async (req, res) => {
	try {
		const { id } = req.params;
		const userToModify = await User.findById(id);
		const currentUser = await User.findById(req.user._id);

		if (id === req.user._id.toString())
			return res.status(400).json({ error: "You cannot follow/unfollow yourself" });

		if (!userToModify || !currentUser) return res.status(400).json({ error: "User not found" });

		const isFollowing = currentUser.following.includes(id);

		if (isFollowing) {
			// Unfollow user
			await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
			await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
			res.status(200).json({ message: "User unfollowed successfully" });
		} else {
			// Follow user
			await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
			await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
			res.status(200).json({ message: "User followed successfully" });
		}
	} catch (err) {
		res.status(500).json({ error: err.message });
		console.log("Error in followUnFollowUser: ", err.message);
	}
};

const updateUser = async (req, res) => {
	const { name, email, username, password, bio } = req.body;
	let { profilePic } = req.body;

	const userId = req.user._id;
	try {
		let user = await User.findById(userId);
		if (!user) return res.status(400).json({ error: "User not found" });

		if (req.params.id !== userId.toString())
			return res.status(400).json({ error: "You cannot update other user's profile" });

		if (password) {
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(password, salt);
			user.password = hashedPassword;
		}

		if (profilePic) {
			if (user.profilePic) {
				await cloudinary.uploader.destroy(user.profilePic.split("/").pop().split(".")[0]);
			}

			const uploadedResponse = await cloudinary.uploader.upload(profilePic);
			profilePic = uploadedResponse.secure_url;
		}

		user.name = name || user.name;
		user.email = email || user.email;
		user.username = username || user.username;
		user.profilePic = profilePic || user.profilePic;
		user.bio = bio || user.bio;

		user = await user.save();

		// Find all posts that this user replied and update username and userProfilePic fields
		await Post.updateMany(
			{ "replies.userId": userId },
			{
				$set: {
					"replies.$[reply].username": user.username,
					"replies.$[reply].userProfilePic": user.profilePic,
				},
			},
			{ arrayFilters: [{ "reply.userId": userId }] }
		);

		// password should be null in response
		user.password = null;

		res.status(200).json(user);
	} catch (err) {
		res.status(500).json({ error: err.message });
		console.log("Error in updateUser: ", err.message);
	}
};

const getSuggestedUsers = async (req, res) => {
	try {
		// exclude the current user from suggested users array and exclude users that current user is already following
		const userId = req.user._id;

		const usersFollowedByYou = await User.findById(userId).select("following");

		const users = await User.aggregate([
			{
				$match: {
					_id: { $ne: userId },
				},
			},
			{
				$sample: { size: 10 },
			},
		]);
		const filteredUsers = users.filter((user) => !usersFollowedByYou.following.includes(user._id));
		const suggestedUsers = filteredUsers.slice(0, 4);

		suggestedUsers.forEach((user) => (user.password = null));

		res.status(200).json(suggestedUsers);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};


const searchUsers = async (req, res) => {
	try {
		const { query } = req.query; // Get search query from request

		if (!query) return res.status(400).json({ error: "Search query is required" });
		console.log(query);
		
		// Find users whose name or username matches the query (case-insensitive)
		const users = await User.find({
			$or: [
				{ name: { $regex: query, $options: "i" } }, // Partial name match
				{ username: { $regex: query, $options: "i" } } // Partial username match
			]
		}).select("-password");

		res.status(200).json(users);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const googleSignup = async (req, res) => {
	try {
		const { email, name, picture } = req.body;

		if (!email || !name) {
			return res.status(400).json({ error: "Email and name are required" });
		}

		// Validate institute email domain
		if (!isInstituteEmail(email)) {
			return res.status(400).json({ error: "Enter a valid institute ID" });
		}

		// Check if user already exists
		let user = await User.findOne({ email });

		if (user) {
			// User exists, log them in but update role/department if needed
			let updatedUser = user;
			if (!user.role || !user.department || !user.department.detected) {
				const department = departmentDetector(user.email);
				const studentYear = extractStudentYear(user.email);
				const autoBio = generateDepartmentBio(department, user.name);

				// Update user with detected information
				updatedUser = await User.findByIdAndUpdate(
					user._id,
					{
						$set: {
							department: department,
							studentYear: studentYear,
							role: department.isProfessor ? "professor" : "student",
							// Only update bio if it's empty or still the default
							...((!user.bio || user.bio.includes('Welcome to') || user.bio.length < 20) && { bio: autoBio })
						}
					},
					{ new: true }
				);
			}

			generateTokenAndSetCookie(updatedUser._id, res);
			return res.status(200).json({
				_id: updatedUser._id,
				name: updatedUser.name,
				email: updatedUser.email,
				username: updatedUser.username,
				bio: updatedUser.bio,
				profilePic: updatedUser.profilePic,
				role: updatedUser.role,
				department: updatedUser.department,
				studentYear: updatedUser.studentYear,
			});
		}

		// Create new user - use clean student ID as username
		let username = extractStudentId(email);
		
		// Check if username already exists and handle conflicts
		let existingUser = await User.findOne({ username });
		let usernameCounter = 1;
		const baseUsername = username;
		
		// If username exists, add minimal suffix (1, 2, 3, etc.)
		while (existingUser) {
			username = `${baseUsername}${usernameCounter}`;
			existingUser = await User.findOne({ username });
			usernameCounter++;
		}
		
		// Detect department from email
		const department = departmentDetector(email);
		const studentYear = extractStudentYear(email);
		
		// Generate bio with department information
		const autoBio = generateDepartmentBio(department, name);
		
		// Upload Google profile picture to Cloudinary
		let profilePicUrl = "";
		if (picture) {
			try {
				const uploadedResponse = await cloudinary.uploader.upload(picture);
				profilePicUrl = uploadedResponse.secure_url;
			} catch (error) {
				console.log("Error uploading profile picture:", error);
				// Use Google URL as fallback
				profilePicUrl = picture;
			}
		}
		
		const newUser = new User({
			name,
			email,
			username,
			profilePic: profilePicUrl,
			password: null, // No password for Google OAuth users
			bio: autoBio,
			department: department,
			studentYear: studentYear,
			role: department.isProfessor ? "professor" : "student",
		});

		await newUser.save();

		generateTokenAndSetCookie(newUser._id, res);

		res.status(201).json({
			_id: newUser._id,
			name: newUser.name,
			email: newUser.email,
			username: newUser.username,
			bio: newUser.bio,
			profilePic: newUser.profilePic,
			role: newUser.role,
			department: newUser.department,
			studentYear: newUser.studentYear,
		});

	} catch (error) {
		console.log("Error in googleSignup: ", error.message);
		console.log("Full error: ", error);
		res.status(500).json({ error: "Google authentication failed: " + error.message });
	}
};

export {
	signupUser,
	loginUser,
	logoutUser,
	followUnFollowUser,
	updateUser,
	getUserProfile,
	getSuggestedUsers,
	searchUsers,
	googleSignup
};
