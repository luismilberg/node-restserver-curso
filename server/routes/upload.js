const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const fs = require('fs');
const path = require('path');

const Usuario = require('../models/usuario');

//Default options
app.use(fileUpload({useTempFiles: true}));

app.put('/upload/:tipo/:id', (req, res) => {

    let tipo = req.params.tipo;
    let id = req.params.id;


    //Verifica si hay un archivo en la petición y lo asigna a la variable archivo

    if(!req.files){
        return res.status(400).json({
            ok: false,
            err:{
                message: 'No se ha seleccionado ningún archivo'
            }
        });
    }

    let archivo = req.files.archivo;

    
    //Validar tipo para asignar la imagen
    
    //Tipos permitidos:
    let tiposValidos = ['productos', 'usuarios'];
    
    if(tiposValidos.indexOf(tipo) < 0){
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos permitidos son ' + tiposValidos.join(', '),
            }
        });
    }
    
    //Validar las extensiones de los archivos a cargar

    // Extensiones permitidas:
    let extensionesValidas = ['png','jpg','gif','jpeg'];
    
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];
    
    if(extensionesValidas.indexOf(extension) < 0){
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son ' + extensionesValidas.join(', '),
                ext: extension
            }
        });
    }

    //Guarda el archivo subido en el folder correspondiente

    //Cambiar el nombre al archivo
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`

    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {

        if(err){
            return res.status(500).json({
                true: false,
                err
            });
        }

        //En este punto, imagen ya cargada


        imagenUsuario(id, res, nombreArchivo);

    });

});

function imagenUsuario(id, res, nombreArchivo){
    
    Usuario.findById(id, (err, usuarioDB) => {

        if(err){
            //Limpia el archivo que no está vinculado a un usuario
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            });
            
        }
        
        if(!usuarioDB){
            return res.status(400).json({
                ok: false,
                err:{
                    message: 'Usuario no existe'
                }
            });
        }

        //Limpia la imagen anterior del usuario
        borraArchivo(usuarioDB.img, 'usuarios');
        
        usuarioDB.img = nombreArchivo;
        
        usuarioDB.save( (err, usuarioGuardado) => {
            if(err){
                return res.status(500).json({
                    ok: false,
                    err
                });

            }

            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            });

        });

    });

}

function imagenProducto(){
    
}

function borraArchivo(nombreImagen, tipo){

    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);

    if(fs.existsSync(pathImagen)){
        fs.unlinkSync(pathImagen);
    }
}

module.exports = app;