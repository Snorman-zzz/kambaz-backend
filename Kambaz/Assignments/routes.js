import * as dao from "./dao.js";

export default function AssignmentRoutes(app) {
  app.get("/api/courses/:cid/assignments", async (req, res) => {
    try {
      const assignments = await dao.findAssignmentsForCourse(req.params.cid);
      res.json(assignments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/courses/:cid/assignments", async (req, res) => {
    try {
      const assignment = await dao.createAssignment(req.params.cid, req.body);
      res.json(assignment);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put("/api/assignments/:aid", async (req, res) => {
    try {
      const assignment = await dao.updateAssignment(req.params.aid, req.body);
      res.json(assignment);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/assignments/:aid", async (req, res) => {
    try {
      await dao.deleteAssignment(req.params.aid);
      res.status(200).json({ message: "Assignment deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
}
