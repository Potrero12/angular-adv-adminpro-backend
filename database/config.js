//conexion a la base datos -los segundo que se hace despues de instalar express
const mongoose = require('mongoose');

const dbConection = async() => {

    try {
        await mongoose.connect(process.env.DB_CNN, {
            useNewUrlParser: true, 
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        console.log('Base de datos online')
    } catch (error) {
        console.log(error);
        throw new Error('Error en la Conexion de la base de datos');
    }

}

module.exports = {
    dbConection
}