const validate = require("../utils/validate");
const Rol = require("../models/Rol.model");
const User_Rol = require("../models/User_Rol.model");
const User = require("../models/User.model");
const Role_Function = require("../models/Role_Functions.model");
const Function = require("../models/Functions.model");

// INSERT
exports.createRol = async (req, res) => {
    try {
        const { name, description, ids, idsPermissions } = req.body;
        const data = {
            name,
            description
        }
        const msg = await validate.validateData(data);
        if(msg) return res.status(400).send(msg);
        const searchRol = await Rol.findOne({
            where: {
                name: name
            }
        });
        if(searchRol) return res.status(400).send({message: "Rol already exist."});
        const role = await Rol.create(data);
        await role.save();
        //Agregarle al rol nuevo los usuarios deseados
        for(let i = 0; i < ids.length; i++){
            let data = {
                UserId: ids[i],
                RolId: role.id
            }
            let user_rol = await User_Rol.build(data);
            await user_rol.save();
        }
        
        // Agregarle al rol nuevo las funciones deseadas
        for(let i = 0; i < idsPermissions.length; i++){
            let data = {
                FunctionId: idsPermissions[i],
                RolId: role.id
            }
            let role_function = await Role_Function.build(data);
            await role_function.save();
        }
        return res.status(200).send({message: "Rol created."});
    } catch (err) {
        console.log(err);
        return err;
    }
}

// GETS
exports.getRoles = async (req, res) => {
    try {
        const roles = await Rol.findAll();
        return res.status(200).send({roles});
    } catch (err) {
        console.log(err);
        return err;
    }
}

exports.getRole = async (req, res) => {
    try {
        const id = req.params.id;
        const rol = await Rol.findOne({
            where: {
                id: id
            }
        });
        return res.status(200).send({rol});
    } catch (err) {
        console.log(err);
        return err;
    }
}

// Put
exports.updateRol = async (req, res) => {
    try {
        const idRol = req.params.id;
        const params = req.body;
        const rolExistName = await Rol.findOne({
            where: {
                name: params.name
            }
        }); 
        const rolExistId = await Rol.findOne({
            where: {
                id: idRol
            }
        });
        if(rolExistName && rolExistId.name != params.name) return res.status(400).send({message: "Rol already exist."});
        const rolUpdated = await Rol.update(params, {
            where: {
                id: idRol
            }
        });
        return res.status(200).send({message: "Rol updated"});
    } catch (err) {
        console.log(err);
        return err;
    }
}

exports.deleteRol = async (req, res) => {
    try {
        const idRol = req.params.id;

        const searchRol = await User_Rol.findOne({
            where:{
                RolId: idRol
            }
        })
        if(searchRol) return res.status(400).send({message:'You can not delete this role'});

        const deleteRol = await Rol.destroy({
            where: {
                id: idRol
            }
        });
        return res.status(200).send({message: "Rol deleted"});
    } catch (err) {
        console.log(err);
        return err;
    }

}

//Obnter los usuarios asociados a un Rol
exports.getUsersByAdmin = async(req, res)=>{
    try {
        const idRol = req.params.idRol;
        let arrayUserTrue = [];
        let arrayUserFalse = [];
        let arrayNumbers = [];
        const users = await User.findAll({
            where: {
                deleted:0
            }
        });
        for(let i = 0; i < users.length; i++){
            //Se almacenan todos los usuarios perteneciente al rol seleccionado
            const usersId = await User_Rol.findAll({
                where: {
                    RolId: idRol
                }
            });

            for(let j = 0; j < usersId.length; j++){
                let UserId = usersId[j].UserId; 
                if(!arrayNumbers.includes(UserId)) arrayNumbers.push(UserId);                   
            }

            if(arrayNumbers.includes(users[i].id)){
                arrayUserTrue.push({
                    id: users[i].id,
                    name: users[i].firstName + " " + users[i].lastName,
                    include: true,
                    username: users[i].username,
                    image: users[i].image
                });
            }else{
                arrayUserFalse.push({
                    id: users[i].id,
                    name: users[i].firstName + " " + users[i].lastName,
                    include: false,
                    username: users[i].username,
                    image: users[i].image
                });
            }
        }
        const newArray = arrayUserTrue.concat(arrayUserFalse);
        return res.status(200).send({newArray});
    } catch (err) {
        console.log(err);
        return err;
    }
};

exports.postUsersByRol = async(req,res)=>{
    try {
        const idRol = req.params.idRol;
        const deleteUser_Rol = await User_Rol.destroy({
            where:{
                RolId: [idRol]
            }
        });
        const params = req.body;
        const idsArray = params;

        for(let i= 0; i<idsArray.length; i++){
            let data = {
                UserId: idsArray[i].id,
                RolId: idRol
            }
            const user_rol = await User_Rol.build(data);
            await user_rol.save()
        };
        
        return res.status(200).send({message:"Saved successfully"});
        
    } catch (error) {
        console.log(error);
        return error;
    }
}

exports.getFunctions = async (req, res) => {
    try {
        const functionsUsers = await Function.findAll({
            where: {
                type: "Modulo de Usuarios"
            }
        });
        const functionsRoles = await Function.findAll({
            where: {
                type: "Modulo de Roles"
            }
        });
        return res.status(200).send({functionsUsers, functionsRoles});
    } catch (err) {
        console.log(err);
    }
}