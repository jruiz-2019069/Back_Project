var express = require('express');
var UserController = require("../controllers/user.controller");
const connectMultiparty = require('connect-multiparty');
const upload = connectMultiparty({ uploadDir: './views/users'});
var router = express.Router();
const auth = require('../middlewares/auth');

/* GET users listing. */
router.post('/login', UserController.login);
router.put('/updatePassword', UserController.updatePassword);

router.post('/register', auth.isLoged, upload, UserController.register);
router.get('/getUsers',auth.isLoged, UserController.getUsers);
router.get('/getUser/:idUser',auth.isLoged, UserController.getUser);
router.put('/deleteUser/:idUser',auth.isLoged, UserController.deleteUser);
router.put('/updateUser/:idUser',auth.isLoged, UserController.updateUser);
router.put('/updatePasswordByAdmin/:idUser',auth.isLoged, UserController.updatePasswordByAdmin);
router.get('/permissions/:id', auth.isLoged, UserController.permissions);
router.get('/permissions_id/:id', UserController.permissions_id);
router.get('/getImage/:fileName', upload, UserController.getImage);

module.exports = router;
