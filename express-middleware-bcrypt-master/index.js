//importamos los módulos instalados. express para el servidor, mongodb para la base de datos y bcrypt para cifrar contraseñas
const express = require('express');
const mongodb = require('mongodb');
const bcrypt = require('bcrypt');

//nos conectamos al servidor de la base de datos.
let MongoClient = mongodb.MongoClient;
let db;

MongoClient.connect('mongodb://127.0.0.1:27017', function (err, client) {
    if (err !== null) {
        console.log(err);
    } else {
        db = client.db('middleware')
    }
});

//inicializamos el servidor
const app = express();
//importamos el módulo que utilizamos para cifrar contraseñas.
const cifrarPassword = require('./cifrarPassword');

//indicamos a express que utilice archivos estáticos y que lea json en el body de las peticiones
app.use(express.static('public'));
app.use(express.json());

//definimos una ruta POST que usaremos para registrar un usuario. esta ruta ejecuta una función de middleware llamada cifrarPassword (que hemos importado de otro módulo). cuando el servidor reciba una petición a esta ruta, ejecutará la función de middleware y luego ejecutará la función que hemos definido dentro de la ruta
app.post('/registro', cifrarPassword, function (req, res) {
    //la contraseña cifrada nos llega en el body, porque la hemos cifrado en la función de middleware y la hemos añadido al body
    let passwordCifrada = req.body.password;
    
    //añadimos un nuevo usuario a la BBDD (podríamos hacer primero una comprobación de si ese usuario ya existe)
    db.collection('users').insertOne({ username: req.body.username, password: passwordCifrada }, function (err, result) {
        if (err !== null) {
            console.log(err);
            res.send({ mensaje: "Hubo un error" })
        } else {
            if (result.insertedCount === 1) {
                res.send({ mensaje: "Usuario registrado correctamente", ok: true })
            } else {
                res.send({ mensaje: "No se ha podido registrar el usuario", ok: false })
            }
        }
    })

})

//creamos una ruta POST que usaremos para que el usuario inicie sesión
app.post('/login', function (req, res) {
    //recogemos del body el nombre de usuario y la contraseña introducida por el usuario
    let username = req.body.username;
    let password = req.body.password;
    //buscamos en la base de datos un elemento con ese nombre de usuario
    db.collection('users').find(username).toArray(function (err, user) {
        if (err !== null) {
            res.send({ mensaje: "Hubo un error" })
        }
        //miramos la longitud del array que nos devuelve la BBDD. si es mayor que 0 significa que ha habido una coincidencia: existe ese nombre de usuario.
        else if (user.length > 0) {
            //usamos bcrypt para comparar la contraseña escrita y la que tenemos guardada en la BBDD. usamos el método compareSync para ello y le pasamos dos parámetros: primero la contraseña que nos llega en la petición y, segundo, la contraseña guardada en la BBDD (que está cifrada). si devuelve true es porque son la misma contraseña
            if (bcrypt.compareSync(password, user[0].password)) {
                //si el nombre de usuario y contraseña son correctos entramos aquí. generamos un número aleatorio que mandaremos con la respuesta. ese número aleatorio lo usaremos para guardar en el sessionStorage del navegador (para controlar que el usuario está logueado). además, guardamos ese número en la BBDD junto con el usuario
                //el método toFixed() lo usamos para limitar el número de decimales que queremos que tenga el número
                let numero = Math.random().toFixed(5);
                //actualizamos el usuario en la base de datos con el token. lo usaremos más tarde para comprobar el usuario
                db.collection('users').updateOne({username},{$set: {token: numero}}, function(err,result){
                    if(err!==null){
                        console.log(err);
                        res.send({mensaje: "Ha habido un error con la BBDD: "+err});
                    }else{
                        res.send({ mensaje: "Usuario logueado correctamente", ok: true, token: numero })
                    }
                })
            } else {
                res.send({ mensaje: "No se ha podido loguear", ok: false })
            }
        }
    })
});

//definimos una ruta GET. recibirá un token en la query (recuerda que viene en la url con el formato ?token=valor)
app.get('/home', function (req, res) {
    let token = req.query.token;
    console.log(token);
    //si el token viene con un valor diferente a 'null' (como lo pasamos por query, nos llega como un string) es porque el usuario está logueado
    if (token !== 'null') {
        //buscamos en la BBDD un usuario con el token que nos está llegando por query
        db.collection('users').find({token}).toArray(function(err,result){
            if(err!==null){
                res.send({mensaje: "Ha habido un error"})
            }
            //si nos llega un resultado, la longitud del array que nos llega será mayor que 1
            if(result.length>0){
                res.send({ mensaje: 'Bienvenido' });
            }else{
                res.send({mensaje: "No tienes permiso para acceder"})
            }
        })
        //si el token llega con valor 'null' es porque el usuario no está logueado y no le damos permiso para que acceda
    } else {
        res.send({ mensaje: "No tienes permiso para acceder" })
    }
})



app.listen(3000);