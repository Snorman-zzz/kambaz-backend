import Database from "../Database/index.js";
import { v4 as uuidv4 } from "uuid";

export const findAssignmentsForCourse = (courseId) => {
  return Database.assignments.filter((a) => a.course === courseId);
};

export const createAssignment = (courseId, assignment) => {
  const newAssignment = { ...assignment, _id: uuidv4(), course: courseId };
  Database.assignments = [...Database.assignments, newAssignment];
  return newAssignment;
};

export const updateAssignment = (assignmentId, updates) => {
  Database.assignments = Database.assignments.map((a) =>
    a._id === assignmentId ? { ...a, ...updates } : a
  );
  return Database.assignments.find((a) => a._id === assignmentId);
};

export const deleteAssignment = (assignmentId) => {
  Database.assignments = Database.assignments.filter((a) => a._id !== assignmentId);
  return { status: "ok" };
};
