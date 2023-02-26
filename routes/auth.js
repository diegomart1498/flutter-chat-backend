//! Path: api/login

const { Router } = require('express');
const { check } = require('express-validator');

const { crearUsuario, loginUsuario, renewToken } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.post('/new', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').not().isEmpty(),
    check('email', 'El email no es válido').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    // check('password', 'La contraseña no es segura').isStrongPassword(), 
    //Requiere mínimo 8 carácteres, una mayúscula, un caracter especial y algún número.
    validarCampos
], crearUsuario);

router.post('/',[
    check('email', 'El email es obligatorio').not().isEmpty(),
    check('email', 'El email no es válido').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
], loginUsuario);

router.get('/renew', validarJWT, renewToken);

module.exports = router;