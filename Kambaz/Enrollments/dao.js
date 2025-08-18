import Database from "../Database/index.js";
import { v4 as uuidv4 } from "uuid";

export function findEnrollmentsByUser(userId) {
  return Database.enrollments.filter((e) => e.user === userId);
}

export function enrollUserInCourse(userId, courseId) {
  if (Database.enrollments.some((e) => e.user === userId && e.course === courseId)) {
    return { status: "duplicate" };
  }
  const record = { _id: uuidv4(), user: userId, course: courseId };
  Database.enrollments.push(record);
  return record;
}

export function unenrollUserFromCourse(userId, courseId) {
  Database.enrollments = Database.enrollments.filter(
    (e) => !(e.user === userId && e.course === courseId)
  );
  return { status: "ok" };
}
