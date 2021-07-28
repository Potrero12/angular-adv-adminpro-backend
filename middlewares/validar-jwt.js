const jwt = require("jsonwebtoken");


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

module.exports = {
    validarJWT
}