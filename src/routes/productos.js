const router = require('express').Router();
const { restart } = require('nodemon');
const Producto = require('../models/Producto');
const fs = require('fs-extra'); //Mdoulo para mover la imgen 
const { isAuthenticated } = require('../helpers/auth'); //Sirve para proteger las rutas
const path = require('path');

router.get('/productos',(req,res) =>{
    res.render('productos/all-product');
})

router.get('/productos/agregar',(req,res) =>{
    res.render('productos/new-product');
})
//Ruta para agregar los productos
router.post('/productos/new', async (req,res) =>{
    const { nombre,descripcion,modelo,precio,cantidad,nombre_prov,direccion_prov,email_prov,telefono_prov,nombre_cat,descripcion_cat } = req.body;
    //Nombre de la imagen
    const imagen = Date.now() + "_" + req.file.originalname;
    const guardarImagen = async() => {
        const filePatch = req.file.path;
        const targetPath = path.resolve(`src/public/upload/${imagen}`);
        await fs.rename(filePatch, targetPath); 
    }
    //Guarda la imagen
    guardarImagen();
    
    const newProduct = new Producto({
        nombre,
        descripcion,
        modelo,
        precio,
        cantidad,
        imagen : imagen,
        "proveedor":{
            "nombre": nombre_prov,
            "direccion": direccion_prov,
            "email": email_prov,
            "telefono": telefono_prov
        },
        "categoria": {
            "nombre": nombre_cat,
            "descripcion": descripcion_cat,
            
        }
    });
    await newProduct.save();
    res.redirect('/productos');
    
})

//Ejemplos para hacer las partes del CRUD
/*
router.get('/notes', isAuthenticated, async (req,res) =>{
    const notes = await Note.find({user: req.user.id}).lean().sort({date: -1});
    res.render('notes/all-notes',{ notes });
})

router.get('/notes/edit/:id', isAuthenticated, async (req,res) =>{
    const note = await Note.findById(req.params.id).lean();
    res.render('notes/edit-note',{ note });
})

router.put('/notes/edit-note/:id', isAuthenticated, async (req,res) =>{
    const {title,description} = req.body
    await Note.findByIdAndUpdate({_id: req.params.id},{title,description});
    req.flash('success_msg', 'Nota actualizada');
    res.redirect('/notes');
})

router.delete('/notes/delete/:id', isAuthenticated, async (req,res) =>{
    await Note.findByIdAndDelete({_id: req.params.id});
    req.flash('success_msg', 'Nota eliminada!!');
    res.redirect('/notes');
})


*/
module.exports = router
