const { Model, DataTypes } = require("sequelize");
const sequelize = require("../bin/sequelize");

class User_Rol extends Model {}
User_Rol.init({
    
}, {
    sequelize,
    modelName: "user_rol",
    timestamps: false
});

module.exports = User_Rol;