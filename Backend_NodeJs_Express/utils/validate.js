'use strict'


exports.validateData = (data) =>{
    let keys = Object.keys(data), msg = '';

    for(let key of keys){
        if(data[key] !== null && data[key] !== undefined && data[key] !== '') continue;
        msg += ` ${key} es obligatorio\n`
    }
    return msg.trim();
}

