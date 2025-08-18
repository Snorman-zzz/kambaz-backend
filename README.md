# Kambaz Node.js Server Application

A comprehensive Node.js HTTP web server for the Kambaz learning management system, providing RESTful APIs for course management, user authentication, enrollments, assignments, and more.

## 🚀 Live Deployment

**Production Server**: https://kambaz-node-server-app-2ur0.onrender.com

## 📋 Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Technologies](#technologies)
- [Development](#development)

## ✨ Features

- **User Management**: Authentication, registration, profile management
- **Course Management**: CRUD operations for courses
- **Enrollment System**: Enroll/unenroll users from courses
- **Assignment Management**: Create, read, update, delete assignments
- **Module Management**: Course modules with lessons
- **People Management**: User roster with role-based permissions
- **Session Management**: Secure user sessions with express-session
- **CORS Support**: Cross-origin resource sharing for frontend integration

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Snorman-zzz/kambaz-node-server-app.git
   cd kambaz-node-server-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   PORT=4000
   SESSION_SECRET=your-secret-key
   NODE_ENV=development
   NETLIFY_URL=http://localhost:5173
   ```

4. **Start the server**
   ```bash
   npm start
   ```

The server will start on `http://localhost:4000` (or the port specified in your environment).

## 🚀 Usage

### Development Mode
```bash
npm start
```

### Production Mode
The application is configured for deployment on Render.com with automatic environment detection.

## 📡 API Endpoints

### Authentication & Users
- `POST /api/users/signup` - User registration
- `POST /api/users/signin` - User login
- `POST /api/users/signout` - User logout
- `POST /api/users/profile` - Get current user profile
- `GET /api/users` - Get all users
- `GET /api/users/:userId` - Get specific user
- `POST /api/users` - Create new user
- `PUT /api/users/:userId` - Update user
- `DELETE /api/users/:userId` - Delete user

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:courseId` - Get specific course
- `POST /api/courses` - Create new course
- `PUT /api/courses/:courseId` - Update course
- `DELETE /api/courses/:courseId` - Delete course
- `GET /api/users/:userId/courses` - Get courses for enrolled user
- `POST /api/users/current/courses` - Create course for current user

### Enrollments
- `GET /api/users/:uid/enrollments` - Get enrollments for user
- `POST /api/enrollments` - Enroll user in course
- `DELETE /api/enrollments` - Unenroll user from course

### Assignments
- `GET /api/courses/:cid/assignments` - Get assignments for course
- `POST /api/courses/:cid/assignments` - Create assignment for course
- `PUT /api/assignments/:aid` - Update assignment
- `DELETE /api/assignments/:aid` - Delete assignment

### Modules
- `GET /api/courses/:cid/modules` - Get modules for course
- `POST /api/courses/:cid/modules` - Create module for course
- `PUT /api/modules/:moduleId` - Update module
- `DELETE /api/modules/:moduleId` - Delete module

## 📁 Project Structure

```
kambaz-node-server-app/
├── index.js                 # Main server entry point
├── package.json            # Project dependencies and scripts
├── Hello.js               # Hello world endpoint
├── Lab5/                  # Lab 5 exercises
└── Kambaz/               # Main application modules
    ├── Database/          # In-memory database
    │   ├── index.js      # Database exports
    │   ├── users.js      # User data
    │   ├── courses.js    # Course data
    │   ├── modules.js    # Module data
    │   ├── assignments.js # Assignment data
    │   ├── enrollments.js # Enrollment data
    │   └── grades.js     # Grade data
    ├── User/             # User management
    │   ├── dao.js        # User data access
    │   └── routes.js     # User API routes
    ├── Courses/          # Course management
    │   ├── dao.js        # Course data access
    │   └── routes.js     # Course API routes
    ├── Modules/          # Module management
    │   ├── dao.js        # Module data access
    │   └── routes.js     # Module API routes
    ├── Assignments/      # Assignment management
    │   ├── dao.js        # Assignment data access
    │   └── routes.js     # Assignment API routes
    └── Enrollments/      # Enrollment management
        ├── dao.js        # Enrollment data access
        └── routes.js     # Enrollment API routes
```

## 🛠️ Technologies

- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Express Session** - Session management
- **CORS** - Cross-origin resource sharing
- **UUID** - Unique identifier generation
- **Axios** - HTTP client (for external requests)

## 🔧 Development

### Adding New Features

1. **Create DAO functions** in the appropriate `dao.js` file
2. **Add routes** in the corresponding `routes.js` file
3. **Register routes** in `index.js`
4. **Update database** if needed in the `Database/` directory

### Database

The application uses an in-memory database stored in JSON files within the `Database/` directory. Data persists during server runtime but resets on server restart.

### Session Management

User sessions are managed using `express-session` with configurable options for development and production environments.

### CORS Configuration

CORS is configured to allow requests from the React frontend application, with different origins for development and production.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Mingze Yuan**

- GitHub: [@Snorman-zzz](https://github.com/Snorman-zzz)
- Repository: [kambaz-node-server-app](https://github.com/Snorman-zzz/kambaz-node-server-app)

## 🔗 Related Projects

- **Frontend**: [kambaz-react-web-app](https://github.com/Snorman-zzz/kambaz-react-web-app)
- **Live Demo**: [Kambaz LMS](https://kambaz-react-web-app.onrender.com)

---

**Note**: This server is designed to work with the Kambaz React frontend application. For the complete learning management system experience, please also check out the frontend repository. 