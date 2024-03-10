import usersModel from "./models/user.model.js";
import session from "express-session";

export default class UserServiceMongo {
    constructor() {
        console.log("Database persistence in mongodb");
    }

    getAll = async () => {
        let users = await usersModel.find();
        return users.map(user => user.toObject());
    }
    save = async (user) => {
        let result = await usersModel.create(user);
        return result;
    }

    findByUsername = async (username) => {
        const result = await usersModel.findOne({ email: username });
        return result;
    };

    update = async (filter, value) => {
        console.log("Update user with filter and value:");
        console.log(filter);
        console.log(value);
        let result = await usersModel.updateOne(filter, value);
        return result;
    }
}