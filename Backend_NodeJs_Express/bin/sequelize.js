const Sequelize = require('sequelize');

const UserModel = require("../models/User.model");


const sequelize = new Sequelize('bdgDatabase', 'root', 'admin', {
    host: 'localhost',
    dialect: 'mysql',
    port: '3306'
});

const User = UserModel(sequelize);

sequelize.sync({ force: true }).then(() => {
    console.log("Sincronizacion exitosa");
});

module.exports = {
    User
}
        
        
