const jwt = require("jsonwebtoken");
const Usuario = require('../models/usuario');

const validarJWT = (req, res, next) => {

    //leer token
    const token = req.header('x-token');

    if (!token) {
        return res.status(401).send({
            ok: false,
            msg: 'El Token No Tiene cabecera de autentificación'
        })
    }

    try {

        const { uid } = jwt.verify(token, process.env.JWT_SECRET_KEY);

        req.uid = uid;

        next();

    } catch (error) {
        return res.status(401).send({
            ok: false,
            msg: 'Token No Valido'
        })
    }
}

const validarAdminRole = async(req, res, next) => {

    const uid = req.uid;

    try {

        const usuarioDB = await Usuario.findById(uid);

        if(!usuarioDB){
            return res.status(400).send({
                ok:false,
                msg: 'Usuario No Existe'
            })
        }

        if(usuarioDB.role !== 'ADMIN_ROLE'){
            return res.status(403).send({
                ok:false,
                msg: 'No Tiene Privilegios Para Hacer EL Cambio'
            })
        }

        next();
        
    } catch (error) {
        return res.status(500).send({
            ok: false,
            msg: 'Erros Inesperado, Hablar con Administración'
        })
    }

}

const validarMismoUsuario = async(req, res, next) => {

    const uid = req.uid;
    const id = req.params.id;

    try {

        const usuarioDB = await Usuario.findById(uid);

        if(!usuarioDB){
            return res.status(400).send({
                ok:false,
                msg: 'Usuario No Existe'
            })
        }

        if(usuarioDB.role === 'ADMIN_ROLE' || uid === id){
            next();
        } else {
            return res.status(403).send({
                ok:false,
                msg: 'No Tiene Privilegios Para Hacer EL Cambio'
            })
        }
        
    } catch (error) {
        return res.status(500).send({
            ok: false,
            msg: 'Erros Inesperado, Hablar con Administración'
        })
    }

}

module.exports = {
    validarJWT,
    validarAdminRole,
    validarMismoUsuario
}