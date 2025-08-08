import model from "./model.js";
import Database from "../Database/index.js";

// Ensure sample users exist in MongoDB (upsert each one)
(async () => {
  try {
    if (!Array.isArray(Database.users)) return;
    for (const user of Database.users) {
      await model.updateOne({ _id: user._id }, { $setOnInsert: user }, { upsert: true });
    }
    console.log("Sample users ensured/upserted in MongoDB.");
  } catch (e) {
    console.error("Error seeding users collection:", e);
  }
})();

export const createUser = (user) => {
    const newUser = { ...user, _id: uuidv4() };
    return model.create(newUser);
}
export const findAllUsers = async () => model.find().lean();
export const findUserById = (userId) => model.findById(userId);
export const findUserByUsername = async (username) =>  model.findOne({ username }).lean();
export const findUserByCredentials = async (username, password) =>  model.findOne({ username, password }).lean();
export const updateUser = (userId, user) => model.updateOne({ _id: userId }, { $set: user });
export const deleteUser = (userId) => model.deleteOne({ _id: userId });
export const findUsersByRole = (role) => model.find({ role: role });
export const findUsersByPartialName = (partialName) => {
    const regex = new RegExp(partialName, "i"); // 'i' makes it case-insensitive
    return model.find({
        $or: [{ firstName: { $regex: regex } }, { lastName: { $regex: regex } }],
    });
};
