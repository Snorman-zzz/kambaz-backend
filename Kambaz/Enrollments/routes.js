import * as dao from "./dao.js";

export default function EnrollmentsRoutes(app) {
  // Get all enrollments for a user
  app.get("/api/users/:uid/enrollments", (req, res) => {
    const data = dao.findEnrollmentsByUser(req.params.uid);
    res.json(data);
  });

  // Enroll a user in a course (expects {user, course} body)
  app.post("/api/enrollments", (req, res) => {
    const { user, course } = req.body;
    const record = dao.enrollUserInCourse(user, course);
    res.json(record);
  });

  // Unenroll (expects user & course as query params or body)
  app.delete("/api/enrollments", (req, res) => {
    const { user, course } = req.body;
    dao.unenrollUserFromCourse(user, course);
    res.sendStatus(204);
  });
}
