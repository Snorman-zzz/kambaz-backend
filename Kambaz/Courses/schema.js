import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    number: String,
    description: String,
    startDate: String,
    endDate: String,
    department: String,
    credits: Number,
  },
  { collection: "courses" }
);

export default courseSchema;