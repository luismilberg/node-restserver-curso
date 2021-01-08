const express = require('express');

let { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categoria');



app.get('/categoria', [verificaToken], (req, resp) => {

    //Mostrar todas las categorías, el paginado es opcional.

    //Opciones de filtrado en el GET
    let desde = req.query.desde || 0; 
    desde = Number(desde); 

    let limite = req.query.limite || 5;
    limite = Number(limite);

    //Consulta a la BD

    Categoria.find()
    .skip(desde)
    .limit(limite)
    .exec( (err, categorias) => {
        if(err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        
        Categoria.count((err, conteo) => {
            
            resp.json({
                ok: true,
                categorias,
                cuantos: conteo
            });
            
        });
    });
    
});

app.get('/categoria/:id', [verificaToken], (req, resp) => {

    //Mostrar una categoría por ID
    // Categoria.findById();

    let id = req.params.id;

    Categoria.find({id})
        .exec((err, categoria) => {
            if(err){
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            resp.json({
                ok: true,
                categoria
            });
        });
    
});

app.post('/categoria', [verificaToken, verificaAdmin_Role], (req, resp) => {

    let body = req.body;
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    })

    categoria.save((err, categoriaDB) => {
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }
        
        resp.json({
            ok:true,
            categoria: categoriaDB
        });

    });


    //Crear nueva categoría
    //Regresa la nueva categoría
    //req.usuario._id -> id de la persona que está ejecutando la petición
    
});


app.put('/categoria/:id', (req, resp) => {

    //Actualiza una categoría por ID
    
});

app.delete('/categoria/:id', (req, resp) => {

    //Solo un admin puede borrar categorías
    //Validar token
    //Delete físico
    //Categoria.findByIDAndRemove()
    
    
});



module.exports = app;