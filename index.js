// express es lo primero que se instala en node para la db
const express = require('express');
require('dotenv').config();
const cors = require('cors');

const { dbConection } = require('./database/config');

//crear el servidor express
const app = express();

// Configurar cabeceras y cors
app.use(cors());

//lectura y parseo del body
app.use(express.json());

// Base de datos
dbConection();

// Rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/hospitales', require('./routes/hospital'));
app.use('/api/medicos', require('./routes/medicos'));
app.use('/api/todo', require('./routes/busquedas'));
app.use('/api/upload', require('./routes/uploads'));


app.listen(process.env.PORT, () => {
    console.log('Servidor corriento en el puerto ' + process.env.PORT);
});