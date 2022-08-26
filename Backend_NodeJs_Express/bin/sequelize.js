const Sequelize = require('sequelize');
const Models = require("../models");
require("dotenv").config();

const UserModel = require("../models/User.model");

const sequelize = new Sequelize(process.env.DB, process.env.ADMIN, process.env.PASSWORD, {
    host: process.env.HOST,
    dialect: process.env.DIALECT,
    port: process.env.PORTDB
});

//const User = UserModel(sequelize);
for(const modelDefined of Models){
    modelDefined(sequelize);
}

sequelize.sync({ force: false }).then(() => {
    console.log("Sincronizacion y conexión exitosa.");
});

module.exports = sequelize;