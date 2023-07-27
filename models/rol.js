const {Schema, model} = require('mongoose');

const RolSchema = Schema({
    rol: {
        type: String,
        required: [true, "El rol es obligatorio"] //booleano y mensaje de error
    }
})

module.exports = model ("Rol", RolSchema);