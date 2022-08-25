const sequelize = require("../bin/sequelize");

const { models } = sequelize;

exports.login = async (req, res) => {
    try {
        let data = {
            username: "user1",
            password: "123"
        }
        const user = await User.create(data);
        await user.save();
        return res.send({user});
    } catch (error) {
        console.log(error);
        return error;
    }
}