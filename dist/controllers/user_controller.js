import User from "../models/user_model";
const createUser = async (req, res) => {
    try {
        const user = await User.create(req.body);
        if (user) {
            res.status(202).send(user);
        }
        else {
            res.status(404).send("User was not created");
        }
    }
    catch (err) {
        res.status(400).send(err.message);
    }
};
export { createUser };
