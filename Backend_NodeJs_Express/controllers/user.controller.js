const validate = require('../utils/validate');
const jwt = require("../middlewares/jwt");
const moment = require("moment");
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();
const fs = require('fs');
const path = require('path');
const User = require("../models/User.model");
const User_Rol = require("../models/User_Rol.model");
const Role_Functions = require("../models/Role_Functions.model");
const Function = require("../models/Functions.model");

// ADMIN
exports.register = async (req, res) => {
    try {
        const params = req.body;
        
        const tempPassword = uuidv4().substring(0, 8);
        let data = {
            username: params.username,
            firstName: params.firstName,
            lastName: params.lastName,
            mail: params.mail,
            password: await validate.encrypt(tempPassword),
            activated: false,
            loginAttemps: 0,
            isLocked: false,
            lockUntil: 0,
            deleted: false,
            needChangePassword: true
        }
        const msg = validate.validateData(data);
        if (msg) return res.status(400).send(msg);

        data.username = data.username.toUpperCase();
        data.mail = data.mail.toLowerCase();

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

        const validateEmail = p => p.search(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        
        if(validateEmail(data.mail)) return res.status(400).send({ message: res.i18n.t('register_400') });
        
        if (userName && mail && mail.deleted == false) {
            return res.status(400).send({ message: res.i18n.t('register_401') });
        }
        if (userName) return res.status(400).send({ message: res.i18n.t('register_402') });
        if (mail && mail.deleted == false) return res.status(400).send({ message: res.i18n.t('register_403') });
        data.image = "";
        data.resetPasswordToken = "";
        data.activateUserToken = "";
        data.sessionUserToken = "";

        //Asignar al menos un rol
        const idsRol = params.idsRol;
        if (idsRol == undefined || idsRol.length == 0) return res.status(400).send({ message: res.i18n.t('register_404') });

        const user = await User.create(data);
        await user.save();

        //Agregarle al usuario los roles que desee
        for (let i = 0; i < idsRol.length; i++) {
            let data = {
                UserId: user.id,
                RolId: idsRol[i]
            }
            let user_rol = await User_Rol.build(data);
            await user_rol.save();
        };
        
        let emailSend = (/true/i).test(params.sendEmail);
        if (emailSend) this.sendCredentials(user, tempPassword);
        if (req.files.image) {
            const alreadyImage = await User.findOne({
                where: {
                    id: user.id
                }
            });
            let pathFile = './views/users/';
            if (alreadyImage.image) fs.unlinkSync(pathFile + alreadyImage.image);

            //ruta en la que llega la imagen
            const filePath = req.files.image.path; // \uploads\users\file_name.ext

            //separar en jerarquía la ruta de la imágen (linux o MAC: ('\'))
            const fileSplit = filePath.split('\\');// fileSplit = ['uploads', 'users', 'file_name.ext']
            const fileName = fileSplit[2];// fileName = file_name.ext

            const extension = fileName.split('\.'); // extension = ['file_name', 'ext']
            const fileExt = extension[1]; // fileExt = ext;

            const validExt = await validate.validExtension(fileExt, filePath);

            if (validExt === false) {
                return res.status(400).send({ message: res.i18n.t('register_405') });
            } else {
                const userUpdate = await User.update({
                    image: fileName
                }
                    , {
                        where: {
                            id: user.id
                        }
                    });
                if (!userUpdate) return res.status(400).send({ message: res.i18n.t('register_406') });
                console.log("Image created.");
            }
        }
        const newUser = await User.findOne({
            where: {
                id: user.id
            }
        });

        return res.send({ message: res.i18n.t('register_200'), newUser });
    } catch (error) {
        console.log(error);
        return error;
    }
}

//Funcion para obtener la imagen de un usuario.
exports.getImage = async (req, res) => {
    try {
        const fileName = req.params.fileName;
        const pathFile = './views/users/' + fileName;

        const image = fs.existsSync(pathFile);
        if (!image) {
            return res.status(404).send({ message: 'Image not found' });
        } else {
            return res.sendFile(path.resolve(pathFile));
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error getting image' });
    }
}

//ENVIAR CREDENCIALES POR CORREO
exports.sendCredentials = async (user, tempPassword) => {
    try {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            secure: true,
            auth: {
                user: process.env.USERMAIL,
                pass: process.env.PASSMAIL
            }
        });

        let mail_options = {
            from: process.env.FROM_MAIL,
            to: user.mail,
            subject: `Bienvenido `,
            html: 'Hola' + ' ' + user.firstName + ' ' + user.lastName + ', ' + 'gusto en saludarte,' +
                ' <br>' +
                ' <br>' + '• Usuario:' + ' ' + user.username +
                ' <br>' + '• Tu contraseña temporal es:' + ' ' + tempPassword +
                ' <br>' +
                ' <br>' + 'Saludos Cordiales,'
        };

        transporter.sendMail(mail_options, (error, info) => {
            if (error) console.log(error);
            console.log('El correo se envío correctamente ' + info.response);
        });
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
        if (msg) return res.status(400).send(msg);

        data.username.toLowerCase();
        const usernameExist = await User.findOne({
            where: {
                username: data.username
            }
        });
        if (!usernameExist) return res.status(400).send({ message: "Invalid credentials" });
        if (usernameExist.deleted) return res.status(400).send({ message: "Invalid credentials" });

        //SI LA CUENTA ESTÁ BLOQUEADA
        if (usernameExist.isLocked) {
            // PRUEBA LOCKED
            if (usernameExist.lockUntil == 0) return res.status(400).send({ message: "Your account has been blocked by an administrator." });
            if (moment().unix() < usernameExist.lockUntil) return res.status(400).send({ message: "Your account is still locked." });

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
            //SI LOS PARAMETROS SON CORRECTOS
            if (await validate.checkPassword(params.password, newUserSearch.password)) {
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
                return res.status(200).send({ message: "Logged In", token, newUserSearch });
            }
            //SI LOS PARAMETROS SON INCORRECTOS
            if (newUserSearch.loginAttemps < parseInt(process.env.ATTEMPTS)) {
                let loginAttemps = newUserSearch.loginAttemps;
                const attempsUpdated = await User.update({
                    loginAttemps: loginAttemps + 1
                }, {
                    where: {
                        id: newUserSearch.id
                    }
                });
                return res.status(400).send({ message: `Invalid credentials. Remaining attempts: ${3 - (newUserSearch.loginAttemps + 1)}` });
            }
            const locked = await User.update({
                isLocked: true,
                lockUntil: moment().unix() + parseInt(process.env.TIMELOCKED)
            }, {
                where: {
                    id: newUserSearch.id
                }
            });
            return res.status(400).send({ message: `Your account has been locked for ${((parseInt(process.env.TIMELOCKED)) / 60).toFixed(2)} min.` });
        }

        //SI LA CUENTA "NO" ESTÁ BLOQUEADA
        if (await validate.checkPassword(params.password, usernameExist.password)) {
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
            return res.status(200).send({ message: "Logged In", token, usernameExist });
        }
        //SI AUN NO HA TERMINADO SUS INTENTOS
        if (usernameExist.loginAttemps < parseInt(process.env.ATTEMPTS)) {
            let loginAttemps = usernameExist.loginAttemps;
            const attempsUpdated = await User.update({
                loginAttemps: loginAttemps + 1
            }, {
                where: {
                    id: usernameExist.id
                }
            });
            return res.status(400).send({ message: `Invalid credentials. Remaining attempts: ${3 - (usernameExist.loginAttemps + 1)}` });
        }
        //SI YA TERMINÓ SUS INTENTOS
        const locked = await User.update({
            isLocked: true,
            lockUntil: moment().unix() + parseInt(process.env.TIMELOCKED)
        }, {
            where: {
                id: usernameExist.id
            }
        });
        return res.status(400).send({ message: `Your account has been locked for ${((parseInt(process.env.TIMELOCKED)) / 60).toFixed(2)} min.` });

    } catch (error) {
        console.log(error);
        return error;
    }
}

