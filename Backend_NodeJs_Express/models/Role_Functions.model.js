const { Model, DataTypes } = require("sequelize");
const sequelize = require("../bin/sequelize");

class Role_Functions extends Model {}
Role_Functions.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
}, {
    sequelize,
    modelName: "role_function",
    timestamps: false
});

module.exports = Role_Functions;