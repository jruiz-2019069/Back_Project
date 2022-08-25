const sequelize = require("../bin/sequelize");
const validate = require('../utils/validate');
const { models } = sequelize;

exports.register = async (req, res) => {
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

exports.login = async (req, res) => {
    try {
        const params = req.body;
        let data = {
            username: params.username,
            password: params.password
        }
        let msg = validate.validateData(data);
        if(msg) return res.status(400).send(msg);
        let alredyUser = await User.findOne({
            where: { 
                username: data.username
            }
        });
        if(alredyUser && data.password == alredyUser.password){
            return res.send({message: 'Login sucessfully', alredyUser})
        } else return res.send({message: 'Invalid credentials'})
    } catch (error) {
        console.log(error);
        return error;
    }
}