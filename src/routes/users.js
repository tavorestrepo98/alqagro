const router = require('express').Router();

const User = require('../models/users');

const passport = require('passport');

router.get('/users/signin', (req, res) => {
    const errors = [];
    res.render('users/signin', { errors });
});

router.post('/users/signin', passport.authenticate('local', {
    successRedirect: '/mymachines',
    failureRedirect: '/users/signin',
    failureFlash: true
}));

router.get('/users/signup', (req, res) => {
    const errors = [];
    res.render('users/signup', {
        title: 'Caña Mia',
        errors
    });
});

router.post('/users/signup', async (req, res) => {
    const { name, email, password, confirm_password } = req.body;
    const errors = [];
    if (password != confirm_password) {
        errors.push({text: 'Las contraseñas no coinciden'});
    }
    if (name.length < 8) {
        errors.push({text: 'Ingrese un nombre valido'});
    }
    if (email.length < 8) {
        errors.push({text: 'Ingrese un correo valido'});
    }
    if (password.length < 4) {
        errors.push({text: 'La contraseña debe ser como minimo de 4 caracteres'});
    }
    if (errors.length > 0) {
        res.render('users/signup', {  
            errors, 
            name, 
            email, 
            password, 
            confirm_password
        });
    } else {
        const emailUser = await User.findOne({email: email});
        if (emailUser) {
            req.flash('error_msg', 'Este correo electronico ya está en uso');
            res.redirect('/users/signup');
        } else {
        const newUser = new User({name, email, password});
        newUser.password = await newUser.encryptPassword(password);
        await newUser.save();
        req.flash('success_msg', 'Estás resgistrado!');
        res.redirect('/users/signin');
        }
    }
});

router.get('/users/logout', (req, res) => {
    req.logout();
    res.redirect('/');
})

module.exports = router;