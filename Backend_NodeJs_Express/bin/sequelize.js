const Sequelize = require('sequelize');
const Models = require("../models");

const UserModel = require("../models/User.model");


const sequelize = new Sequelize('bdgDatabase', 'root', 'admin', {
    host: 'localhost',
    dialect: 'mysql',
    port: '3306'
});

//const User = UserModel(sequelize);
for(const modelDefined of Models){
    modelDefined(sequelize);
}

sequelize.sync({ force: false }).then(() => {
    console.log("Sincronizacion exitosa");
});

module.exports = sequelize;