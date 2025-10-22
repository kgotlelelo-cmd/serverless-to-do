const { getUserService, createUserService } = require("./user.service");

const getUserController = async (req, res) => {

    const { email } = req.params;
    try {
        const user = await getUserService(email);
        if (!user) {
            return res.status(404).json({ error: 'Could not find user with provided "email"' });
        }
        const { userId, name } = user;
        res.json({ userId, name });
    } catch (error) {
        res.status(500).json({ error: "Could not retrieve user" });
    }
}

const createUserController = async (req, res) => {
    const { name, email } = req.body;

    if (typeof name !== "string") {
        return res.status(400).json({ error: '"name" must be a string' });
    }
    if (typeof email !== "string") {
        return res.status(400).json({ error: '"email" must be a string' });
    }

    try {
        const user = await createUserService(name, email);
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Could not create user" });
    }
}

module.exports = {
    getUserController,
    createUserController
};