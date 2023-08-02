const { response, request } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuarios');
const { generarJWT } = require('../helpers/generar-jwt');

//*Creamos la función que recibía como parámetro al res y req
const login = async (req = request, res = response) => {

    //*del cuerpo de la petición obtenemos el correo y el password
    const { correo, password } = req.body;

    try {

        //1.Verificar si el correo existe
        //*Para verificar tenemos que almacenar la respuesta
        //*Llamamos al modelo, utilizamos el método findOne()
        //*que buscaba un dato y le pasamos el correo
        //?como estamos haciendo una petición a la base de datos,
        //?la función tiene que ser asíncrona
        const usuario = await Usuario.findOne({correo})

        if(!usuario){
            //*Al ser un error del usuario le pasamos el error 400
            return res.status(400).json({
                msg:"Correo o password incorrectos"
            })
        }

        //2.Verificar si el usuario está activo
        //*Si el usuario no está activo, devolveme esta respuesta/error
        if(!usuario.estado){
            return res.status(400).json({
                msg:"Correo o password incorrectos | Usuario inactivo"
            })
        }

        //3.Verificar la contraseña
        //*Creamos la variable para almacenar la respuesta
        //* y vamos a llamar a la librería y vamos a utilizar el método
        //*compareSync() que nos pide un string que sería el pass que recibimos
        //*del usuario y como segundo valor el hash string que ya lo tenemos 
        //*guardado en el usuario entonces lo llamamos como usuario.password
        const validPassword = bcrypt.compareSync(password, usuario.password);

        if(!validPassword){
            return res.status(400).json({
                msg:"Correo o password incorrectos"
            })
        }

        //4.Generar el token
        const token = await generarJWT(usuario.id);


        res.json({
            msg: "Login OK",
            token,
            usuario
            // correo,
            // password
        });

    } catch (error) {

        console.log(error);

         //*le pasamos la respuesta, y como es un error de nuestro servidor
        //*le pasamos un status con el código
        //*le agregamos el json porque va a ser devuelvo en ese formato
        //*y le pasamos un mensaje para que el front nos pueda avisar
        return res.status(500).json({
            msg: "Hable con el administrador"
        })
    }



}


module.exports = {
    login
}