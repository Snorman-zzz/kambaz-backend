import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    points: { type: Number, default: 100 },
    course: String,
    due: String,
    available: String,
  },
  { collection: "assignments" }
);

export default assignmentSchema;