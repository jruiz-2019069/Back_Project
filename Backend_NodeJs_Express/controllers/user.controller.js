const sequelize = require("../bin/sequelize");
const validate = require('../utils/validate');
const jwt = require("../middlewares/jwt");
const moment = require("moment");
const { models } = sequelize;

// ADMIN
exports.register = async (req, res) => {
    try {
        const params = req.body;
        let data = {
            username: params.username.toLowerCase(),
            firstName: params.firstName,
            lastName: params.lastName,
            mail: params.mail.toLowerCase(),
            password: await validate.encrypt(params.username + "123"),
            activated: false,
            loginAttemps: 0,
            isLocked: false,
            lockUntil: 0,
            deleted: false,
            needChangePassword: true
        }
        const msg = validate.validateData(data);
        if(msg){
            return res.status(400).send(msg);
        }else{
            const userName = await User.findOne({
                where: {
                    username: data.username
                }
            });  
            const mail = await User.findOne({
                where: {
                    mail: data.mail
                }
            });
            if(userName && mail){
                return res.status(400).send({message: "Username and email already exist."});
            }else{
                if(userName){
                    return res.status(400).send({message: "Username already exist."});
                }else{
                    if(mail){
                        return res.status(400).send({message: "Email already exist."});
                    }else{
                        data.image = "";
                        data.resetPasswordToken = "";
                        data.activateUserToken = "";
                        data.sessionUserToken = "";
                        const user = await User.create(data);
                        await user.save();
                        return res.send({message: "User created.", user});
                    }
                }
            }
        }
    } catch (error) {
        console.log(error);
        return error;
    }
}

exports.login = async (req, res) => {
    try {
        const params = req.body;
        let data = {
            username: params.username.toLowerCase(),
            password: params.password
        }
        const usernameExist = await User.findOne({
            where: {
                username: data.username 
            }
        });
        if(usernameExist){
            if(usernameExist.deleted){
                return res.status(400).send({message: "Non-existing account."});
            }else{
                if(usernameExist.isLocked){
                    // PRUEBA LOCKED
                    if(usernameExist.lockUntil != 0){
                        if(moment().unix() > usernameExist.lockUntil){
                            let lockedUpdated = await User.update({
                                isLocked: false,
                                lockUntil: 0,
                                loginAttemps: 0
                            }, {
                                where: {
                                    id: usernameExist.id
                                }
                            });
                            const newUserSearch = await User.findOne({
                                where: {
                                    username: data.username 
                                }
                            });
                            console.log(newUserSearch.loginAttemps);
                            // 
                            if(await validate.checkPassword(params.password, newUserSearch.password)){
                                //ACTUALIZAR EL LOGIN ATTEPMT A 0
                                const attempsUpdated = await User.update({
                                    loginAttemps: 0
                                }, {
                                    where: {
                                        id: newUserSearch.id
                                    }
                                });
                                //SE CREA EL TOKEN
                                const token = await jwt.createToken(newUserSearch);
                                return res.send({message: "LOGEADO", token});
                            }else{
                                if(newUserSearch.loginAttemps < 2){
                                    let loginAttemps = newUserSearch.loginAttemps;
                                    const attempsUpdated = await User.update({
                                        loginAttemps: loginAttemps + 1
                                    }, {
                                        where: {
                                            id: newUserSearch.id
                                        }
                                    });
                                    return res.send({message: `Invalid credentials. Remaining attempts: ${3-(newUserSearch.loginAttemps+1)}`});
                                }else{
                                    const locked = await User.update({
                                        isLocked: true,
                                        lockUntil: moment().unix() + 15
                                    }, {
                                        where: {
                                            id: newUserSearch.id
                                        }
                                    });
                                    return res.status(200).send({message: "Your account has been locked for 20 min."});
                                }
                            }
                            // 
                        }else{
                            return res.status(400).send({message: "Your account is still locked."});
                        }
                    }else{
                        return res.status(400).send({message: "Your account has been blocked by an administrator."});
                    }
                    // FIN PRUEBA
                }else{
                    if(await validate.checkPassword(params.password, usernameExist.password)){
                        //ACTUALIZAR EL LOGIN ATTEPMT A 0
                        const attempsUpdated = await User.update({
                            loginAttemps: 0
                        }, {
                            where: {
                                id: usernameExist.id
                            }
                        });
                        //SE CREA EL TOKEN
                        const token = await jwt.createToken(usernameExist);
                        return res.send({message: "LOGEADO", token});
                    }else{
                        if(usernameExist.loginAttemps < 2){
                            let loginAttemps = usernameExist.loginAttemps;
                            const attempsUpdated = await User.update({
                                loginAttemps: loginAttemps + 1
                            }, {
                                where: {
                                    id: usernameExist.id
                                }
                            });
                            return res.send({message: `Invalid credentials. Remaining attempts: ${3-(usernameExist.loginAttemps+1)}`});
                        }else{
                            const locked = await User.update({
                                isLocked: true,
                                lockUntil: moment().unix() + 15
                            }, {
                                where: {
                                    id: usernameExist.id
                                }
                            });
                            return res.status(200).send({message: "Your account has been locked for 20 min."});
                        }
                    }
                }
            }
        }else{
            return res.send({message: "Non-existing account."});
        }
    } catch (error) {
        console.log(error);
        return error;
    }
}