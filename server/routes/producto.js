const express = require('express');

const {verificaToken} = require('../middlewares/autenticacion');
const producto = require('../models/producto');
let Producto = require('../models/producto');

let app = express();

// ==============================
// Obtener todos los productos
// ==============================

app.get('/productos', [verificaToken], (req,res) => {
    //trae todos los productos
    // populate: usuario categoria
    // paginado 
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find({disponible: true})
        .skip(desde)
        .limit(limite)
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos)=> {
            if(err){
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            Producto.count((err, conteo) => {
                if(err){
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }
                res.json({
                    ok: true,
                    productos,
                    cuantos: conteo
                });
            });
        });

});

// ==============================
// Obtener un producto por ID
// ==============================

app.get('/productos/:id', [verificaToken], (req,res) => {
    //traeo todos los productos
    // populate: usuario categoria
    let id = req.params.id;
    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .exec((err, productoDB) => {
            if(err){
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if(!productoDB){
                return res.status(400).json({
                    ok: false,
                    error:{
                        message: 'Producto no encontrado'
                    }
                });
            }
            res.json({
                ok: true,
                productoDB
            });
        });


});

// ==============================
// Crear un nuevo producto
// ==============================

app.post('/productos/', [verificaToken], (req,res) => {
    // grabar el usuario
    // grabar una categoria del listado

    let {nombre, precioUni, descripcion, disponible, categoria} = req.body;

    let producto = new Producto({
        nombre,
        precioUni,
        descripcion,
        disponible,
        categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }
        res.status(201).json({
            ok: true,
            producto: productoDB
        });
    });

});

// ==============================
// Actualizar un producto
// ==============================

app.put('/productos/:id', [verificaToken], (req,res) => {
    // grabar el usuario
    // grabar una categoria del listado
    let id = req.params.id;
    let {nombre, precioUni, descripcion, disponible, categoria} = req.body;
    let productoDatos = {
        nombre, 
        precioUni, 
        descripcion, 
        disponible, 
        categoria,
        usuario: req.usuario._id
    }

    producto.findByIdAndUpdate(id, productoDatos, {new: true, runValidators: true}, (err, productoDB) => {

        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!productoDB){
            return res.status(400).json({
                ok: false,
                message: 'Producto no encontrado'
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });

    });


});

// ==============================
// Borrar un producto
// ==============================

app.delete('/productos/:id', [verificaToken], (req,res) => {
    // grabar el usuario
    // disponible = false
    // mensaje de salida 'El producto ha sido deshabilitado / borrado'

    let id = req.params.id;

    let cambioEstado = {
        disponible: false,
        usuario: req.usuario._id
    }

    producto.findByIdAndUpdate(id, cambioEstado, {new: true}, (err, productoDB) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!productoDB){
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Producto no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            producto: productoDB,
            message: 'El producto fue removido exitosamente'
        });
    })


});

// ==============================
// Buscar productos
// ==============================

app.get('/productos/buscar/:termino', [verificaToken], (req, res) => {

    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i')

    Producto.find({nombre: regex})
        .populate('categoria', 'nombre')
        .exec((err, productos) => {
            if(err){
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                productos
            });
        });


});


module.exports = app;