const { response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');


const login = async(req, res = response) => {

    const { email, password } = req.body;

    try {
        //verificamos que el email del usuario exista
        const usuarioDB = await Usuario.findOne({email});

        if(!usuarioDB) {
            return res.status(404).send({
                ok: false,
                msg: 'Email o Contraseña Ingresda No Son Validos, Revise los datos ingresados'
            })
        }

        //verificar contraseña
        const validPassword = bcrypt.compareSync(password, usuarioDB.password);

        if(!validPassword) {
            return res.status(400).send({
                ok:false,
                msg: 'Email o Contraseña Ingresda No Son Validos, Revise los datos ingresados'
            })
        }

        //generar el token jwt
        const token = await generarJWT(usuarioDB.id);

        res.status(200).send({
            ok: true,
            token
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            ok: false,
            msg: 'Error inesperado en el servidor'
        })
    }

}

module.exports = {
    login
}