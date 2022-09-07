const { Model, DataTypes } = require("sequelize");
const sequelize = require("../bin/sequelize");

class User extends Model {}
User.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username: DataTypes.STRING(255),
  firstName: DataTypes.STRING,
  lastName: DataTypes.STRING,
  mail: DataTypes.STRING,
  password: DataTypes.TEXT,
  image: DataTypes.STRING,
  activated: DataTypes.BOOLEAN,
  loginAttemps: DataTypes.INTEGER,
  isLocked: DataTypes.BOOLEAN,
  lockUntil: DataTypes.BIGINT,
  resetPasswordToken: DataTypes.TEXT,
  activateUserToken: DataTypes.TEXT,
  sessionUserToken: DataTypes.TEXT,
  deleted: DataTypes.BOOLEAN,
  needChangePassword: DataTypes.BOOLEAN
}, {
  sequelize,
  modelName: "User"
});

module.exports = User;