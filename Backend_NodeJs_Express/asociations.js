const User = require("./models/User.model");
const Rol = require("./models/Rol.model");
const User_Rol = require("./models/User_Rol.model");

// Relacion de NaN entre usuarios y roles.
User.belongsToMany(Rol, { through: User_Rol});
Rol.belongsToMany(User, { through: User_Rol});