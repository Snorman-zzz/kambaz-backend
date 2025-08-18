import * as dao from "./dao.js";

export default function AssignmentRoutes(app) {
  app.get("/api/courses/:cid/assignments", (req, res) => {
    const assignments = dao.findAssignmentsForCourse(req.params.cid);
    res.json(assignments);
  });

  app.post("/api/courses/:cid/assignments", (req, res) => {
    const assignment = dao.createAssignment(req.params.cid, req.body);
    res.json(assignment);
  });

  app.put("/api/assignments/:aid", (req, res) => {
    const assignment = dao.updateAssignment(req.params.aid, req.body);
    res.json(assignment);
  });

  app.delete("/api/assignments/:aid", (req, res) => {
    dao.deleteAssignment(req.params.aid);
    res.sendStatus(204);
  });
}
