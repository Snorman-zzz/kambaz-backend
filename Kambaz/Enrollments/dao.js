import model from "./model.js";

export const findEnrollmentsByUser = (userId) => model.find({ user: userId });

export const enrollUserInCourse = async (userId, courseId) => {
  try {
    const record = { user: userId, course: courseId };
    const enrollment = await model.create(record);
    return enrollment;
  } catch (error) {
    if (error.code === 11000) { // Duplicate key error
      throw new Error("User is already enrolled in this course");
    }
    throw error;
  }
};

export const unenrollUserFromCourse = (userId, courseId) => 
  model.findOneAndDelete({ user: userId, course: courseId });

export const findAllEnrollments = () => model.find();

export const findEnrollmentsByCourse = (courseId) => model.find({ course: courseId });
