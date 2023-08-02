const {request, response} = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuarios');

//*esta función va a recibir la req, la res y había un método
//*que si el middleware después de hacer todos los chequeos estaba 
//* todo bien, continuaba con lo demás
const validarJWT = async (req = request, res = response, next) =>{

    const token = req.header("x-token");

    //preguntar si me mandaron el token
    //*si no viene el token devolvemos una respuesta con el error 401
    //?el error 401 es que no está autorizado
    //*y le pasamos también un mensaje
    if(!token){
        return res.status(401).json({
            msg:"No hay token en la petición"
        })
    }

    try {

        //verificar token y obtener el uid
        //*verify recibe el token y luego la llave secreta porque es la 
        //*única forma de obtener los datos del payload de un token
        const {uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        //obtener los datos del usuario autenticado
        //*creamos la variable, le pasamos el await, llamamos al modelo
        //*usamos el método findById y le pasamos el uid.
        const usuario = await Usuario.findById(uid)

        //Verificar si el usuario existe
        //*si el token está activo y el usuario no existe, el token no es válido
        if(!usuario){
            return res.status(401).json({
                msg:"Token no válido, usuario no existe"
            })
        }

        //Verificar si el usuario está activo
        if(!usuario.estado){
            return res.status(401).json({
                msg:"Usuario inactivo"
            })
        }

        //*Ya verificando los pasos previos podemos llamar  la request y crear una
        //*variable usuario y podemos almacenar los datos del usuario que acabamos 
        //*de autenticar, vamos a poder acceder a esta request desde el controlador 
        //*después
        req.usuario = usuario;

        next();
        
    } catch (error) {
        //*si al hacer la busqueda del usuario hubiera un problema
        //*le devolvemos tambien con un status 401 que el token no es valido
        console.log(error);
        res.status(401).json({
            msg:"Token no válido"
        })
    }

}

module.exports = {
    validarJWT
}