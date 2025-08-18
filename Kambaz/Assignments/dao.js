import model from "./model.js";

export const findAssignmentsForCourse = (courseId) => {
  return model.find({ course: courseId });
};

export const createAssignment = (courseId, assignment) => {
  return model.create({ ...assignment, course: courseId });
};

export const updateAssignment = (assignmentId, updates) => {
  return model.findByIdAndUpdate(assignmentId, updates, { new: true });
};

export const deleteAssignment = (assignmentId) => {
  return model.findByIdAndDelete(assignmentId);
};
