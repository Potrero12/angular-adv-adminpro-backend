/*
    Ruta api/usuarios
*/

const { Router } = require('express');
const { check } = require('express-validator');

const { 
    getUsuario,
    crearUsuario,
    actualizarUsuario,
    borrarUsuario
} = require('../controllers/usuarios');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT, validarAdminRole, validarMismoUsuario } = require('../middlewares/validar-jwt');

const router = Router();


//Rutas
router.get('/', validarJWT, getUsuario);

router.post('/crear-usuario', 
    [
        check('nombre', 'El Nombre Es Obligatorio').not().isEmpty(),
        check('email', 'El Email Es Obligatorio y Unico').isEmail(),
        check('password', 'El Password Es Obligatorio').not().isEmpty(),
        validarCampos
    ],
    crearUsuario
);

router.put('/actualizar-usuario/:id',
    [
        validarJWT,
        validarMismoUsuario,
        check('nombre', 'El Nombre Es Obligatorio').not().isEmpty(),
        check('email', 'El Email Es Obligatorio y Unico').isEmail(),
        check('role', 'El Role Es Obligatorio').not().isEmpty(),
        validarCampos
    ], 
    actualizarUsuario);

router.delete('/borrar-usuario/:id', validarJWT, validarAdminRole, borrarUsuario);





module.exports = router;