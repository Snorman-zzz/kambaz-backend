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
            const deletedUser = await dao.deleteUser(req.params.userId);
            if (deletedUser) {
                res.json({ message: "User deleted successfully" });
            } else {
                res.status(404).json({ message: "User not found" });
            }
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
            const updatedUser = await dao.updateUser(userId, userUpdates);
            if (req.session["currentUser"]?._id === userId) {
                req.session["currentUser"] = updatedUser;
            }
            res.json(updatedUser);
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
    const findUsersByRole = async (req, res) => {
        try {
            const { role } = req.params;
            const users = await dao.findUsersByRole(role);
            res.json(users);
        } catch (e) {
            res.status(500).json({ message: "Error fetching users by role" });
        }
    };
    const findUsersByPartialName = async (req, res) => {
        try {
            const { name } = req.params;
            const users = await dao.findUsersByPartialName(name);
            res.json(users);
        } catch (e) {
            res.status(500).json({ message: "Error fetching users by name" });
        }
    };
    const findCoursesForEnrolledUser = async (req, res) => {
        try {
            let { userId } = req.params;
            if (userId === "current") {
                const currentUser = req.session["currentUser"];
                if (!currentUser) {
                    res.sendStatus(401);
                    return;
                }
                userId = currentUser._id;
            }
            // For now, return all courses since enrollment logic needs to be implemented
            const courses = await courseDao.findAllCourses();
            res.json(courses);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };
    const createCourse = async (req, res) => {
        try {
            const currentUser = req.session["currentUser"];
            if (!currentUser) {
                res.sendStatus(401);
                return;
            }
            const newCourse = await courseDao.createCourse(req.body);
            // TODO: Implement enrollment logic with MongoDB
            res.json(newCourse);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };
    app.post("/api/users/current/courses", createCourse);
    app.get("/api/users/:userId/courses", findCoursesForEnrolledUser);
    app.post("/api/users", createUser);
    app.get("/api/users", findAllUsers);
    app.get("/api/users/role/:role", findUsersByRole);
    app.get("/api/users/name/:name", findUsersByPartialName);
    app.get("/api/users/:userId", findUserById);
    app.put("/api/users/:userId", updateUser);
    app.delete("/api/users/:userId", deleteUser);
    app.post("/api/users/signup", signup);
    app.post("/api/users/signin", signin);
    app.post("/api/users/signout", signout);
    app.post("/api/users/profile", profile);
}
