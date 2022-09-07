const User = require("./models/User.model");
const Rol = require("./models/Rol.model");

// Relacion de NaN entre usuarios y roles.
User.belongsToMany(Rol, { through: "user_rol"});