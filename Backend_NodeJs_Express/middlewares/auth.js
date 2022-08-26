const jwt = require("jwt-simple");
require("dotenv").config();
const secretkey = process.env.KEY;

exports.isLoged = async (req, res, next) => {
    if(req.headers.authorization){
        try {
            let token = req.headers.authorization.replace(/['",]+/g, '');
            let payload = jwt.decode(token, secretkey);
            req.user = payload;
            next();
        } catch (err) {
            console.log(err);
            return err;
        }
    }else{
        return res.status(401).send({message: "The request does not contain the authentication header."});
    }
}