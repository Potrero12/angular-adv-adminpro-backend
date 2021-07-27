// express es lo primero que se instala en node para la db
const express = require('express');
require('dotenv').config();
const cors = require('cors');

const { dbConection } = require('./database/config');

//crear el servidor express
const app = express();

// Base de datos
dbConection();

// password mongo - user
// mean_user
// psBo8ijaqeuhAjX5

// Configurar cabeceras y cors
app.use(cors());

//Rutas
app.get('/', (req, res) => {
    res.status(200).send({
        ok: true,
        message: 'Hola Mundo desde /'
    })
})

app.listen(process.env.PORT, () => {
    console.log('Servidor corriento en el puerto ' + process.env.PORT);
})