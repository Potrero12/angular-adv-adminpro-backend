// express es lo primero que se instala en node para la db
const express = require('express');
require('dotenv').config();
const path = require('path');
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

//Directorio Publico
app.use(express.static('public'));

// Rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/hospitales', require('./routes/hospital'));
app.use('/api/medicos', require('./routes/medicos'));
app.use('/api/todo', require('./routes/busquedas'));
app.use('/api/upload', require('./routes/uploads'));

//lo ultimo - comodin para que siempre carge el index si no encuentra una ruta correcta
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public/index.html'));
})


app.listen(process.env.PORT, () => {
    console.log('Servidor corriento en el puerto ' + process.env.PORT);
});