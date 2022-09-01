var express = require('express');
var UserController = require("../controllers/user.controller");

var router = express.Router();

/* GET users listing. */
router.post('/login', UserController.login);
router.post('/register', UserController.register);
router.put('/updatePassword', UserController.updatePassword);
router.put('/lockUser', UserController.lockUser);
router.put('/unlockedUser', UserController.unlockedUser);
router.get('/getUsers', UserController.getUsers);
router.put('/deleteUser/:idUser', UserController.deleteUser);
router.put('/updateUser/:idUser', UserController.updateUser);


module.exports = router;
