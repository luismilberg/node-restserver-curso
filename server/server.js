require('./config/config');
const express = require('express');
const app = express();
const path = require('path');

// Using Node.js `require()`
const mongoose = require('mongoose');

const bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

//habilitar la carpeta public
app.use(express.static( path.resolve(__dirname, '../public')));
 
//Configuración global de las rutas
app.use(require('./routes/index'));

mongoose.connect(process.env.URLDB, 
    { useNewUrlParser: true, useUnifiedTopology: true }
    ,(err, res) => {
  if(err) throw err;

  console.log('Base de datos online!');

});


app.listen(process.env.PORT, () => {
    console.log('Escuchando en el puerto: ', process.env.PORT);
})