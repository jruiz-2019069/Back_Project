'use strict'
const bcrypt = require("bcrypt-nodejs");
const fs = require('fs');

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

exports.validExtension = async (ext, filePath)=>{
    try{
        if( ext == 'png' ||
            ext == 'jpg' ||
            ext == 'jpeg' ||
            ext == 'gif'){
            return true;
        }else{
            fs.unlinkSync(filePath);
            return false;
        }
    }catch(err){
        console.log(err);
        return err;
    }
}



