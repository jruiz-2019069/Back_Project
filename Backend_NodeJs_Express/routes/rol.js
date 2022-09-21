var express = require('express');
var router = express.Router();
let rolController = require("../controllers/rol.controller");

// Routes rol
router.post("/createRol", rolController.createRol);
router.get("/getRoles", rolController.getRoles);
router.get("/getRol/:id", rolController.getRole);
router.put("/updateRol/:id", rolController.updateRol);
router.put("/deleteRol/:id", rolController.deleteRol);
router.post("/postUsersByRol/:idRol", rolController.postUsersByRol)

router.get('/getUsersByAdmin/:idRol', rolController.getUsersByAdmin);
router.get('/getFunctions', rolController.getFunctions);

module.exports = router;