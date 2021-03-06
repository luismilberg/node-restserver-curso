//=====================
// Puerto
//=====================

process.env.PORT = process.env.PORT || 3000;

//=====================
// Entorno
//=====================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//=====================
// Base de datos
//=====================

let urlDB;

if (process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

//======================
// Vencimiento del token
//======================
//60 seg * 60 min * 24 hs * 30 días

process.env.CADUCIDAD_TOKEN = '48h';

//======================
// SEED de autenticacion
//======================

process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';


//======================
// Google Client ID
//======================

process.env.CLIENT_ID = process.env.CLIENT_ID || '390594960547-gvb1s3v6noic2699ifsrkme075n7jbfb.apps.googleusercontent.com';