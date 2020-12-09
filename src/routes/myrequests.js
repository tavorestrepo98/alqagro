const router = require('express').Router();
const Machine = require('../models/machine');
const Request = require('../models/request');
const path = require('path');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: path.join(__dirname, '../public/uploads'),
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const { isAuthenticated } = require('../helpers/auth');

router.post('/requests/pay/:id', isAuthenticated, async(req, res) => {
    const machine = await Machine.findById(req.params.id);
    console.log(req.body)
    const detalles = req.body;
    var total = req.body.area * (machine.valor + machine.valor * 0.1);
    //const { tipo, ubicacion, valor, arar, rastrillar, fumigar, nivelar, sembrar} = req.body;}
    res.render('requests/pay', { machine, detalles, total});
});

router.post('/requests/accepted/:id', isAuthenticated, async(req, res) => {
    const machine = await Machine.findById(req.params.id);
    const { finca, area, arar, rastrillar, fumigar, sembrar, nivelar, fecha_alq, total} = req.body;
    console.log(req.body);
    const newRequest = new Request({ finca, total, fecha_alq, area, arar, rastrillar, fumigar, nivelar, sembrar });
    newRequest.valor = machine.valor * area;
    newRequest.machine = machine._id;
    newRequest.user = req.user.id;
    newRequest.tipo = machine.tipo;
    newRequest.owner = machine.user
    await newRequest.save();
    req.flash("success_msg", 'Solicitud realizada exitosamente!');
    //const { tipo, ubicacion, valor, arar, rastrillar, fumigar, nivelar, sembrar} = req.body;}
    res.redirect('/mymachines');
});

router.get('/myrequests', isAuthenticated, async(req, res) => {
    const requests = await Request.find({ user: req.user.id }).sort({ date: 'desc' });
    res.render('requests/requestsDone', { requests });
});

router.get('/myrequestsReceived', isAuthenticated, async(req, res) => {
    const requests = await Request.find({ owner: req.user.id }).sort({ date: 'desc' });
    res.render('requests/requestsReceived', { requests });
});

module.exports = router;