const path = require('path');
const fs = require('fs');

const { response } = require("express");
const { v4: uuidv4 } = require('uuid');
const { actualizarImagen } = require("../helpers/actualizar-imagen");


const fileToUploads = (req, res = response) => {

    //capturamos los valores por url
    const tipo = req.params.tipo;
    const id = req.params.id;

    //validamos los tipos
    const tiposPermitidos = ['medicos', 'hospitales', 'usuarios'];
    if (!tiposPermitidos.includes(tipo)) {
        return res.status(404).send({
            ok: false,
            msg: 'No Es Un Medico, usuario o Hospital'
        });
    }

    //validar que exista un archivo
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send({
            ok: false,
            msg: 'No hay Ningun Archivo'
        });
    }

    // procesar la imagen
    const file = req.files.imagen;

    const nombreCortado = file.name.split('.');
    const extArchivo = nombreCortado[nombreCortado.length - 1];

    //validar extension
    const extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'];
    if (!extensionesValidas.includes(extArchivo)) {
        return res.status(400).send({
            ok: false,
            msg: 'No Es Una Extension Valida'
        });
    }

    //generar el nombre del archivo
    const nombreArchivo = `${uuidv4()}.${extArchivo}`;

    // path para guardar la iamgen
    const path = `./uploads/${tipo}/${nombreArchivo}`;

    //Mover la Imagen
    file.mv(path, (err) => {
        if (err){
            return res.status(500).send({
                ok: false,
                msg: 'Error Al Mover La Imagen'
            });
        }

        //actualizar base de datos
        actualizarImagen(tipo, id, nombreArchivo);

        res.status(200).send({
            ok: true,
            msg: 'Archivo Subido',
            nombreArchivo
        });
    });
}

const retornaImagen = (req, res = response) => {

    const tipo = req.params.tipo;
    const foto = req.params.foto;

    const pathImg = path.join(__dirname, `../uploads/${tipo}/${foto}`);

    // imagen por defecto
    if(fs.existsSync(pathImg)){
        res.sendFile(pathImg);
    } else {
        const pathImg = path.join(__dirname, `../uploads/no-img.jpg`);
        res.sendFile(pathImg);
    }

}


module.exports = {
    fileToUploads,
    retornaImagen
}