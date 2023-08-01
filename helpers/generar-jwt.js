const jwt = require('jsonwebtoken');


const generarJWT = (uid) =>{

    //*Retornamos una promesa, esta promesa recibe dos métodos
    //* resolve y reject
    //?Cuando se genera el token correctamente lo devolvemos con resolve
    //? y si da un error devolvemos con reject
    return new Promise((resolve, reject) =>{

        //Crear el payload
        //*recibimos el user id
        const payload = {uid};

        //generar jwt
        //*Lo hacemos con la documentación mostrada previamente
        //*generar la secretOrPrivateKey 
        //!No queremos que esto se suba a github entonces lo mandamos a .env
        //?Para usarla llamamos a process.env.SECRET.. 
        //*Como tercer valor mandamos las opciones entre llaves
        //*cuando expira y luego viene el callback

        jwt.sign(payload, 
            process.env.SECRETORPRIVATEKEY, 
            {
            expiresIn:"4h"
            }, 
            (err, token)=>{
            //*preguntamos si viene el error que devuelva un mensaje en consola
            //*mostrandolo pero devolvemos con un reject el error
                if(err){
                    console.log(err);
                    reject("No se puede generar el token")
                } else{
                    resolve(token);
                }
        })
    })
}

module.exports = {
    generarJWT
}
