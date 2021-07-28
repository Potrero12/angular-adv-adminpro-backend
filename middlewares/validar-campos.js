const { response } = require('express');
const { validationResult } = require('express-validator');

const validarCampos = (req, res = response, next) => {

    const errores = validationResult( req );

    if(!errores.isEmpty()){
        return res.status(400).send({
            ok:false,
            erros: errores.mapped()
        });
    };

    next();
};

module.exports = {
    validarCampos
}