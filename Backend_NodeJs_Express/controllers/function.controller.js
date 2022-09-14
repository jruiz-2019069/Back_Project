const Function = require("../models/Functions.model");
const Role_Functions = require("../models/Role_Functions.model");

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
    } catch (err) {
        return err;
    }
}

exports.arrayFunctions = () => {
    const arrayFunctions = [
        // USERS
        {
            name: "getUsuarios",
            description: "",
            frontendPage: "",
            frontendComponent: "",
            backend: "",
            type: "Modulo de Usuarios"
        },
        {
            name: "createUser",
            description: "",
            frontendPage: "",
            frontendComponent: "",
            backend: "",
            type: "Modulo de Usuarios"
        },
        {
            name: "passwordChange",
            description: "",
            frontendPage: "",
            frontendComponent: "",
            backend: "",
            type: "Modulo de Usuarios"
        },
        {
            name: "isLocked",
            description: "",
            frontendPage: "",
            frontendComponent: "",
            backend: "",
            type: "Modulo de Usuarios"
        },
        {
            name: "editUser",
            description: "",
            frontendPage: "",
            frontendComponent: "",
            backend: "",
            type: "Modulo de Usuarios"
        },
        {
            name: "deleteUser",
            description: "",
            frontendPage: "",
            frontendComponent: "",
            backend: "",
            type: "Modulo de Usuarios"
        },
        // ROLES
        {
            name: "getRoles",
            description: "",
            frontendPage: "",
            frontendComponent: "",
            backend: "",
            type: "Modulo de Roles"
        },
        {
            name: "getUsersByRol",
            description: "",
            frontendPage: "",
            frontendComponent: "",
            backend: "",
            type: "Modulo de Roles"
        },
        {
            name: "permissions",
            description: "",
            frontendPage: "",
            frontendComponent: "",
            backend: "",
            type: "Modulo de Roles"
        },
        {
            name: "editRol",
            description: "",
            frontendPage: "",
            frontendComponent: "",
            backend: "",
            type: "Modulo de Roles"
        },
        {
            name: "deleteRol",
            description: "",
            frontendPage: "",
            frontendComponent: "",
            backend: "",
            type: "Modulo de Roles"
        },
        {
            name: "createRol",
            description: "",
            frontendPage: "",
            frontendComponent: "",
            backend: "",
            type: "Modulo de Roles"
        },
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
                    include: true
                });
            }else{
                functionsFalse.push({
                    id: functions[i].id,
                    name: functions[i].name,
                    include: false
                });
            }
        }
        const arrayFunctions = functionsTrue.concat(functionsFalse);
        return res.status(200).send({arrayFunctions});
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
        const params = req.body;
        //Se almacenan todas la funciones (Objeto completo) seleccionadas para dicho rol
        const idsPermissionsArray = params.idsPermissionsArray;
        for(let i = 0; i < idsPermissionsArray.length; i++){
            let data = {
                FunctionId: idsPermissionsArray[i],
                RolId: idRol
            }
            const role_function = await Role_Functions.build(data);
            await role_function.save();
        }
        return res.status(200).send({message:"Saved successfully"});
    } catch (err) {
        return err;
    }
}