//Actualizar Contraseña cuando se logea por primera vez
exports.updatePassword = async (req, res) => {
    try {
        const { newPassword, confirmPassword, idUser } = req.body;
        //Función para verificar si una contraseña es segura.
        const isStrongPassword = p => p.search(/^((?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=\S+$)(?=.*[;:\.,!¡\?¿@#\$%\^&\-_+=\(\)\[\]\{\}])).{8,20}$/) != -1;
        const data = {
            newPassword,
            confirmPassword
        }
        const msg = validate.validateData(data);
        if (msg) return res.status(400).send(msg);
        if (!isStrongPassword(newPassword)) return res.status(400).send({ message: "The password does not meet the requirements." });
        if (newPassword != confirmPassword) return res.status(400).send({ message: "There is no match between the passwords." });
        // Se actualiza la contraseña del ususario
        const userUpdated = await User.update({
            password: await validate.encrypt(newPassword),
            needChangePassword: false
        }, {
            where: {
                id: idUser
            }
        });
        return res.status(200).send({ message: "Password updated." });
    } catch (error) {
        console.log(error);
        return error;
    }
}

// Actualizar contraseña cuando el usuario solicita un cambio de contraseña (ADMIN)
exports.updatePasswordByAdmin = async (req, res) => {
    try {
        const idUser = req.params.idUser;
        const tempPassword = uuidv4().substring(0, 8);
        const user = await User.findOne({
            where: {
                id: idUser
            }
        });
        const userUpdate = await User.update({
            password: await validate.encrypt(tempPassword),
            needChangePassword: true
        }, {
            where: {
                id: idUser
            }
        });
        this.sendCredentials(user, tempPassword);
        return res.status(200).send({ message: res.i18n.t('update_password_200') });
    } catch (error) {
        console.log(error);
        return error;
    }
}

//Listar Usuarios
exports.getUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            where: {
                deleted: false
            }
        });
        
        return res.status(200).send({ users })
    } catch (error) {
        console.log(error);
        return error;
    }
};

