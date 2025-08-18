import * as dao from "./dao.js";

export default function ModuleRoutes(app) {
    app.put("/api/modules/:moduleId", async (req, res) => {
        try {
            const { moduleId } = req.params;
            const moduleUpdates = req.body;
            const updatedModule = await dao.updateModule(moduleId, moduleUpdates);
            res.send(updatedModule);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    app.delete("/api/modules/:moduleId", async (req, res) => {
        try {
            const { moduleId } = req.params;
            await dao.deleteModule(moduleId);
            res.status(200).json({ message: "Module deleted successfully" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
}