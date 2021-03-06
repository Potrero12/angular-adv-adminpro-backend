/*
    Ruta api/login
*/

const { Router } = require('express');
const { check } = require('express-validator');

const { login, googleSignIn, renewToken } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();


router.post('/login', 
    [
        check('email', 'El Email Es Obligatorio').isEmail(),
        check('password', 'La Contraseña El Obligatoria').not().isEmpty(),
        validarCampos
    ],
    login
)

router.post('/google', 
    [
        check('token', 'La Token De Google El Obligatoria').not().isEmpty(),
        validarCampos
    ],
    googleSignIn
)

router.get('/renew', 
    validarJWT,
    renewToken
)




module.exports = router;