//Listar un usuario
exports.getUser = async (req, res) => {
    try {
        const idUser = req.params.idUser;
        const user = await User.findOne({
            where: {
                id: idUser
            }
        });
        return res.status(200).send({ user })

    } catch (error) {
        console.log(error);
        return error;
    }
}

//Eliminar Usuario (nivel lógico)
exports.deleteUser = async (req, res) => {
    try {
        const idUser = req.params.idUser;
        const userExist = await User.findOne({
            where: {
                id: idUser
            }
        });
        if (!userExist) return res.status(400).send({ message: res.i18n.t('delete_400') });

        const userUpdate = await User.update({
            deleted: true
        }, {
            where: {
                id: idUser
            }
        })
        
        return res.status(200).send({ message: res.i18n.t('delete_200') });
    } catch (error) {
        console.log(error);
        return error;
    }
};

//Actualizar Usuario
exports.updateUser = async (req, res) => {
    try {
        const idUser = req.params.idUser;
        const params = req.body
        
        const userExist = await User.findOne({
            where: {
                id: idUser
            }
        });
        if (!userExist) return res.status(400).send({ message: res.i18n.t('update_400') });
        //No se permite actualizar el username
        const userUpdate = await User.update(
            params
            , {
                where: {
                    id: idUser
                }
            });
            
        return res.status(200).send({ message: res.i18n.t('update_200') });
    } catch (error) {
        console.log(error);
        return error;
    }
};

exports.permissions_id = async (req, res) => {
    try {
        const id = req.params.id;
        const arrayRolesId = [];
        const arrayRoles_Functions_Id = [];
        const idFunctions = [];

        //Se almacenan los roles de la persona logeada
        const roles = await User_Rol.findAll({
            where: {
                UserId: id
            }
        });

        for (let i = 0; i < roles.length; i++) {
            arrayRolesId.push(roles[i].RolId);
        }

        //Obtengo todos los registros de la trabal roles functions
        const roles_functions = await Role_Functions.findAll({
            where: {
                RolId: arrayRolesId
            }
        });

        for (let i = 0; i < roles_functions.length; i++) {
            arrayRoles_Functions_Id.push(roles_functions[i].FunctionId);
        }

        for (let i = 0; i < arrayRoles_Functions_Id.length; i++) {
            const id_function = await Function.findOne({
                where: {
                    id: arrayRoles_Functions_Id[i]
                }
            });
              
            if (!idFunctions.includes(id_function.id)) idFunctions.push(id_function.id);
        }
        return res.status(200).send({ idFunctions });
    } catch (err) {
        return err;
    }
}

exports.permissions = async (req, res) => {
    try {
        const id = req.params.id;
        const arrayRolesId = [];
        const arrayRoles_Functions_Id = [];
        const nameFunctions = [];

        //Se almacenan los roles de la persona logeada
        const roles = await User_Rol.findAll({
            where: {
                UserId: id
            }
        });

        for (let i = 0; i < roles.length; i++) {
            arrayRolesId.push(roles[i].RolId);
        }

        //Obtengo todos los registros de la trabal roles functions
        const roles_functions = await Role_Functions.findAll({
            where: {
                RolId: arrayRolesId
            }
        });

        for (let i = 0; i < roles_functions.length; i++) {
            arrayRoles_Functions_Id.push(roles_functions[i].FunctionId);
        }

        for (let i = 0; i < arrayRoles_Functions_Id.length; i++) {
            const function_name = await Function.findOne({
                where: {
                    id: arrayRoles_Functions_Id[i]
                }
            });
            if (!nameFunctions.includes(function_name.name)) nameFunctions.push(function_name.name);
        }
        return res.status(200).send({ nameFunctions });
    } catch (err) {
        return err;
    }
}