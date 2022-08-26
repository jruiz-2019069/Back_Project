const jwt = require('jwt-simple');
const moment = require('moment');
require("dotenv").config();
const secretKey = process.env.KEY;

exports.createToken = async(user)=>{
    try{
        const payload = {
            id: user.id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            mail: user.mail,
            password: user.password,
            image: user.image,
            activated: user.activated,
            isLocked: user.isLocked,
            deleted: user.deleted,
            needChangePassword: user.needChangePassword,
            iat: moment().unix(),
            exp: moment().add(5, 'hour').unix()
        }
        return jwt.encode(payload, secretKey);
    }catch(err){
        console.log(err);
        return err;
    }
}