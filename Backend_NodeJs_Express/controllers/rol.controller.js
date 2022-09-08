const validate = require("../utils/validate");
const Rol = require("../models/Rol.model");
const User_Rol = require("../models/User_Rol.model");

// INSERT
exports.createRol = async (req, res) => {
    try {
        const { name, description, ids } = req.body;
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
        const searchRol = await User_Rol.findAll({
            where:{
                RolId: idRol
            }
        })
        
        for(let i = 0; i < searchRol.length; i++){
            console.log(searchRol[i].user_rol.UserId);
        }
        
        // arrar.forEach((item) => {
        //     //let UserId = item.user_rol.UserId;
        //     console.log(item.UserId);
        // });
        
    } catch (err) {
        console.log(err);
        return err;
    }
}