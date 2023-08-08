const {Router} = require('express');
const {check} = require('express-validator');
const {validarCampos} = require('../middlewares/validar_campos');
const {validarJWT} = require('../middlewares/validar-jwt');
const {esAdminRol} = require('../middlewares/validar-roles');
const { obtenerCursos, obtenerCurso, crearCurso, actualizarCurso, borrarCurso } = require('../controllers/cursos');
const {cursoExiste} = require('../helpers/db-validators');

const router = Router();

router.get('/', obtenerCursos);

router.get('/:id', [
    check('id', 'El ID no es válido').isMongoId(),
    //Validar si existe el curso,
    check('id').custom(cursoExiste),
    validarCampos
], obtenerCurso);

router.post('/', [
    validarJWT,
    esAdminRol,
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    validarCampos
], crearCurso);

router.put('/:id', [
    validarJWT,
    esAdminRol,
    check('id', 'El ID no es válido').isMongoId(),
    //validar si el curso existe
    check('id').custom(cursoExiste),
    validarCampos
], actualizarCurso);

router.delete('/:id', [
    validarJWT,
    esAdminRol,
    check('id', 'El ID no es válido').isMongoId(),
    check('id').custom(cursoExiste),
    validarCampos
], borrarCurso);

module.exports = router;