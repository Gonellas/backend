const {response, request} = require('express');
const {validationResult} = require('express-validator')
const bcrypt = require('bcryptjs'); //Importar librería para encriptar contraseña
const Usuario = require ('../models/usuarios');

const usersGet = async (req = request, res = response) =>{

    const {desde, limite} = req.query;

    const query = {estado:true};

    // const {apiKey, limit} = req.query;

    //traer todos los usuarios
    //*Creamos una variable, hacemos una petición a la base de datos,
    //*utilizamos el modelo con el método find() que nos va a buscar a todos
    //? podemos el async a la función get
    // const usuarios = await Usuario.find().skip(desde).limit(limite);

    //*Creamos la variable, hacemos la petición, llamamos al modelo
    //* y vamos a utilizar un método que es countDocuments() que nos va a
    //*traer el total de los registros
    // const total = await Usuario.countDocuments();

    //*Vamos a desestructurar un arreglo que va a venir del await,
    //*y vamos a usar el método Promise.all() que significa que resuelva todas las promesas
    //* y adentro del método le pasamos un arreglo con las promesas hechas anteriormente
    //? vamos a desestructurar lo que queremos que nos devuelva cada promesa,
    //?la primera queremos que nos devuelva una variable llamada total y la segunda una var usuarios 
    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query).skip(desde).limit(limite)
    ])

    res.json({
        // message: "Get users",
        // apiKey,
        // limit
        total,
        usuarios
    })
}

const usersPost = async (req = request, res = response) =>{
    //!validar los errores
    // const errors = validationResult(req);
    // if(!errors.isEmpty()){
    //     return res.status(400).json(errors);
    // }
    //*Si error no está vacío quiere decir que no hay errores, entonces hay que detener el proceso
    //* devolvemos la respuesta con un status 400 y que devuelva en un json los errores

    //!recibir el cuerpo de la peticion
    const datos = req.body;
    const {nombre, correo, password, rol} = datos;
    const usuario = new Usuario({nombre, correo, password, rol});

    //!verificar el correo
    const existeEmail = await Usuario.findOne({correo});
    if(existeEmail){
        return res.status(400).json({
            msg:"El correo ya existe"
        });
    }
    //*Si nos devolvió algún dato con ese correo entonces hacemos un return(corta el proceso)
    //*Si existe un correo como el que el usuario intenta guardar entonces está mal, el usuario ya existe
    //*Como es un error del usuario el servidor le tiene que devolver un mensaje con status

    //!encriptar la contraseña
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    usuario.password = hash;

    //guardar en la BD
    await usuario.save();

    res.json({
        usuario,
        msg: "Usuario creado correctamente"
    });
}

const usersPut = async (req = request, res = response) =>{

    //Traemos el id
    //*la req tiene una propiedad llamada params donde vienen todos los parámetros
    //*que yo estoy mandando por la dirección
    const {id} = req.params;

    //Obtener los datos a actualizar
    const {password, correo, ...resto} = req.body;

    //Si actualizo la password debemo encriptarla
    //*Si viene la password.. hago la encriptación y busco el usuario y lo actualizo
    if(password){
        const salt = bcrypt.genSaltSync(10);
        resto.password = bcrypt.hashSync(password, salt);
    }
    
    //Buscar el usuario y actualizarlo
    //* a la constante le pasamos el modelo y un método del modelo que es findByIdAndUpdate()
    //*que recibe como parámetro le id que vamos a buscar y luego la info que queremos actualizar
    const usuario = await Usuario.findByIdAndUpdate(id, resto, {new:true});

    res.json({
        message: "Put users",
        usuario,
    })
}

const usersDelete = async(req = request, res = response) =>{

    const {id} = req.params;

    //eliminar registro
    const usuarioBorrado = await Usuario.findByIdAndDelete(id);

    //TODO Para cambiar estado a false
    //*vamos a crear una constante y vamos a ponerle el await,
    //*llamamos al modelo de Usuario junto con el método findById()
    //? es decir que busque un usuario por el id
    // const usuario = await Usuario.findById(id);

    //*Si yo tengo un usuario por el id y el estado está en falso,
    //* que nos retorne un mensaje json
    // if(!usuario.estado){
    //     return res.json({
    //         msg: "El usuario ya está inactivo"
    //     });
    // }

    //*Para desactivar al usuario, creamos la variable, le pasamos el modelo
    //*junto al método para que encuentre el id y lo actualice.
    //* Le pasamos el id del usuario y el estado para que cambie
    // const usuarioInactivado = await Usuario.findByIdAndUpdate(id,{estado:false}, {new:true});

    res.json({
        message: "Usuario Inactivo",
        usuarioBorrado
        // usuarioInactivado
        })
}

module.exports = {usersGet, usersPost, usersPut, usersDelete};