var express = require('express');
var UserController = require("../controllers/user.controller");

var router = express.Router();

/* GET users listing. */
router.post('/login', UserController.login);
router.post('/register', UserController.register);


module.exports = router;
