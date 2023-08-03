const {Router} = require ('express');
const {check} = require('express-validator');
const { validarCampos } = require('../middlewares/validar_campos');
const {validarJWT} = require('../middlewares/validar-jwt');
const {esAdminRol} = require('../middlewares/validar-roles');
const { obtenerCategorias, obtenerCategoria, crearCategoria, actualizarCategoria, borrarCategoria } = require('../controllers/categorias');

const router = Router();

//*Cuando usemos el get que se dispare la función obtenerCategorias
//*y nos traiga todas las categorías
router.get('/', [validarJWT], obtenerCategorias);

//*y si queremos traer a una categoría por su id, tendríamos que pasarle
//*el id a la ruta y le cambiamos el nombre al controlador por el singular
router.get('/:id',[
    validarJWT,
    check("id", "No es un ID válido").isMongoId(),
    //validar si existe una categoría con ese id,
    validarCampos
], obtenerCategoria);

//*la petición post para crear una categoría
router.post('/', [
    validarJWT,
    esAdminRol,
    check("nombre", "El nombre es obligatorio").notEmpty(),
    validarCampos
], crearCategoria);

//*la petición put para actualizar una categoría y le mandamos el id
//*como parámetro
router.put('/:id', [
    validarJWT,
    esAdminRol,
    check("id", "No es un ID válido").isMongoId(),
    //validar si existe una categoría con ese id,
    check("nombre", "El nombre es obligatorio").notEmpty(),
    validarCampos
], actualizarCategoria);

//*finalmente tendríamos el delete a quien también le pasamos el id
router.delete('/:id', [
    validarJWT,
    esAdminRol,
    check("id", "No es un ID válido").isMongoId(),
    //validar si existe una categoría con ese id,
    validarCampos
], borrarCategoria);

module.exports = router;