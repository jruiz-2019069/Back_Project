var express = require('express');
var UserController = require("../controllers/user.controller");
const connectMultiparty = require('connect-multiparty');
const upload = connectMultiparty({ uploadDir: './views/users'});
var router = express.Router();

/* GET users listing. */
router.post('/login', UserController.login);
router.post('/register', upload, UserController.register);
router.put('/updatePassword', UserController.updatePassword);
router.get('/getUsers', UserController.getUsers);
router.get('/getUser/:idUser', UserController.getUser);
router.put('/deleteUser/:idUser', UserController.deleteUser);
router.put('/updateUser/:idUser', UserController.updateUser);
router.put('/updatePasswordByAdmin/:idUser', UserController.updatePasswordByAdmin);
router.get('/permissions/:id', UserController.permissions);
router.get('/permissions_id/:id', UserController.permissions_id);

router.get('/getImage/:fileName', upload, UserController.getImage);

module.exports = router;
