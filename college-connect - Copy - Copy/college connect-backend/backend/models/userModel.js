import mongoose from "mongoose";

const userSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		username: {
			type: String,
			required: true,
			unique: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			minLength: 6,
			required: function() {
				return this.password !== null; // Only required if password is not null
			},
		},
		profilePic: {
			type: String,
			default: "",
		},
		followers: {
			type: [String],
			default: [],
		},
		following: {
			type: [String],
			default: [],
		},
		bio: {
			type: String,
			default: "",
		},
		department: {
			code: {
				type: String,
				default: "GENERAL",
			},
			name: {
				type: String,
				default: "General",
			},
			fullName: {
				type: String,
				default: "General Department",
			},
			category: {
				type: String,
				default: "General",
			},
			abbreviation: {
				type: String,
				default: "GEN",
			},
			detected: {
				type: Boolean,
				default: false,
			}
		},
		studentYear: {
			type: String,
			default: null,
		},
		role: {
			type: String,
			enum: ["student", "professor", "admin"],
			default: "student",
		},
		professorInfo: {
			employeeId: {
				type: String,
				default: null,
			},
			title: {
				type: String,
				default: null,
			},
			departmentAccess: [{
				type: String,
				default: [],
			}],
		},
	},
	{
		timestamps: true,
	}
);

const User = mongoose.model("User", userSchema);

export default User;
