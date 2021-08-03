const { response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');


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

const googleSignIn = async(req, res = response) => {

    const googleToken = req.body.token;

    try {

        const { name, email, picture } = await googleVerify( googleToken );

        // verificar si existe el usuario
        const usuarioDB = await Usuario.findOne({email});
        let usuario;

        if(!usuarioDB) {
            //si no existe el usuario
            usuario = new Usuario({
                nombre: name,
                email,
                password: '@@@',
                img: picture,
                google: true
            })
        } else {
            // existe usuario
            usuario = usuarioDB;
            usuario.google = true;
        }

        //guardar DB
        await usuario.save();

        //general el token - jwt
        const token = await generarJWT(usuarioDB.id);

        res.status(200).send({
            ok: true,
            token
        })
        
    } catch (error) {
        res.status(401).send({
            ok: false,
            msg: 'El Token No Es Correcto'
        })
    }

}

const renewToken = async(req, res = response) => {

    const uid = req.uid;


    //general el token - jwt
    const token = await generarJWT(uid);

    // Obtener el usuario uid
    const usuario = await Usuario.findById(uid);

    res.status(200).send({
        ok: true,
        token,
        usuario

    })

}

module.exports = {
    login,
    googleSignIn,
    renewToken
}