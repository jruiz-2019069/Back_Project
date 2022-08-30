const sequelize = require("../bin/sequelize");
const validate = require('../utils/validate');
const jwt = require("../middlewares/jwt");
const moment = require("moment");
const { models } = sequelize;
const nodemailer = require('nodemailer');
require("dotenv").config();



// ADMIN
exports.register = async (req, res) => {
    try {
        const params = req.body;
        let data = {
            username: params.username,
            firstName: params.firstName,
            lastName: params.lastName,
            mail: params.mail,
            password: await validate.encrypt(params.username + "123"),
            activated: false,
            loginAttemps: 0,
            isLocked: false,
            lockUntil: 0,
            deleted: false,
            needChangePassword: true
        }
        const msg = validate.validateData(data);
        if(msg) return res.status(400).send(msg);
        
        data.username.toLowerCase();
        data.mail.toLowerCase();
        
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
        
    } catch (error) {
        console.log(error);
        return error;
    }
}

//ENVIAR CREDENCIALES POR CORREO
exports.sendCredentials = async(req,res) =>{
    try {
        const email = req.params.email; 
        const mail = await User.findOne({
            where: {
                mail: email
            }
        });
        console.log(mail);
        let transporter = nodemailer.createTransport({
            service:'gmail',
            secure: true,
            auth: {
                user: process.env.USERMAIL,
                pass: process.env.PASSMAIL
            }
        });


        let mail_options = {
            from: process.env.FROM_MAIL,
            to: email,
            subject: `Bienvenido `,
            html:  'Hola' + ' ' + mail.firstName + ' ' + mail.lastName + ', ' + 'gusto en saludarte,' + 
            ' <br>' +
            ' <br>' + '•Usuario:'+ ' ' +  mail.username + 
            ' <br>' + '•Tu contraseña temporal es:' + ' ' + mail.password + 
            ' <br>' + '•Link para restablecer tu contraseña:' + ' ' + 'https://bdgsa.net/' +
            ' <br>' +  
            ' <br>' + 'Saludos Cordiales,'
        };

        transporter.sendMail(mail_options, (error, info) => {
            if (error) {
                console.log(error);
            } else {
                console.log('El correo se envío correctamente ' + info.response);
            }
        });

        return res.send({message: 'Message sent'})
  
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
        const msg = validate.validateData(data);
        if(msg) return res.status(400).send(msg);

        data.username.toLowerCase();
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
                                //SE CREA EL TOKEN
                                let token = await jwt.createToken(newUserSearch);

                                //ACTUALIZAR EL LOGIN ATTEPMT A 0 e ingresar el token
                                const attempsUpdated = await User.update({
                                    loginAttemps: 0,
                                    sessionUserToken: token
                                }, {
                                    where: {
                                        id: newUserSearch.id
                                    }
                                });
                                
                                return res.status(200).send({message: "LOGEADO", token, newUserSearch});
                            }else{
                                if(newUserSearch.loginAttemps < parseInt(process.env.ATTEMPTS)){
                                    let loginAttemps = newUserSearch.loginAttemps;
                                    const attempsUpdated = await User.update({
                                        loginAttemps: loginAttemps + 1
                                    }, {
                                        where: {
                                            id: newUserSearch.id
                                        }
                                    });
                                    return res.status(400).send({message: `Invalid credentials. Remaining attempts: ${3-(newUserSearch.loginAttemps+1)}`});
                                }else{
                                    const locked = await User.update({
                                        isLocked: true,
                                        lockUntil: moment().unix() + parseInt(process.env.TIMELOCKED)
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
                        //SE CREA EL TOKEN
                        const token = await jwt.createToken(usernameExist);

                        //ACTUALIZAR EL LOGIN ATTEPMT A 0 e ingresar el token
                        const attempsUpdated = await User.update({
                            loginAttemps: 0,
                            sessionUserToken: token
                        }, {
                            where: {
                                id: usernameExist.id
                            }
                        });
                        
                        return res.status(200).send({message: "LOGEADO", token, usernameExist});
                    }else{
                        if(usernameExist.loginAttemps < parseInt(process.env.ATTEMPTS)){
                            let loginAttemps = usernameExist.loginAttemps;
                            const attempsUpdated = await User.update({
                                loginAttemps: loginAttemps + 1
                            }, {
                                where: {
                                    id: usernameExist.id
                                }
                            });
                            return res.status(200).send({message: `Invalid credentials. Remaining attempts: ${3-(usernameExist.loginAttemps+1)}`});
                        }else{
                            const locked = await User.update({
                                isLocked: true,
                                lockUntil: moment().unix() + parseInt(process.env.TIMELOCKED)
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
            return res.status(400).send({message: "Non-existing account."});
        }
    } catch (error) {
        console.log(error);
        return error;
    }
}