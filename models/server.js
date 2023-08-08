//Importamos express
const express = require('express')
const cors = require('cors');
const { dbConnection } = require('../database/config');

//Creamos una clase server, el constructor va a ser lo que va a construir todo lo que necesito
//para que el servidor funcione
class Server{
    constructor(){
        //en vez de hacer la constante con app la traemos con el constructor
        this.app = express();
        this.port = process.env.PORT;
        this.authPath = '/api/auth'
        this.usersPath = '/api/usuarios';
        this.categoriasPath = "/api/categorias";
        this.cursosPath = "/api/cursos";
        this.buscarPath = "/api/buscar";

        //conectar con base de datos
        this.conectarDB();

        //si al instanciar la clase queremos que se levante la funcion routes tenemos que llamarla desde el constructor
        this.middlewares();
        this.routes();
    }

    async conectarDB(){
        await dbConnection();
    }

    middlewares(){

        //CORS
        this.app.use(cors());

        //Leer lo que envia el usuario por cuerpo de la peticion
        this.app.use(express.json());

        //carpeta publica donde vamos a montar nuestras paginas web
        //si hacemos que la ruta principal no sea la raiz, public nos deberia redirigir a esa (acceso denegado)
       this.app.use(express.static('public'));
    }

    //para hacer la peticion creamos una funcion
    //esta funcion va a manejar todas las rutas que necesitemos de nuestro servidor
    routes(){
        this.app.use(this.authPath, require ('../routes/auth'));
        this.app.use(this.usersPath, require ('../routes/usuarios'));
        this.app.use(this.categoriasPath, require("../routes/categorias"));
        this.app.use(this.cursosPath, require ('../routes/cursos'));
        this.app.use(this.buscarPath, require ('../routes/buscar'));

        

        // //!como no tengo la variable app la tengo que llamar con this 
        // this.app.get('/api/users', function (req, res) {
        //     res.send('Alo alo alo') 
        //   })
    }

    //para escuchar el puerto creamos otra funcion
    listen(){
        //le ponemos una segunda variable, una funcion que nos devuelva un mensaje en consola
        this.app.listen(this.port, () => {
            console.log('Server online port:', this.port);

        })
    }
}

module.exports = Server; //es como el export default (frontend) pero en backend