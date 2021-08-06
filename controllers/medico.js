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
        const medico = await Medico.findById(medicoId).populate('hospital','nombre img').populate('usuario', 'nombre img');

        res.status(200).send({
            ok: true,
            medico
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

const actualizarMedicos = async(req, res = response) => {

    const idMedico = req.params.id;
    const uid = req.uid;
    // const idHospital = req.body.hospital;

    try {

        const existeId = await Medico.findById(idMedico);

        if(!existeId) {
            res.status(404).send({
                ok: false,
                msg: 'El Medico No existe'
            })
        }

        // const existeIdHospital = await Medico.findById(idHospital);

        // if(!existeIdHospital) {
        //     res.status(404).send({
        //         ok: false,
        //         msg: 'El Hospital No existe'
        //     })
        // }

        const medicoBody = {
            ...req.body,
            usuario: uid,
            // hospital: existeIdHospital
        }

        //actualizamos medico
        const medicoActualizado = await Medico.findByIdAndUpdate(idMedico, medicoBody, {new:true});

        res.status(200).send({
            ok: true,
            medico: medicoActualizado,
            msg: 'Medico Actualizado Correctamente'
        })
    
        
    } catch (error) {
        res.status(500).send({
            ok: false,
            msg: 'Error inesperado en el servidor'
        })
    }

}

const BorrarMedico = async (req, res = response) => {

    const idMedico = req.params.id;

    try {

        const existeId = await Medico.findById(idMedico);

        if(!existeId) {
            res.status(404).send({
                ok: false,
                msg: 'El Medico No existe'
            })
        }

        //actualizamos medico
        const medicoBorrado = await Medico.findByIdAndDelete(idMedico);

        res.status(200).send({
            ok: true,
            medico: medicoBorrado,
            msg: 'Medico Borrado Correctamente'
        })
    
        
    } catch (error) {
        res.status(500).send({
            ok: false,
            msg: 'Error inesperado en el servidor'
        })
    }

}

module.exports = {
    getMedicos,
    getMedico,
    crearMedico,
    actualizarMedicos,
    BorrarMedico
}