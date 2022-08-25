const sequelize = require("sequelize");

const User = sequelize.define('User',{
    id:{type: Sequelize.INTEGER, primaryKey: true},
    username: Sequelize.STRING (255),
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    mail: Sequelize.STRING,
    password: Sequelize.TEXT,
    image: Sequelize.STRING,
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

module.exports = User;