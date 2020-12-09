const router = require('express').Router();
const Machine = require('../models/machine');
const path = require('path');
const multer = require('multer');
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

const { isAuthenticated } = require('../helpers/auth');


router.get('/allmachines/list', isAuthenticated, async(req, res) => {
    const machines = await Machine.find().sort({ date: 'desc' });
    res.render('allMachines/list_allmachines', { machines });
});

router.get('/allmachines/select/:id', isAuthenticated, async(req, res) => {
    const machine = await Machine.findById(req.params.id);
    //console.log(machine)
    res.render('allMachines/select_machine', { machine });
});


module.exports = router;