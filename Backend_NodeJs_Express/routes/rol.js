var express = require('express');
var router = express.Router();
let rolController = require("../controllers/rol.controller");
const auth = require('../middlewares/auth');

// Routes rol
router.post("/createRol", auth.isLoged, rolController.createRol);
router.get("/getRoles", auth.isLoged, rolController.getRoles);
router.get("/getRol/:id", auth.isLoged, rolController.getRole);
router.put("/updateRol/:id", auth.isLoged, rolController.updateRol);
router.put("/deleteRol/:id", auth.isLoged, rolController.deleteRol);
router.post("/postUsersByRol/:idRol", auth.isLoged, rolController.postUsersByRol)

router.get('/getUsersByAdmin/:idRol', auth.isLoged, rolController.getUsersByAdmin);
router.get('/getFunctions', auth.isLoged, rolController.getFunctions);

module.exports = router;