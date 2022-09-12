const { Model, DataTypes } = require("sequelize");
const sequelize = require("../bin/sequelize");

class User_Rol extends Model {}
User_Rol.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
}, {
    sequelize,
    modelName: "user_rol",
    timestamps: false
});

module.exports = User_Rol;