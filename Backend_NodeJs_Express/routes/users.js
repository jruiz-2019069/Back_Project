var express = require('express');
var UserController = require("../controllers/user.controller");

var router = express.Router();

/* GET users listing. */
router.post('/login', UserController.login);

module.exports = router;
