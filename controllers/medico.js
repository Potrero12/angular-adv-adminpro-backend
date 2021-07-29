const { response } = require('express');

const Medico = require('../models/medico');

const getMedicos = async(req, res = response) => {

    try {
        const medicos = await Medico.find().populate('hospital','nombre').populate('usuario', 'nombre');

        res.status(200).send({
            ok: true,
            medicos
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            ok: false,
            msg: 'Error inesperado en el servidor'
        })
    }
}

const getMedico = async(req, res = response) => {

    const medicoId = req.params.id;

    try {
        const medicos = await Medico.findById(medicoId).populate('hospital','nombre').populate('usuario', 'nombre');

        res.status(200).send({
            ok: true,
            medicos
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            ok: false,
            msg: 'Error inesperado en el servidor'
        })
    }
}

const crearMedico = async (req, res = response) => {

    const uid = req.uid;
    //creamos al instancia con el modelo
    const medico = new Medico({
        usuario: uid,
        ...req.body
    });


    try {

        const medicoDB = await medico.save();

        res.status(200).send({
            ok: true,
            medico: medicoDB,
            msg: 'El Medico Se Guardo Correctamente'
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            ok: false,
            msg: 'Error inesperado en el servidor'
        })
    }

}

const actualizarMedicos = (req, res = response) => {
    res.status(200).send({
        ok: true,
        msg: 'Hola desde actualizarMedicos'
    })
}

const BorrarMedico = (req, res = response) => {
    res.status(200).send({
        ok: true,
        msg: 'Hola desde BorrarMedico'
    })
}

module.exports = {
    getMedicos,
    getMedico,
    crearMedico,
    actualizarMedicos,
    BorrarMedico
}