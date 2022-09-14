const Sequelize = require('sequelize');
require("dotenv").config();



const sequelize = new Sequelize(process.env.DB, process.env.ADMIN, process.env.PASSWORD, {
    host: process.env.HOST,
    dialect: process.env.DIALECT,
    port: process.env.PORTDB
});

sequelize.sync({ force: false }).then(() => {
    console.log("Sincronizacion y conexión exitosa.");
});

module.exports = sequelize;