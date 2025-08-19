import model from "./model.js";

export const createUser = (user) => model.create(user);
export const findAllUsers = () => model.find();
export const findUserById = (userId) => model.findById(userId);
export const findUserByUsername = (username) => model.findOne({ username: username });
export const findUserByCredentials = (username, password) => model.findOne({ username, password });
export const updateUser = (userId, user) => model.findByIdAndUpdate(userId, user, { new: true });
export const deleteUser = (userId) => model.findByIdAndDelete(userId);
export const findUsersByRole = (role) => model.find({ role: role });
export const findUsersByPartialName = (name) => {
    const regex = new RegExp(name, 'i');
    return model.find({
        $or: [
            { firstName: regex },
            { lastName: regex }
        ]
    });
};