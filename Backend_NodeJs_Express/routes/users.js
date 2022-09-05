var express = require('express');
var UserController = require("../controllers/user.controller");
const connectMultiparty = require('connect-multiparty');
const upload = connectMultiparty({ uploadDir: './views/users'});
var router = express.Router();

/* GET users listing. */
router.post('/login', UserController.login);
router.post('/register', UserController.register);
router.put('/updatePassword', UserController.updatePassword);
router.get('/getUsers', UserController.getUsers);
router.get('/getUser/:idUser', UserController.getUser);
router.put('/deleteUser/:idUser', UserController.deleteUser);
router.put('/updateUser/:idUser', UserController.updateUser);
router.put('/updatePasswordByAdmin/:idUser', UserController.updatePasswordByAdmin);

router.post('/uploadImage/:idUser', upload, UserController.uploadImage);
router.get('/getImage/:fileName', upload, UserController.getImage);

module.exports = router;
