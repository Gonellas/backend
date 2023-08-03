const {Schema, model} = require('mongoose');


const CategoriaSchema = Schema({

    //*Va a ser de tipo string y va a ser el único campo obligatorio
    //*que vamos a tener y si queremos que este campo sea único, es
    //*decir que no se pueda repetir el nombre le vamos a agregar el
    //*unique
    nombre:{
        type: String,
        required:[true,"El nombre es obligatorio"],
        unique:true
    },

    //*El estado va a ser de tipo boolean, tiene que pasar por el requerido
    //*pero le podemos poner que por defecto sea true aunque no lo mandemos
    estado:{
        type: Boolean,
        required:true,
        default: true
    },

    //*en este usuario quremos almacenar el id que venga del modelo de usuario
    //*tenemos que agregar un type nuevo que va a ser el id del objeto(object id)
    //*a este object id le tenemos que decir que va a venir de un Schema
    //?Entonces este usuario va a ser de tipo object id que viene de un Schema
    //*Para decirle de que modelo viene vamos a usar la propiedad ref, entre ""
    //*le decimos a que modelo queremos hacer referencia
    //*y le decimos que es requerido, que si o si tenemos que guardarlo
    usuario:{
        type: Schema.Types.ObjectId,
        ref:"Usuario",
        required: true
    }
})

module.exports = model("Categoria", CategoriaSchema);