import express from 'express'
import Hello from "./Hello.js"
import Lab5 from "./Lab5/index.js";
import EnrollmentsRoutes from "./Kambaz/Enrollments/routes.js";
import cors from "cors";
import UserRoutes from "./Kambaz/User/routes.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import CourseRoutes from "./Kambaz/Courses/routes.js";
import ModuleRoutes from "./Kambaz/Modules/routes.js";
import AssignmentRoutes from "./Kambaz/Assignments/routes.js";
import mongoose from "mongoose";

const CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING || "mongodb://127.0.0.1:27017/kambaz"

// Connect to MongoDB with error handling
mongoose.connect(CONNECTION_STRING)
.then(() => {
    console.log('✅ MongoDB connected successfully');
    console.log(`📍 Database: ${CONNECTION_STRING.split('@')[1]?.split('/')[1]?.split('?')[0] || 'local'}`);
})
.catch((error) => {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
});
const app = express()

// 1. CORS must come FIRST, before any routes
app.use(cors({
    credentials: true,
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        const allowedOrigins = [
            process.env.NETLIFY_URL,
            process.env.NETLIFY_URL?.replace(/\/$/, ''), // Remove trailing slash
            "http://localhost:5173",
            "https://a6--kambaz-react-web-application.netlify.app",
            /^https:\/\/.*--aquamarine-naiad-c8742e\.netlify\.app$/,
            /^https:\/\/.*--kambaz-react-web-application\.netlify\.app$/
        ];
        
        const isAllowed = allowedOrigins.some(allowed => {
            if (typeof allowed === 'string') {
                return origin === allowed;
            } else if (allowed instanceof RegExp) {
                return allowed.test(origin);
            }
            return false;
        });
        
        if (isAllowed) {
            console.log('CORS allowed origin:', origin);
            callback(null, true);
        } else {
            console.log('CORS blocked origin:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    }
}));

// 2. Session configuration
const sessionOptions = {
    secret: process.env.SESSION_SECRET || "kambaz",
    resave: false,
    saveUninitialized: false,
    name: 'kambaz.sid', // Custom session name
    store: MongoStore.create({
        mongoUrl: CONNECTION_STRING,
        touchAfter: 24 * 3600, // lazy session update
        ttl: 24 * 60 * 60 // 24 hours TTL
    })
};

if (process.env.NODE_ENV !== "development") {
    sessionOptions.proxy = true;
    sessionOptions.cookie = {
        sameSite: "none",
        secure: true,
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        domain: undefined // Don't set domain for cross-origin
    };
} else {
    // Development configuration
    sessionOptions.cookie = {
        sameSite: "lax",
        secure: false,
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    };
}
app.use(session(sessionOptions));

// 3. Body parsing middleware
app.use(express.json());

// Debug endpoint to check session
app.get("/api/debug/session", (req, res) => {
    console.log("=== SESSION DEBUG REQUEST ===");
    console.log("Origin:", req.headers.origin);
    console.log("User-Agent:", req.headers['user-agent']);
    console.log("Session ID:", req.sessionID);
    console.log("Session data:", req.session);
    console.log("Cookies:", req.headers.cookie);
    
    res.json({
        timestamp: new Date().toISOString(),
        sessionID: req.sessionID,
        session: req.session,
        currentUser: req.session?.currentUser || null,
        cookies: req.headers.cookie || null,
        origin: req.headers.origin,
        hasSession: !!req.session,
        isAuthenticated: !!(req.session?.currentUser)
    });
});

// 4. Routes come LAST
UserRoutes(app);
CourseRoutes(app);
Lab5(app)
EnrollmentsRoutes(app);
ModuleRoutes(app);
AssignmentRoutes(app);
Hello(app)

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Database: ${CONNECTION_STRING.split('@')[1]?.split('/')[0] || 'local'}`);
});