const {request, response} = require('express');


const esAdminRol = (req = request, res = response, next) =>{

    //*si no vienen los datos del usuario es porque
    //*no validé el token antes
    if(!req.usuario){
        //no validé el token antes
        return res.status(500).json({
            msg:"Se quiere validar el rol sin validar el token"
        })
    }

    //*vamos a traer el rol y el nombre
    const {rol, nombre} = req.usuario

    //?Entonces
    //*si el rol que estoy obteniendo de la req del usuario
    //* no es un admin role, le pasamos el error con el msg
    //*sino, puede seguir sin problema
    if(rol !== "ADMIN_ROLE"){
        return res.status(401).json({
            msg:`${nombre} no es administrador`
        })
    }

    next();
}

module.exports = {
    esAdminRol
}