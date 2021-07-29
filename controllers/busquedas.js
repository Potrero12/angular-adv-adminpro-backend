const { response } = require('express');

const Usuario = require('../models/usuario');
const Medico = require('../models/medico');
const Hospital = require('../models/hospital');

const getTodo = async (req, res = response) => {

    //capturamos el termino de busqueda de la url
    const busqueda = req.params.busqueda;
    //expresion regular a la busqueda
    const regex = new RegExp(busqueda, 'i');

    const [ usuario, medicos, hospital ] = await Promise.all([
        Usuario.find({ nombre: regex }),
        Medico.find({ nombre: regex }),
        Hospital.find({ nombre: regex }),
    ])

    res.status(200).send({
        ok: true,
        usuario,
        medicos,
        hospital
    });

}

const getDocumentoColeccion = async (req, res = response) => {

    //capturamos el termino de busqueda de la url
    const tabla = req.params.tabla;
    const busqueda = req.params.busqueda;
    //expresion regular a la busqueda
    const regex = new RegExp(busqueda, 'i');

    let data;

    switch (tabla) {
        case 'usuarios':
            data = await Usuario.find({ nombre: regex });

            break;
        
        case 'medicos':
            data = await Medico.find({ nombre: regex })
                               .populate('usuario', 'nombre img')
                               .populate('hospital', 'nombre img');
            break;
        
        case 'hospitales':
            data = await Hospital.find({ nombre: regex })
                                 .populate('usuario', 'nombre img');
            break;

        default:
            return res.status(400).send({
                ok: false,
                mgs: 'La Tabla Tiene Que Ser usuarios/medicos/hospitales'
            });
    }

    res.send({
        ok:true,
        resultados: data
    })

}

module.exports = {
    getTodo,
    getDocumentoColeccion
}