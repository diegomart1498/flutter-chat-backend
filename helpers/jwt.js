const jwt = require('jsonwebtoken');

const generatJWT = (uid) => {
    return new Promise( (resolve, reject) => {
        const payload = {uid};

        jwt.sign(payload, process.env.JWT_KEY, {
            expiresIn: '24h'
        }, (err, token)=>{
            if (err){
                //No se pudo crear el token
                reject('No se pudo generar el JSON Web Token');
            } else {
                //Token creado
                resolve(token);
            }
        });
    });
}

const comprobarJWT = (token = '') => {
    try{
        const { uid } = jwt.verify(token, process.env.JWT_KEY);
        return [true, uid];
    }
    catch(error){
        return [false, null];
    }
}

module.exports = {
    generatJWT,
    comprobarJWT
}