const { response } = require('express');

const Hospital = require('../models/hospital');

const getHospitales = async (req, res = response) => {

    //traemos todos los hospitales
    const hospitales = await Hospital.find()
                                     .populate('usuario', 'nombre');

    res.status(200).send({
        ok: true,
        hospitales,
        msg: 'Listado de hospitales'
    })

}

const getHospital = async (req, res = response) => {

    //traemos el id del hospital por los parametros
    const hospitalId = req.params.id;

    try {
        //traemos el hospital por el id
        const hospital = await Hospital.findById(hospitalId)
                                       .populate('usuario', 'nombre');

        res.status(200).send({
            ok: true,
            hospital: hospital
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            ok: false,
            msg: 'Error inesperado en el servidor'
        })
    }



}

const crearHospital = async (req, res = response) => {

    const uid = req.uid;
    //creamos la instancia con el modelo
    const hospital = new Hospital({
        usuario: uid,
        ...req.body
    });

    try {

        //guardamos el hospital nuevo
        const hospitalGuardado = await hospital.save();

        res.status(200).send({
            ok: true,
            hospital: hospitalGuardado,
            msg: 'Hospital Guardado Correctamente'
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            ok: false,
            msg: 'Error inesperado en el servidor'
        })
    }

}

const actualizarHospital = (req, res = response) => {

    res.status(200).send({
        ok: true,
        msg: 'Hola desde actualizarHospital'
    })

}

const borrarHospital = (req, res = response) => {

    res.status(200).send({
        ok: true,
        msg: 'Hola desde borrarHospital'
    })

}

module.exports = {
    getHospitales,
    getHospital,
    crearHospital,
    actualizarHospital,
    borrarHospital
}