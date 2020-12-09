const router = require('express').Router();
const Machine = require('../models/machine');
const path = require('path');
const multer = require('multer');
const cloudinary = require('cloudinary');
const fs = require('fs-extra');

const storage = multer.diskStorage({
    destination: path.join(__dirname, '../public/uploads'),
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upl = multer({
    storage,
    dest: path.join(__dirname, '../public/uploads')
}).single('image');


cloudinary.config({
    cloud_name: 'ddmkquci5',
    api_key: '973274335394783',
    api_secret: 'wXPyL2-2AkKlHUg6V18HODYWM6M'
});

const { isAuthenticated } = require('../helpers/auth');

router.get('/mymachines/add', isAuthenticated, (req, res) => {
    const errors = [];
    res.render('myMachines/new_machine', {
        errors
    });
});

router.post('/mymachines/new_machine', upl, isAuthenticated, async(req, res) => {

    const { tipo, ubicacion, valor, arar, rastrillar, fumigar, nivelar, sembrar } = req.body;
    const errors = [];
    if (!tipo) {
        errors.push({ text: 'Inserte un tipo' });
    }
    if (!ubicacion) {
        errors.push({ text: 'Ingrese una ubicación' });
    }
    if (!valor) {
        errors.push({ text: 'Inserte un valor' })
    }
    if (errors.length > 0) {
        res.render('myMachines/new_machine', {
            errors,
            tipo,
            ubicacion,
            valor
        });
    } else {
        if (req.file) {
            let result = await cloudinary.v2.uploader.upload(req.file.path);
            await fs.unlink(req.file.path);
            //console.log('El resultado es: ', result);
            imagePath = result.url;
            const newMachine = new Machine({ tipo, ubicacion, valor, arar, rastrillar, fumigar, nivelar, sembrar, rutaImage: imagePath });
            //console.log(newMachine);
            newMachine.user = req.user.id;
            await newMachine.save();
            req.flash("success_msg", 'Máquina agregada exitosamente!');
            res.redirect('/mymachines');
        } else {
            //let result = await cloudinary.v2.uploader.upload(req.file.path);
            //console.log('El resultado es: ', result);
            let defaultImage = 'https://res.cloudinary.com/ddmkquci5/image/upload/v1607531685/tractor_default_pobrl2.jpg';
            const newMachine = new Machine({ tipo, ubicacion, valor, arar, rastrillar, fumigar, nivelar, sembrar, rutaImage: defaultImage });
            //console.log(newMachine);
            newMachine.user = req.user.id;
            await newMachine.save();
            await fs.unlink(req.file.path);
            req.flash("success_msg", 'Máquina agregada exitosamente!');
            res.redirect('/mymachines');
        }
    }
});

router.get('/mymachines', isAuthenticated, async(req, res) => {
    const machines = await Machine.find({ user: req.user.id }).sort({ date: 'desc' });
    res.render('myMachines/list_mymachines', { machines });
});

router.get('/mymachines/edit/:id', isAuthenticated, async(req, res) => {
    const machine = await Machine.findById(req.params.id);
    res.render('myMachines/edit_machine', { machine });
})

router.put('/mymachines/edit/:id', isAuthenticated, async(req, res) => {
    const { tipo, ubicacion, valor } = (req.body);
    await Machine.findByIdAndUpdate(req.params.id, { tipo, ubicacion, valor });
    req.flash("success_msg", 'Máquina guardada exitosamente!');
    res.redirect('/mymachines');
})

router.delete('/mymachines/delete/:id', isAuthenticated, async(req, res) => {
    await Machine.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Máquina eliminada exitosamente!');
    res.redirect('/mymachines');
})

module.exports = router;