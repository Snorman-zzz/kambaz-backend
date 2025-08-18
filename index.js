import 'dotenv/config'
import express from 'express'
import Hello from "./Hello.js"
import Lab5 from "./Lab5/index.js";
import EnrollmentsRoutes from "./Kambaz/Enrollments/routes.js";
import cors from "cors";
import UserRoutes from "./Kambaz/User/routes.js";
import session from "express-session";
import CourseRoutes from "./Kambaz/Courses/routes.js";
import ModuleRoutes from "./Kambaz/Modules/routes.js";
import AssignmentRoutes from "./Kambaz/Assignments/routes.js";
import mongoose from "mongoose";

let CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING;
if (CONNECTION_STRING && CONNECTION_STRING.includes("MONGO_CONNECTION_STRING=")) {
    CONNECTION_STRING = CONNECTION_STRING.split("MONGO_CONNECTION_STRING=").pop();
}
if (!CONNECTION_STRING) {
    CONNECTION_STRING = "mongodb://127.0.0.1:27017/kambaz";
}
mongoose
    .connect(CONNECTION_STRING)
    .catch((err) => {
        console.error("Mongo connection error:", err?.message || err);
    });
const app = express()

// 1. CORS must come FIRST, before any routes
app.use(cors({
    credentials: true,
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        const allowedOrigins = [
            process.env.FRONTEND_URL?.replace(/\/$/, ''),
            process.env.NETLIFY_URL?.replace(/\/$/, ''),
            "http://localhost:5173",
            /^https?:\/\/.*\.netlify\.app$/,
            /^https?:\/\/.*\.onrender\.com$/
        ];

        const isAllowed = allowedOrigins.some(allowed => {
            if (typeof allowed === 'string' && allowed) {
                return origin === allowed;
            } else if (allowed instanceof RegExp) {
                return allowed.test(origin);
            }
            return false;
        });

        if (isAllowed) {
            callback(null, true);
        } else {
            console.log('CORS blocked origin:', origin);
            callback(null, false);
        }
    }
}));

// 2. Session configuration
const sessionOptions = {
    secret: process.env.SESSION_SECRET || "kambaz",
    resave: false,
    saveUninitialized: false,
};

if (process.env.NODE_ENV !== "development") {
    sessionOptions.proxy = true;
    sessionOptions.cookie = {
        sameSite: "none",
        secure: true,
        domain: process.env.NODE_SERVER_DOMAIN,
    };
}
app.use(session(sessionOptions));

// 3. Body parsing middleware
app.use(express.json());

// 4. Routes come LAST
UserRoutes(app);
CourseRoutes(app);
Lab5(app)
EnrollmentsRoutes(app);
ModuleRoutes(app);
AssignmentRoutes(app);
Hello(app)

// 5. Healthcheck and root endpoints
app.get("/health", (req, res) => {
    res.status(200).send("healthy");
});
app.get("/", (req, res) => {
    res.status(200).send("OK");
});

app.listen(process.env.PORT || 4000)