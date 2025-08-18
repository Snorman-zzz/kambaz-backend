import * as dao from "./dao.js";
import * as modulesDao from "../Modules/dao.js";
export default function CourseRoutes(app) {
    app.post("/api/courses", async (req, res) => {
        try {
            const newCourse = await dao.createCourse(req.body);
            res.send(newCourse);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
    app.post("/api/courses/:courseId/modules", async (req, res) => {
        try {
            const { courseId } = req.params;
            const module = {
                ...req.body,
                course: courseId,
            };
            const newModule = await modulesDao.createModule(module);
            res.send(newModule);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
    app.get("/api/courses", async (req, res) => {
        try {
            const courses = await dao.findAllCourses();
            res.send(courses);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
    app.delete("/api/courses/:courseId", async (req, res) => {
        try {
            const { courseId } = req.params;
            await dao.deleteCourse(courseId);
            res.status(200).json({ message: "Course deleted successfully" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
    app.put("/api/courses/:courseId", async (req, res) => {
        try {
            const { courseId } = req.params;
            const courseUpdates = req.body;
            const updatedCourse = await dao.updateCourse(courseId, courseUpdates);
            res.send(updatedCourse);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
    app.get("/api/courses/:courseId/modules", async (req, res) => {
        try {
            const { courseId } = req.params;
            const modules = await modulesDao.findModulesForCourse(courseId);
            res.json(modules);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
}