const assignment = {
    id: 1,
    title: "NodeJS Assignment",
    description: "Create a NodeJS server with ExpressJS",
    due: "2021-10-10",
    completed: false,
    score: 0,
};

// New module object for Lab 5
const moduleObject = {
    id: "M101",
    name: "React Module",
    description: "Hands-on React development module",
    course: "CS1234",
};

export default function WorkingWithObjects(app) {
    /* ---------------- Assignment routes ---------------- */
    app.get("/lab5/assignment", (req, res) => {
        res.json(assignment);
    });

    app.get("/lab5/assignment/title", (req, res) => {
        res.json(assignment.title);
    });

    app.get("/lab5/assignment/title/:newTitle", (req, res) => {
        const { newTitle } = req.params;
        assignment.title = newTitle;
        res.json(assignment);
    });

    // Route to update assignment score
    app.get("/lab5/assignment/score/:newScore", (req, res) => {
        const { newScore } = req.params;
        assignment.score = Number(newScore);
        res.json(assignment);
    });

    // Route to update assignment completed status
    app.get("/lab5/assignment/completed/:completed", (req, res) => {
        const { completed } = req.params;
        assignment.completed = completed === "true" || completed === "1";
        res.json(assignment);
    });

    /* ---------------- Module routes ---------------- */
    // Retrieve the whole module object
    app.get("/lab5/module", (req, res) => {
        res.json(moduleObject);
    });

    // Retrieve the module name
    app.get("/lab5/module/name", (req, res) => {
        res.json(moduleObject.name);
    });

    // Update the module name
    app.get("/lab5/module/name/:newName", (req, res) => {
        const { newName } = req.params;
        moduleObject.name = newName;
        res.json(moduleObject);
    });

    // Retrieve the module description (optional helper route)
    app.get("/lab5/module/description", (req, res) => {
        res.json(moduleObject.description);
    });

    // Update the module description
    app.get("/lab5/module/description/:newDescription", (req, res) => {
        const { newDescription } = req.params;
        moduleObject.description = newDescription;
        res.json(moduleObject);
    });
}
