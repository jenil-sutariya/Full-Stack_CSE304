import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true, minlength: 2 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /[^@\s]+@[^@\s]+\.[^@\s]+/,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      match: /^[0-9\-\+\s]{7,15}$/,
    },
    course: { type: String, required: true, trim: true },
    batch: { type: String, required: true, trim: true },
    feesPaid: { type: Number, default: 0, min: 0 },
    notes: { type: String, trim: true, default: "" },
    joinedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Create an index to enforce unique email at the database level
StudentSchema.index({ email: 1 }, { unique: true });

export const Student = mongoose.models.Student || mongoose.model("Student", StudentSchema);


