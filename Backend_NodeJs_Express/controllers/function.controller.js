const Function = require("../models/Functions.model");
const Role_Functions = require("../models/Role_Functions.model");
const Rol = require('../models/Rol.model');
const User = require('../models/User.model');
const Role_Function = require("../models/Role_Functions.model");
const User_Rol = require("../models/User_Rol.model");
const validate = require('../utils/validate');
const { v4: uuidv4 } = require("uuid");
const nodemailer = require('nodemailer');
require("dotenv").config();

exports.insertsFunctions = async (req, res) => {
    try {
        const functions = await Function.findAll();
        if(functions.length == 0){
            const array = this.arrayFunctions();
            for(let i = 0; i < array.length; i++){
                const newFunction = await Function.create(array[i]);
                await newFunction.save() 
            }
        }
        this.insertRole();
        this.insertUser();
    } catch (err) {
        return err;
    }
}

exports.arrayFunctions = () => {
    const arrayFunctions = [
        // USERS
        {
            name: "Get users",
            description: "",
            frontendPage: "",
            frontendComponent: "",
            backend: "",
            type: "Modulo de Usuarios"
        },
        {
            name: "User creation",
            description: "",
            frontendPage: "",
            frontendComponent: "",
            backend: "",
            type: "Modulo de Usuarios"
        },
        {
            name: "Change of password",
            description: "",
            frontendPage: "",
            frontendComponent: "",
            backend: "",
            type: "Modulo de Usuarios"
        },
        {
            name: "User blocking",
            description: "",
            frontendPage: "",
            frontendComponent: "",
            backend: "",
            type: "Modulo de Usuarios"
        },
        {
            name: "User Edition",
            description: "",
            frontendPage: "",
            frontendComponent: "",
            backend: "",
            type: "Modulo de Usuarios"
        },
        {
            name: "Deletion of users",
            description: "",
            frontendPage: "",
            frontendComponent: "",
            backend: "",
            type: "Modulo de Usuarios"
        },
        // ROLES
        {
            name: "Role creation",
            description: "",
            frontendPage: "",
            frontendComponent: "",
            backend: "",
            type: "Modulo de Roles"
        },
        {
            name: "Get Roles",
            description: "",
            frontendPage: "",
            frontendComponent: "",
            backend: "",
            type: "Modulo de Roles"
        },
        {
            name: "Get users by role",
            description: "",
            frontendPage: "",
            frontendComponent: "",
            backend: "",
            type: "Modulo de Roles"
        },
        {
            name: "Permission Assignment",
            description: "",
            frontendPage: "",
            frontendComponent: "",
            backend: "",
            type: "Modulo de Roles"
        },
        {
            name: "Role edition",
            description: "",
            frontendPage: "",
            frontendComponent: "",
            backend: "",
            type: "Modulo de Roles"
        },
        {
            name: "Role removal",
            description: "",
            frontendPage: "",
            frontendComponent: "",
            backend: "",
            type: "Modulo de Roles"
        }
    ];
    return arrayFunctions;
}

exports.getFunctions = async (req, res) => {
    try {
        const idRol = req.params.idRol;
        const functionsTrue = [];
        const functionsFalse = [];
        const arrayNumbers = [];

        //Almaceno todas las funciones de la base de datos disponibles
        const functions = await Function.findAll();
        for(let i = 0; i < functions.length; i++){
            //Almaceno todas las funciones pertenecientes al rol seleccionado
            const functionsRols = await Role_Functions.findAll({
                where: {
                    RolId: idRol
                }
            });

            for(let j = 0; j < functionsRols.length; j++){
                if(!arrayNumbers.includes(functionsRols[j].FunctionId)) arrayNumbers.push(functionsRols[j].FunctionId);
            }

            if(arrayNumbers.includes(functions[i].id)){
                functionsTrue.push({
                    id: functions[i].id,
                    name: functions[i].name,
                    include: true,
                    type: functions[i].type
                });
            }else{
                functionsFalse.push({
                    id: functions[i].id,
                    name: functions[i].name,
                    include: false,
                    type: functions[i].type
                });
            }
        }
        const arrayFunctions = functionsTrue.concat(functionsFalse);
        const arrayUsers = [];
        const arrayRoles = [];
        for(let i = 0; i < arrayFunctions.length; i++){
            if(arrayFunctions[i].type == "Modulo de Usuarios"){
                arrayUsers.push(arrayFunctions[i]);
            }else{
                arrayRoles.push(arrayFunctions[i]);
            }
        }
        return res.status(200).send({arrayUsers, arrayRoles});
    } catch (err) {
        return err;
    }
}

exports.assignPermissions = async (req, res) => {
    try {
        const idRol = req.params.idRol;
        const deleteRol_Function = await Role_Functions.destroy({
            where: {
                RolId: [idRol]
            }
        });
        //Se almacenan todas la funciones (Id unicamente) seleccionadas para dicho rol
        const idsPermissionsArray = req.body.idsPermissionsArray;
        for(let i = 0; i < idsPermissionsArray.length; i++){
            let data = {
                FunctionId: idsPermissionsArray[i],
                RolId: idRol
            }
            const role_function = await Role_Functions.build(data);
            await role_function.save();
        }
        return res.status(200).send({message: res.i18n.t('Post_user_200')});
    } catch (err) {
        return err;
    }
}

exports.insertRole = async()=>{
    try {
        const roles = await Rol.findAll();
        if(roles.length == 0){
            const data ={
                name: 'ADMIN',
                description: 'Este es un rol por defecto con todas las funcionalidades',
            }
            const newRole = await Rol.create(data);
            await newRole.save();

            //Asignarle todas las funciones al nuevo rol
            const idsPermissions = await Function.findAll();
            
            for(let i = 0; i < idsPermissions.length; i++){
                let data = {
                    FunctionId: idsPermissions[i].id,
                    RolId: newRole.id
                }
                let role_function = await Role_Function.create(data);
                await role_function.save();
            }
        }
        
    } catch (error) {
        return error;
    }
}


exports.insertUser = async()=>{
    try {
        const users = await User.findAll();
        if(users.length == 0){
            const tempPassword = uuidv4().substring(0, 8);
            const data ={
            username: process.env.USER_NAME,
            firstName: process.env.FIRSTNAME,
            lastName: process.env.LASTNAME,
            mail: process.env.MAIL,
            password: await validate.encrypt(tempPassword),
            activated: false,
            loginAttemps: 0,
            isLocked: false,
            lockUntil: 0,
            deleted: false,
            needChangePassword: true
            }
            const newUser = await User.create(data);
            await newUser.save();

            //Asignarle un rol
            const data_rol = {
                UserId: newUser.id,
                RolId: 1
            }
            const user_rol = await User_Rol.create(data_rol);
            await user_rol.save();

            //Enviar credenciales
             this.sendCredentials(newUser, tempPassword);
        }
        
    } catch (error) {
        return error;
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