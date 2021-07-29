/**
 * Ruta api/uploads
 */

const { Router } = require('express');
const ExpressfileUpload = require('express-fileupload');

const { validarJWT } = require('../middlewares/validar-jwt');
const { fileToUploads, retornaImagen } = require('../controllers/uploads');


const router = Router();

router.use(ExpressfileUpload());

router.put('/:tipo/:id', validarJWT, fileToUploads);
router.get('/:tipo/:foto', retornaImagen);

module.exports = router;