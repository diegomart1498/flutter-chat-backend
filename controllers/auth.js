const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generatJWT } = require('../helpers/jwt');

const crearUsuario = async (req, res = response) => {
    const {email, password} = req.body;
    try{
        const existeEmail = await Usuario.findOne({email:email});
        if(existeEmail){
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya está registrado'
            });
        }

        const usuario = new Usuario(req.body);

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);
        // Guardar usuario
        await usuario.save();
        // Generar JSON Web Token
        const token = await generatJWT(usuario.id);
        // Enviar json de respuesta
        res.json({
        ok: true,
        usuario,
        token
        });

    }catch(error){
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}


const loginUsuario = async (req, res = response) => {
    const {email, password} = req.body;
    try{
        const usuarioDB = await Usuario.findOne({email:email});
        if(!usuarioDB){
            return res.status(404).json({
                ok: false,
                msg: 'Email no encontrado'
            });
        }
        // Validar el password
        const validPassword = bcrypt.compareSync(password, usuarioDB.password);
        if(!validPassword){
            return res.status(400).json({
                ok: false,
                msg: 'La contraseña no es válida'
            });
        }
        // Generar el JSON Web Token
        const token = await generatJWT(usuarioDB.id);
        // Enviar json de respuesta
        res.json({
            ok: true,
            // msg: 'Login correcto',
            usuario: usuarioDB,
            token
        });
    }catch(error){
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: '¡Comuníquese con el administrador!'
        });
    }
}


const renewToken = async (req, res = response) => {
    const uid = req.uid;
    try{
        const token = await generatJWT(uid);
        const usuarioT = await Usuario.findById(uid);
        // Enviar respuesta json
        res.json({
            ok: true,
            // msg: 'Token renovado',
            usuario: usuarioT,
            token
        });
    }catch(error){
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: '¡Comuníquese con el administrador!'
        });
    }
}

module.exports = {
    crearUsuario,
    loginUsuario,
    renewToken
}