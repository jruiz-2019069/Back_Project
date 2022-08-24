const Sequelize = require('sequelize');

exports.connectDB = () => {
    const sequelize = new Sequelize('bdgDatabase', 'root', 'admin', {
        host: 'localhost',
        dialect: 'mysql',
    });
    
    sequelize.authenticate()
        .then(()=>{
            console.log('Conexión exitosa a la base de datos.')
        })
        .catch(err=>{
            console.log('No se conectó')
        })
}