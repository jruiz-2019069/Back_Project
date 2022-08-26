'use strict'
const bcrypt = require("bcrypt-nodejs");

exports.validateData = (data) =>{
    let keys = Object.keys(data), msg = '';

    for(let key of keys){
        if(data[key] !== null && data[key] !== undefined && data[key] !== '') continue;
        msg += ` ${key} es obligatorio\n`
    }
    return msg.trim();
}

exports.encrypt = async (password) => {
    return bcrypt.hashSync(password);
}

exports.checkPassword = async (passBody, passUser) => {
    try {
        return bcrypt.compareSync(passBody, passUser);
    } catch (error) {
        console.log(error);
        return error;
    }
} 



