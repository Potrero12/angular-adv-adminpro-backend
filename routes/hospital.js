/**
 * Ruta api/hospital
 */


const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT } = require('../middlewares/validar-jwt');
const { validarCampos } = require('../middlewares/validar-campos');

const { 
    getHospitales,
    getHospital,
    crearHospital,
    actualizarHospital,
    borrarHospital
} = require('../controllers/hospital');

const router = Router();

router.get('/', getHospitales);
router.get('/:id', getHospital);

router.post('/crear-hospital', 
    [
        validarJWT,
        check('nombre', 'El Nombre Del Hospital Es Obligatorio').not().isEmpty(),
        validarCampos
    ], 
    crearHospital);
router.put('/actualizar-hospital/:id', actualizarHospital);
router.delete('/borrar-hospital/:id', borrarHospital);

module.exports = router;