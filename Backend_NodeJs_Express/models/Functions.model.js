const { Model, DataTypes } = require("sequelize");
const sequelize = require("../bin/sequelize");

class Function extends Model {}
Function.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: DataTypes.STRING(255),
    description: DataTypes.STRING(255),
    type: DataTypes.STRING(255)
}, {
    sequelize,
    modelName: "Function"
});

module.exports = Function;