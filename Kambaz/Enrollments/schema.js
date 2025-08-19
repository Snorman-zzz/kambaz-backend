import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema({
    user: { type: String, required: true, ref: 'UserModel' },
    course: { type: String, required: true, ref: 'CourseModel' },
}, { collection: "enrollments" });

// Create compound index to ensure unique user-course combinations
enrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

export default enrollmentSchema;