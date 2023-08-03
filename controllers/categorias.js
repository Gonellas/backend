const {response, request} = require('express');
const Categoria = require('../models/categoria');

//*creamos la variable, va a ser una función que va a recibir la res y la req
const obtenerCategorias = async (req = request, res = response) =>{

    //Obtener todas las categorías paginadas con el total
    //*queremos obtener la query de "desde" y "límite" para paginarlas porque capaz
    //*tenemos un montón de categorías y también queremos que nos muestre solo las categorías
    //*que están activas
    const {desde, limite} = req.query;
    const query = {estado:true};

    //*countDocuments contaba contaba la cantidad de documentos que tenemos en la colección
    //*find buscaba las colecciones que tengan el registro en true porque le pasamos la query
    //*con el skip le decíamos desde donde y con el limit la cantidad de documentos que queremos traer
    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query).skip(desde).limit(limite)
    ])

    res.json({
        total,
        categorias
    })
}

//*creamos la variable, va a ser una función que va a recibir la res y la req
//*y también vamos a decir que es una función asíncrona
const obtenerCategoria = async (req = request, res = response) =>{

    //*vamos a desestructurar el id que viene de la req.params
    const {id} = req.params;

    //*vamos a crear una constante categoria, vamos a esperar, llamamos al modelo de Categoria
    //*y utilizamos el metodo findById pasándole el id
    //?el método populate recibe cual es el campo donde se encuentra el id, que lo habíamos
    //?definido en usuario en el modelo de categoria, le pasamos usuario entre "",
    //?el segundo parámetro son los datos que queremos traer con el id que tenemos
    //!para pasarle esto tiene que ser entre comillas y separado por un espacio
    const categoria = await Categoria.findById(id).populate("usuario", "nombre correo");

    //*le mandamos la categoria que encontramos
    res.json({
        categoria
    })
}

//*creamos la variable, al igual que las demas peticiones va a ser asíncrona
//*también vamos a recibir la req y res
const crearCategoria = async (req = request, res = response) =>{

    //*creamos la variable que va a ser igual a la req.body.nombre
    const nombre = req.body.nombre.toUpperCase();

    //Verificar si la categoría ya existe
    //*vamos a crear una categoríaDB y simplemente vamos a hacer un consulta
    //*que busque esa categoría con ese nombre que se va a almacenar en
    //*categoriaDB
    const categoriaDB = await Categoria.findOne({nombre});

    //*entonces preguntamos si categoriaDB existe porque no es undifined
    //*le pasamos una respuesta con un error 400 porque viene de parte del
    //*usuario
    if(categoriaDB){
        res.status(400).json({
            msg:`La categoría ${categoriaDB.nombre} ya existe`
        })
    }

    //generar data que vamos a guardar
    //*podemos crear un objeto que se llame data, este objeto data va a tener
    //*nombre, y luego vamos a almacenar usuario que nos traiga el id de la req
    //?la req viene de la validación de jwt que le pasamos el dato del usuario
    //?autenticado
    const data ={
        nombre,
        usuario: req.usuario._id
    }

    //*creamos la variable categorias que sea igual a new Categoría, es decir
    //*que depende de nuestro modelo y le mandamos la data
    const categoria = new Categoria(data);

    //*para guardarlo solo tenemos que hacer el await, llamamos a categoria
    //*con su método save
    await categoria.save();

    //*respuesta con status de registro exitoso que devuelva categoria
    //*y un msg
    res.status(201).json({
        categoria,
        msg:'Categorpia creada exitosamente'
    })
}

module.exports = {
    obtenerCategorias,
    obtenerCategoria,
    crearCategoria
}