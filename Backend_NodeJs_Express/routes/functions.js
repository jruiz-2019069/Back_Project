var express = require('express');
var router = express.Router();
let functionController = require("../controllers/function.controller");
const auth = require('../middlewares/auth');

// Routes functions
router.get("/getFunctions/:idRol", auth.isLoged,  functionController.getFunctions);
router.post("/assignPermissions/:idRol", auth.isLoged, functionController.assignPermissions);

module.exports = router;