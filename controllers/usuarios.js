const { response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

const getUsuario = async (req, res) => {

    const desde = Number(req.query.desde) || 0;

    //mostrar la paginado los usuario que tengamos
    const [usuarios, total] = await Promise.all([
        Usuario.find({}, 'nombre email role google img')
                                   .skip(desde)
                                   .limit(5),
        Usuario.countDocuments()
    ])

    res.status(200).send({
        ok: true,
        usuarios,
        total
    })
}


const crearUsuario = async (req, res = response) => {

    //extraemos los campos del body
    const { email, password } = req.body;

    try {

        const existeEmail = await Usuario.findOne({ email: email });

        //validamos que el correo no este registrado
        if (existeEmail) {
            return res.status(400).send({
                ok: false,
                msg: 'El Correo Ya Esta Registrado'
            })
        }

        //asignamos los datos del body al modelo
        const usuario = new Usuario(req.body);

        //encryptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        //guardamos el usuario
        await usuario.save();

        const token = await generarJWT(usuario.id);

        res.status(200).send({
            ok: true,
            usuario,
            token
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            ok: false,
            msg: 'Error inesperado en el servidor'
        })
    }
}

const actualizarUsuario = async (req, res) => {

    // TODO: validar el token y comprobar si el usuario es correcto

    //traemos el id por los parametros
    const uid = req.params.id;

    try {

        //validamos que el id del usuario exista en la base de datos
        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(404).send({
                ok: false,
                msg: 'El Usuario No Existe'
            });
        }

        //actualizamos  el usuario
        const { password, google, email, ...campos } = req.body;

        //validacion del email del usuario a actualizar sea del mismo usuario que actualiza
        if (usuarioDB.email !== email) {

            const existeEmail = await Usuario.findOne({ email });

            if (existeEmail) {
                return res.status(400).send({
                    ok: false,
                    msg: 'Ya existe un Usuario Con Ese Email'
                })
            }
        }
        if(!usuarioDB.google){
            campos.email = email;
        } else if(usuarioDB.email !== email){
            return res.status(400).send({
                ok: false,
                msg: 'El usuario de google no puede cambiar el correo'
            })
        }
        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, { new: true });

        res.status(200).send({
            ok: true,
            usuario: usuarioActualizado
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            ok: false,
            msg: 'Error inesperado en el servidor'
        })
    }
}

const borrarUsuario = async (req, res = response) => {

    const uid = req.params.id;

    try {
        //validamos que el id del usuario exista en la base de datos
        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(404).send({
                ok: false,
                msg: 'El Usuario No Existe'
            });
        }

        await Usuario.findByIdAndDelete(uid);

        res.status(200).send({
            ok: true,
            uid,
            msg: 'Eliminado Correctamente'
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
    getUsuario,
    crearUsuario,
    actualizarUsuario,
    borrarUsuario
}