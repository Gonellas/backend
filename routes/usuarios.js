const {Router} = require ('express');
const {check} = require('express-validator');
const { validarCampos } = require('../middlewares/validar_campos');

//en vez de usar app ahora usamos router
const router = Router();

const {usersGet, usersPost, usersPut, usersDelete} = require('../controllers/usuariosControllers');
const { esRolValido, emailExiste, usuarioExiste } = require('../helpers/db-validators');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdminRol } = require('../middlewares/validar-roles');

//la peticion get es cuando desde el back le pedimos info al front
router.get('/', usersGet);

//! Antes de llamar a usersPost(peticion post), debería chequear los datos para recien pasar a userspost cuando la validacion sea efectiva

//desde el front le decimos que guardamos datos para almacenarlos en el back
router.post('/',
[
    //* Le estamos diciendo el campo que queremos validar, el mensaje de error y 
    //* el método que va a verificar esa validacióm, es decir que ese campo no tiene que estar vacío
    check("nombre", "El nombre es obligatorio").notEmpty(),

    //* Validamos el campo password, le mandamos mensaje de error validando la cantidad de caracteres,
    //* utilizamos la propiedad isLength para pasarle el minimo, se le puede pasar un maximo también
    //? También se pueden usar expresiones regulares con un método match, matchea la expresión regular pasada con el valor del campo
    check("password", "La contraseña debe tener un mínimo de 6 caracteres").isLength({min:6}),

    check("correo", "No es un correo válido").isEmail(),

    check("correo").custom(emailExiste),

    //*hay que especificar cuales son los roles que si son validos
    // check("rol", "El rol no es válido").isIn("USER_ROLE", "ADMIN_ROLE"),

    //*Mandamos el campo que queremos validar pero ya no le vamos a mandar mensaje,
    //*sino que le pasamos el método customizado que creamos mediante el método custom
    check("rol").custom(esRolValido),
    validarCampos
]
, usersPost);

//sirve para actualizar datos, junto con el path va con un id
router.put('/:id', [
    //* Mandamos campo que queremos validar, mensaje de error y existe un método para chequear
    //* que sea un id de mongo db 
    //? si no es un id de mongo devolveme este mensaje
    check("id", "No es un ID válido").isMongoId(),
    check("rol").custom(esRolValido),

    //*Validamos el id y vamos a decir que es custom pasándole el usuarioExistente
    check("id").custom(usuarioExiste),
    validarCampos
], usersPut);

//borra info, va con id tambien
router.delete('/:id',[
    validarJWT,
    esAdminRol,
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(usuarioExiste),
    validarCampos
], usersDelete);

module.exports = router;

//Desde el servidor vamos a decirle que apunte a esta ruta