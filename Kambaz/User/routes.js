import * as dao from "./dao.js";
import * as courseDao from "../Courses/dao.js";
import * as enrollmentsDao from "../Enrollments/dao.js";

export default function UserRoutes(app) {
    const createUser = async (req, res) => {
        try {
            const newUser = await dao.createUser(req.body);
            res.json(newUser);
        } catch (e) {
            res.status(500).json({ message: "Error creating user" });
        }
    };
    const deleteUser = async (req, res) => {
        try {
            await dao.deleteUser(req.params.userId);
            res.sendStatus(204);
        } catch (e) {
            res.status(500).json({ message: "Error deleting user" });
        }
    };
    const findAllUsers = async (req, res) => {
        try {
            const users = await dao.findAllUsers();
            res.json(users);
        } catch (e) {
            res.status(500).json({ message: "Error fetching users" });
        }
    };
    const findUserById = async (req, res) => {
        try {
            const user = await dao.findUserById(req.params.userId);
            if (user) {
                res.json(user);
            } else {
                res.sendStatus(404);
            }
        } catch (e) {
            res.status(500).json({ message: "Error fetching user" });
        }
    };
    const updateUser = async (req, res) => {
        try {
            const userId = req.params.userId;
            const userUpdates = req.body;
            await dao.updateUser(userId, userUpdates);
            const currentUser = await dao.findUserById(userId);
            req.session["currentUser"] = currentUser;
            res.json(currentUser);
        } catch (e) {
            res.status(500).json({ message: "Error updating user" });
        }
    };
    const signup = async (req, res) => {
        try {
            const existing = await dao.findUserByUsername(req.body.username);
            if (existing) {
                res.status(400).json({ message: "Username already in use" });
                return;
            }
            const currentUser = await dao.createUser(req.body);
            req.session["currentUser"] = currentUser;
            res.json(currentUser);
        } catch (e) {
            res.status(500).json({ message: "Error signing up" });
        }
    };
    const signin = async (req, res) => {
        try {
            const { username, password } = req.body;
            const currentUser = await dao.findUserByCredentials(username, password);
            if (currentUser) {
                req.session["currentUser"] = currentUser;
                res.json(currentUser);
            } else {
                res.status(401).json({ message: "Unable to login. Try again later." });
            }
        } catch (e) {
            res.status(500).json({ message: "Error signing in" });
        }
    };

    const signout = (req, res) => {
        req.session.destroy();
        res.sendStatus(200);
    };
    const profile = async (req, res) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            res.sendStatus(401);
            return;
        }
        res.json(currentUser);
    };
    const findCoursesForEnrolledUser = (req, res) => {
        let { userId } = req.params;
        if (userId === "current") {
            const currentUser = req.session["currentUser"];
            if (!currentUser) {
                res.sendStatus(401);
                return;
            }
            userId = currentUser._id;
        }
        const courses = courseDao.findCoursesForEnrolledUser(userId);
        res.json(courses);
    };
    const createCourse = (req, res) => {
        const currentUser = req.session["currentUser"];
        const newCourse = courseDao.createCourse(req.body);
        enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id);
        res.json(newCourse);
    };
    app.post("/api/users/current/courses", createCourse);
    app.get("/api/users/:userId/courses", findCoursesForEnrolledUser);
    app.post("/api/users", createUser);
    app.get("/api/users", findAllUsers);
    app.get("/api/users/:userId", findUserById);
    app.put("/api/users/:userId", updateUser);
    app.delete("/api/users/:userId", deleteUser);
    app.post("/api/users/signup", signup);
    app.post("/api/users/signin", signin);
    app.post("/api/users/signout", signout);
    app.post("/api/users/profile", profile);
}
