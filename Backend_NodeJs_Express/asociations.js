const User = require("./models/User.model");
const Rol = require("./models/Rol.model");
const User_Rol = require("./models/User_Rol.model");
const Function = require("./models/Functions.model");
const Role_Function = require("./models/Role_Functions.model");

// Relacion de NaN entre usuarios y roles.
User.belongsToMany(Rol, { through: User_Rol});
Rol.belongsToMany(User, { through: User_Rol});

//Relacion de NaN entre roles y funciones
Function.belongsToMany(Rol, { through: Role_Function});
Rol.belongsToMany(Function, { through: Role_Function});