//importamos los módulos necesarios. express para la aplicación y bcrypt para cifrar contraseña
const express = require('express');
const bcrypt = require('bcrypt');

//creamos una función cifrarPassword que recibe 3 parámetros: req,res y next. req es la petición que recibe el servidor, res es la respuesta que envía y next es un parámetro que llamará o dará paso a la siguiente función que hemos definido
function cifrarPassword(req,res,next){
    //recogemos la contraseña del body
    let password = req.body.password;
    //usamos la función hashSync para cifrar la contraseña. el segundo parámetro es el nivel de complejidad que queremos que tenga el cifrado. guardamos la contraseña cifrada en el body para poder recibirla en la siguiente función
    req.body.password = bcrypt.hashSync(password, 10);
    //llamamos a la siguiente función
    next();
}
//exportamos el módulo
module.exports = cifrarPassword;