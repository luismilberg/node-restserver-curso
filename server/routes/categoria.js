const express = require('express');

let { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categoria');
const _ = require('underscore');



app.get('/categoria', [verificaToken], (req, res) => {


    //Opciones de filtrado en el GET
    // let desde = req.query.desde || 0; 
    // desde = Number(desde); 

    // let limite = req.query.limite || 5;
    // limite = Number(limite);

    //Consulta a la BD

    Categoria.find({})
    .sort('descripcion')
        .populate('usuario', 'nombre email') //trae información solicitada del modelo que se ingresa en el primer parámetro
        // .skip(desde)
        // .limit(limite)
        .exec( (err, categorias) => {
            if(err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            
            Categoria.count((err, conteo) => {
                
                res.json({
                    ok: true,
                    categorias,
                    cuantos: conteo
                });
                
            });
    });
    
});

app.get('/categoria/:id', [verificaToken], (req, res) => {

    let id = req.params.id;

    Categoria.findById(id)
        .exec((err, categoriaDB) => {
            if(err){
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if(!categoriaDB){
                return res.status(400).json({
                    ok: false,
                    message: 'El ID no es correcto'
                })
            }
            res.json({
                ok: true,
                categoria
            });
        });
    
});

app.post('/categoria', [verificaToken, verificaAdmin_Role], (req, res) => {

    let body = req.body;
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id  //esto funciona gracias al verificaToken
    });

    categoria.save((err, categoriaDB) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!categoriaDB){
            return res.status(400).json({
                ok: false,
                err
            });
        }
        
        res.json({
            ok:true,
            categoria: categoriaDB
        });

    });
    
});


app.put('/categoria/:id', [verificaToken, verificaAdmin_Role],(req, res) => {

    let id = req.params.id;
    let descripcion = req.body.descripcion;


    Categoria.findByIdAndUpdate(id, {descripcion}, {new: true, runValidators: true}, (err, categoriaDB) => {
        if(err){
            return res.status(500).json({
                ok:false,
                err
            });
        }

        if(!categoriaDB){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });  
});

app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role],(req, res) => {

    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if(!categoriaDB){
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Categoría no encontrada'
                }
            });
        }
        res.json({
            ok:true,
            message: 'Categoria borrada',
            categoria: categoriaDB
        });
    });
    
    
});



module.exports = app;