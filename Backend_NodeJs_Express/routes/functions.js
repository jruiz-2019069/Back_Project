var express = require('express');
var router = express.Router();
let functionController = require("../controllers/function.controller");

// Routes functions
router.get("/getFunctions/:idRol", functionController.getFunctions);
router.post("/assignPermissions/:idRol", functionController.assignPermissions);

module.exports = router;