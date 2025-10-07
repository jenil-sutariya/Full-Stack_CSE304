import Post from "../models/postModel.js";
import User from "../models/userModel.js";
import { v2 as cloudinary } from "cloudinary";

const createPost = async (req, res) => {
	try {
		const { postedBy, text } = req.body;
		let { img } = req.body;

		if (!postedBy || !text) {
			return res.status(400).json({ error: "Postedby and text fields are required" });
		}

		const user = await User.findById(postedBy);
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		if (user._id.toString() !== req.user._id.toString()) {
			return res.status(401).json({ error: "Unauthorized to create post" });
		}

		const maxLength = 500;
		if (text.length > maxLength) {
			return res.status(400).json({ error: `Text must be less than ${maxLength} characters` });
		}

		if (img) {
			const uploadedResponse = await cloudinary.uploader.upload(img);
			img = uploadedResponse.secure_url;
		}

		const newPost = new Post({ postedBy, text, img });
		await newPost.save();

		res.status(201).json(newPost);
	} catch (err) {
		res.status(500).json({ error: err.message });
		console.log(err);
	}
};

const getPost = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);

		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		res.status(200).json(post);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

const deletePost = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		if (post.postedBy.toString() !== req.user._id.toString()) {
			return res.status(401).json({ error: "Unauthorized to delete post" });
		}

		if (post.img) {
			const imgId = post.img.split("/").pop().split(".")[0];
			await cloudinary.uploader.destroy(imgId);
		}

		await Post.findByIdAndDelete(req.params.id);

		res.status(200).json({ message: "Post deleted successfully" });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

const likeUnlikePost = async (req, res) => {
	try {
		const { id: postId } = req.params;
		const userId = req.user._id;

		const post = await Post.findById(postId);

		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		const userLikedPost = post.likes.includes(userId);

		if (userLikedPost) {
			// Unlike post
			await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
			res.status(200).json({ message: "Post unliked successfully" });
		} else {
			// Like post
			post.likes.push(userId);
			await post.save();
			res.status(200).json({ message: "Post liked successfully" });
		}
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

const replyToPost = async (req, res) => {
	try {
		const { text, mentions } = req.body;
		const postId = req.params.id;
		const userId = req.user._id;
		const userProfilePic = req.user.profilePic;
		const username = req.user.username;

		if (!text) {
			return res.status(400).json({ error: "Text field is required" });
		}

		const post = await Post.findById(postId);
		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		const reply = { 
			userId, 
			text, 
			userProfilePic, 
			username,
			mentions: mentions || [],
			likes: [],
			createdAt: new Date()
		};

		post.replies.push(reply);
		await post.save();

		// TODO: Send notifications to mentioned users
		if (mentions && mentions.length > 0) {
			console.log(`Mentioned users in post comment: ${mentions.join(', ')}`);
		}

		res.status(200).json(reply);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

const getFeedPosts = async (req, res) => {
	try {
		const userId = req.user._id;
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		const following = user.following;

		// Get all users that the current user follows
		const activeUsers = await User.find({ 
			_id: { $in: following }
		}).select('_id');

		const activeUserIds = activeUsers.map(user => user._id);

		const feedPosts = await Post.find({ postedBy: { $in: activeUserIds } }).sort({ createdAt: -1 });

		res.status(200).json(feedPosts);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

const getUserPosts = async (req, res) => {
	const { username } = req.params;
	try {
		const user = await User.findOne({ username });
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}


		const posts = await Post.find({ postedBy: user._id }).sort({ createdAt: -1 });

		res.status(200).json(posts);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

// Delete a reply/comment from a post
const deleteReply = async (req, res) => {
	try {
		const { id: postId, replyId } = req.params;
		const userId = req.user._id;

		const post = await Post.findById(postId);
		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		const replyIndex = post.replies.findIndex(reply => reply._id.toString() === replyId);
		if (replyIndex === -1) {
			return res.status(404).json({ error: "Reply not found" });
		}

		const reply = post.replies[replyIndex];
		
		// Check if user owns the reply or is admin
		if (reply.userId.toString() !== userId.toString() && req.user.role !== "admin") {
			return res.status(403).json({ error: "You can only delete your own replies" });
		}

		post.replies.splice(replyIndex, 1);
		await post.save();

		res.status(200).json({ message: "Reply deleted successfully" });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

// Like/unlike a reply
const likeUnlikeReply = async (req, res) => {
	try {
		const { id: postId, replyId } = req.params;
		const userId = req.user._id;

		const post = await Post.findById(postId);
		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		const reply = post.replies.find(reply => reply._id.toString() === replyId);
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

		await post.save();

		res.status(200).json({ 
			message: userLikedReply ? "Reply unliked" : "Reply liked",
			likes: reply.likes.length 
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

export { createPost, getPost, deletePost, likeUnlikePost, replyToPost, getFeedPosts, getUserPosts, deleteReply, likeUnlikeReply };
