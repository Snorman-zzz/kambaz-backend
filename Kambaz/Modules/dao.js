import model from "./model.js";

export const updateModule = (moduleId, moduleUpdates) =>
    model.findByIdAndUpdate(moduleId, moduleUpdates, { new: true });

export const deleteModule = (moduleId) => model.findByIdAndDelete(moduleId);

export const createModule = (module) => model.create(module);

export const findModulesForCourse = (courseId) => 
    model.find({ course: courseId });