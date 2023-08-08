const Rol = require('../models/rol');
const Usuario = require('../models/usuarios');
const Categoria = require('../models/categoria');
const Curso = require('../models/curso');

//Validar Rol
const esRolValido = async (rol) => {

    //!En esta variable vamos a hacer una búsqueda del rol por params
    //!que estamos recibiendo en la base de datos
    //?El método findOne() busca una coincidencia
    const existeRol = await Rol.findOne({rol})

    //*Si no existe el rol, no puedo devolver un response
    //*por lo que vamos a utilizar el throw new Error
    //?Es la respuesta del servidor a la consola(frontend)
    if(!existeRol){

        throw new Error(`El rol ${rol} no existe en la base de datos`);
        //*Mandamos por mensaje que el rol recibido no existe
    }
};

//Validar mail
const emailExiste = async(correo) => {
    const existeEmail = await Usuario.findOne({correo});
    if(existeEmail){
        throw new Error(`El correo ${correo} ya se encuentra registrado`);
    }
}

//Si existe el usuario por id
//*Como va a ser una función que va a chequear a la base de datos, va a ser asíncrona
//*y va a recibir al id
//?No vamos a usar el findOne porque hay un método exclusivo para buscar ids
const usuarioExiste = async (id) =>{

    //* Entonces creamos una constante que va a almacenar la respuesta de la búsqueda,
    //*llamamos al Usurio y le pasamos como parámetro el id
    const existeUsuario = await Usuario.findById(id);

    //*Entonces preguntamos
    //?Si no existe el usuario con ese id colocamos un throw new error
    if(!existeUsuario) throw new Error(`El id ${id} no corresponde a ningún usuario registrado`);
}

const categoriaExiste = async (id) =>{

    //*Si no encuentra nada nos va a devolver un undefined
    const existeCategoria = await Categoria.findById(id);

    //*Entonces si no existe tal id, le pasamos el error
    if(!existeCategoria) throw new Error(`El id ${id} no corresponde a ninguna categoría registrada`);
}

const cursoExiste = async (id) =>{

    //*Si no encuentra nada nos va a devolver un undefined
    const existeCurso = await Curso.findById(id);

    //*Entonces si no existe tal id, le pasamos el error
    if(!existeCurso) throw new Error(`El id ${id} no corresponde a ningun curso registrado`);
}

module.exports = {
    esRolValido,
    emailExiste,
    usuarioExiste,
    categoriaExiste,
    cursoExiste
}