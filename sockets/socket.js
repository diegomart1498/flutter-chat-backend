const {io} = require('../index');
const { comprobarJWT } = require('../helpers/jwt');
const { usuarioConectado, usuarioDesconectado, grabarMensaje } = require('../controllers/socket');

//Mensajes de Sockets
io.on('connection', (client) => {
    console.log('Cliente conectado');
    const token = client.handshake.headers['x-token'];
    const [valido, uid] = comprobarJWT(token);
    // Verificación de autenticación
    if(!valido){return client.disconnect();}
    // Cliente autenticado
    usuarioConectado(uid);
    // Ingresar al usuario a una sola en particular
    client.join(uid);
    // Escuchar del cliente el mensaje
    client.on('mensaje-personal', async (payload) => {
        await grabarMensaje(payload);
        io.to(payload.para).emit('mensaje-personal', payload);
    });

    client.on('disconnect', () => {
        // console.log('Cliente desconectado');
        usuarioDesconectado(uid);
    });

    // client.on('mensaje', ( payload ) => {
    //     console.log('Mensaje:', payload);
    //     io.emit('mensaje', { admin: 'Nuevo mensaje' });
    // });
});