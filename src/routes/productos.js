const router = require('express').Router();

const { restart } = require('nodemon');
const Producto = require('../models/Producto');

const { isAuthenticated } = require('../helpers/auth');

router.get('/productos',(req,res) =>{
    res.render('productos/all-product');
})

router.get('/productos/agregar',(req,res) =>{
    res.render('productos/new-product');
})

router.post('/productos/new', async (req,res) =>{
    const { nombre,descripcion,modelo,precio,imagen,nombre_prov,direccion_prov,email_prov,telefono_prov,nombre_cat,descripcion_cat,imagen_cat } = req.body;

    const newProduct = new Producto({
        nombre,
        descripcion,
        modelo,
        precio,
        imagen,
        "proveedor":{
            "nombre": nombre_prov,
            "direccion": direccion_prov,
            "email": email_prov,
            "telefono": telefono_prov
        },
        "categoria": {
            "nombre": nombre_cat,
            "descripcion": descripcion_cat,
            "imagen": imagen_cat
        }
    });
    await newProduct.save();
    res.redirect('/productos');
})

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


module.exports = router