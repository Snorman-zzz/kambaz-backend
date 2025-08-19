import * as dao from "./dao.js";

export default function EnrollmentsRoutes(app) {
  // Get all enrollments for a user
  app.get("/api/users/:uid/enrollments", async (req, res) => {
    try {
      const data = await dao.findEnrollmentsByUser(req.params.uid);
      res.json(data);
    } catch (error) {
      console.error("Error fetching user enrollments:", error);
      res.status(500).json({ message: "Error fetching enrollments" });
    }
  });

  // Enroll a user in a course (expects {user, course} body)
  app.post("/api/enrollments", async (req, res) => {
    try {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const { user, course } = req.body;
      
      // Verify the user is enrolling themselves or is an admin
      if (user !== currentUser._id && currentUser.role !== "ADMIN") {
        return res.status(403).json({ message: "Not authorized to enroll this user" });
      }

      const record = await dao.enrollUserInCourse(user, course);
      res.json(record);
    } catch (error) {
      console.error("Error enrolling user:", error);
      if (error.message === "User is already enrolled in this course") {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Error enrolling in course" });
      }
    }
  });

  // Unenroll (expects user & course as body)
  app.delete("/api/enrollments", async (req, res) => {
    try {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const { user, course } = req.body;
      
      // Verify the user is unenrolling themselves or is an admin
      if (user !== currentUser._id && currentUser.role !== "ADMIN") {
        return res.status(403).json({ message: "Not authorized to unenroll this user" });
      }

      const result = await dao.unenrollUserFromCourse(user, course);
      if (result) {
        res.json({ message: "Unenrolled successfully" });
      } else {
        res.status(404).json({ message: "Enrollment not found" });
      }
    } catch (error) {
      console.error("Error unenrolling user:", error);
      res.status(500).json({ message: "Error unenrolling from course" });
    }
  });

  // Get all enrollments (admin only)
  app.get("/api/enrollments", async (req, res) => {
    try {
      const currentUser = req.session["currentUser"];
      if (!currentUser || currentUser.role !== "ADMIN") {
        return res.status(403).json({ message: "Admin access required" });
      }

      const data = await dao.findAllEnrollments();
      res.json(data);
    } catch (error) {
      console.error("Error fetching all enrollments:", error);
      res.status(500).json({ message: "Error fetching enrollments" });
    }
  });

  // Get enrollments for a specific course
  app.get("/api/courses/:courseId/enrollments", async (req, res) => {
    try {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const data = await dao.findEnrollmentsByCourse(req.params.courseId);
      res.json(data);
    } catch (error) {
      console.error("Error fetching course enrollments:", error);
      res.status(500).json({ message: "Error fetching course enrollments" });
    }
  });
}
