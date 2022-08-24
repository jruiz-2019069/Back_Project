const Sequelize = require('sequelize');

const sequelize = new Sequelize('bdgDatabase', 'hdelacruz', '123', {
    host: 'localhost',
    dialect: 'mysql'|'sqlite'|'postgres'|'mssql',
});

sequelize.authenticate()
    .then(()=>{
        console.log('Conectado')
    })
    .catch(err=>{
        console.log('No se conectó')
    })

const User = sequelize.define('User',{
    id:{type: Sequelize.INTEGER, primaryKey: true},
    username: Sequelize.STRING (255),
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    mail: Sequelize.STRING,
    password: Sequelize.TEXT,
    image: Sequelize.STRING,
    job: Sequelize.STRING,
    activated: Sequelize.TINYINT,
    loginAttemps: Sequelize.INTEGER,
    isLocked : Sequelize.TINYINT,
    lockUntil: Sequelize.BIGINT,
    resetPasswordToken: Sequelize.TEXT,
    activateUserToken: Sequelize.TEXT,
    sessionUserToken: Sequelize.TEXT,
    deleted: Sequelize.TINYINT,
    needChangePassword: Sequelize.TINYINT,
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
})