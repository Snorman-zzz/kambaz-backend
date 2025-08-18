import model from "./model.js";

export const findAllCourses = () => model.find();

export const findCoursesForEnrolledUser = async (userId) => {
    // This would need enrollment logic - for now return all courses
    // TODO: Implement proper enrollment filtering
    return model.find();
};

export const createCourse = (course) => model.create(course);

export const deleteCourse = (courseId) => model.findByIdAndDelete(courseId);

export const updateCourse = (courseId, courseUpdates) => 
    model.findByIdAndUpdate(courseId, courseUpdates, { new: true });
