const { response, request } = require('express');

const Usuario = require('../models/usuarios');
const Categoria = require('../models/categoria');
const Curso = require('../models/curso');

//Definimos colecciones permitidas
const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'cursos'
]

const buscarUsuarios = async (termino, res = response) => {

    //*Creamos la variable regex y le decimos que sea una nueva RegExp, que
    //*es una palabra reservada para decirle que regex va a ser una exp reg,
    //*es como si fuera una instancia.
    //? va a recibir el término, seguido del modificador "i" que nos dice que sea
    //?insensible a may o min
    const regex = new RegExp(termino, "i");

    //*creamos la variable, llamamos al modelo de usuario y dentro del find
    //*podemos buscar por correo o nombre
    const usuarios = await Usuario.find({
        $or: [{nombre: regex}, {correo: regex}],
        $and: [{estado:true}]
    })

    //*esta búsqueda nos devuelve un array con todos lo usuarios que haya encontrado
    res.json({
        results: usuarios
    })
}

const buscarCategorias = async(termino, res = response) => {
    const regex = new RegExp(termino, "i");

    const categorias = await Categoria.find({
        nombre: regex,
        estado: true
    })

    res.json({
        results: categorias
    })
}

const buscarCursos = async (termino, res = response) => {
    const regex = new RegExp(termino, "i");

    const cursos = await Curso.find({
        $or: [{nombre: regex}, {descripcion: regex}],
        $and: [{estado:true}]
    })

    res.json({
        results: cursos
    })
}

//Función principal de búsqueda
const buscar = (req = request, res = response) =>{

    const {coleccion, termino} = req.params;

    //Validar colección
    //*Si esta colección no está incluida en las colecciones permitidas
    //*Le vamos a devolver un status 400 porque el usuario está mandando
    //*algo que no era
    if(!coleccionesPermitidas.includes(coleccion)){
        return res.status(400).json({
            msg:`Las colecciones permitidas son: ${coleccionesPermitidas}`
        })
    }

    //De acuerdo a la colección buscar por el término
    //*Simplemente vamos a usar un switch, lo que vamos a chequear es
    //*la colección, entonces por ej si la colección es usuarios, voy a ejecutar
    //*una función que busque en esta colección el término
    //?Vamos a hacerlo por partes, dejamos definida la función y después la desarrollamos
    //*Esta función va a llevar dos parámetros: termino y la response porque lo vamos a usar
    //*para devolver una respuesta si encontramos o no el usuario
    switch(coleccion){
        case 'usuarios':
            buscarUsuarios(termino, res)
            break;
        case 'categorias':
            buscarCategorias(termino, res)
            break;  
        case 'cursos':
            buscarCursos(termino, res)
            break;  
        default:
            res.status(500).json({
                msg: 'Hubo un error al hacer la búsqueda'
            });
            break;
    }
}

module.exports = {
    buscar
}