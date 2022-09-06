const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    return Rol = sequelize.define("Rol", {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: DataTypes.STRING(255),
        description: DataTypes.STRING(255)
    });
}