const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
// Importamos passport a nuestra aplicación, que será el sistema que se encargue de ver si los usuarios se han autenticado.
const passport=require('passport');
let db;

// Iniciamos la aplicación de Express, nos conectamos a la base de datos de mongoDB, indicamos a Express que esté atento a los mensajes de JSON, creamos una ruta a la que pasamos un objeto con nombre, email y password para crear un usuario e iniciamos el servidor en el puerto 3001.


MongoClient.connect(
    'mongodb://localhost:27017',
    function (err, client) {
        db = client.db('seionestienda');
    }
);

// Inicializamos sesiones que nuestro sistema de login utilizará para llevar el registro del usuario que se ha fogueado a nuestra aplicación, de una petición a otra. El valor resave a false indica que no vamos a volver a guardar las variables de la sesión si no cambia nada, y la de saveUninitialized a false indica que no vamos a guardar datos de usuarios esta que se logueen.
const session = require('express-session');
app.use(session(
    {
        secret: 'secret',
        resave: false,
        saveUninitialized: false
    }
));
// Primero lo inicializaremos y después indicaremos que guarde los datos en las sesiones de Express.
app.use(passport.initialize());
//session conecta el navegadro con nuestro servidor
app.use(passport.session());
app.use(express.json());
const LocalStrategy = require('passport-local').Strategy;
passport.use(
    new LocalStrategy(
        { usernameField: 'email' 
    // //passwordField:contrasenia
},
        function (email, password, done) {
            db.collection('users').find({ email: email }).toArray(function (err, users) {
                if (users.length === 0) {
                    return done(null, false);
                }
                const user = users[0];
                if (password === user.password) {
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            });
        }
    )
);

// Indicamos a passport el método que tiene que utilizar para guardar el usuario en la sesión, y los pasos para obtener la información completa a partir de la información resumida. Esto hace que no tengamos que guardar (y enviar) tanto información de sesión. El proceso de “resumido” se hace en el método serializeUser y el de obtener el usuario en deserializeUser

passport.serializeUser(function (user, done) {
    done(null, user.email);
});
passport.deserializeUser(function (id, done) {
    db.collection('users').find({ email: id }).toArray(function (err, users) {
        if (users.length === 0) {
            done(null, null);
        }
        done(null, users[0]);
    });
});
// Utilizamos el método passport.authenticate al que le pasaremos el email y la contraseña, e indicamos a que rutas (con método GET) vamos a redireccionar la petición en caso de loguearse correcta o incorrectamente. En el incorrecto mandaremos un mensaje de denegado, mientras que en el correcto comprobaremos que todo este bien y en ese caso mandaremos un mensaje al respecto. Dentro de cualquier ruta utilizamos el método isAuthenticated para saber si esta logueado o no.

app.post('/api /login', passport.authenticate('local', {
    successRedirect: '/api',
    failureRedirect: '/api/fail'
}));
app.get('/api/fail', function(req, res) {
    res.status(401).send({mensaje: 'denegado'})
});
app.get('/api', function (req, res) {
    if (req.isAuthenticated() === false) {
        return res.status(401).send({mensaje: 'necesitas loguearte'});
    }
    res.send({mensaje: 'logueado correctamente'});
});

app.post('/api/register', function (req, res) {
    db.collection('users').insertOne({
        name: req.body.nombre,
        email: req.body.email,
        password: req.body.password
    },
    function(err, datos) {
        res.send({mensaje: 'registrado'});
    })
});

app.get('/api/user', function(req, res) {
    if(req.isAuthenticated()) {
        return res.send({nombre: req.user.name});
    }
    res.send({nombre: ‘No logueado’});
});
app.listen(3001);