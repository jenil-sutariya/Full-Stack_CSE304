import { Router } from "express";
import { Student } from "./student.model.js";

export const studentsRouter = Router();

// Create
studentsRouter.post("/", async (req, res) => {
  try {
    const student = await Student.create(req.body);
    return res.status(201).json(student);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Email already exists" });
    }
    return res.status(400).json({ message: error.message });
  }
});

// Read all
studentsRouter.get("/", async (_req, res) => {
  try {
    const students = await Student.find({}).sort({ createdAt: -1 });
    return res.json(students);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Read one
studentsRouter.get("/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Not found" });
    return res.json(student);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

// Update
studentsRouter.put("/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!student) return res.status(404).json({ message: "Not found" });
    return res.json(student);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Email already exists" });
    }
    return res.status(400).json({ message: error.message });
  }
});

// Delete
studentsRouter.delete("/:id", async (req, res) => {
  try {
    const result = await Student.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: "Not found" });
    return res.json({ success: true });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});


