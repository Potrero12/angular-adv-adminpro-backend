/**
 * ruta api/medicos
 */

const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const { 
    getMedicos,
    getMedico,
    crearMedico,
    actualizarMedicos,
    BorrarMedico
} = require('../controllers/medico');

const router = Router();

router.get('/', getMedicos);
router.get('/:id', getMedico);

router.post('/crear-medico',
    [
        validarJWT,
        check('nombre', 'El Nombre Del Medico Es Obligatorio').not().isEmpty(),
        check('hospital', 'El Hospital debe ser valido').isMongoId(),
        validarCampos
    ], 
    crearMedico);


router.put('/actualizar-medico/:id',
    [
        validarJWT,
        check('nombre', 'El Nombre Del Medico Es Obligatorio').not().isEmpty(),
        check('hospital', 'El Hospital debe ser valido').isMongoId(),
        validarCampos
    ],
    actualizarMedicos);


router.delete('/borrar-medico/:id', validarJWT, BorrarMedico);

module.exports = router;