const { Model, DataTypes } = require("sequelize");
const sequelize = require("../bin/sequelize");

class Rol extends Model {}
Rol.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: DataTypes.STRING(255),
    description: DataTypes.STRING(255)
}, {
    sequelize,
    modelName: "Rol"
});

module.exports = Rol;