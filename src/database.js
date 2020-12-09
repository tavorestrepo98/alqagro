const moongoose = require('mongoose');

const URI = 'mongodb+srv://TavoDB:0000@cluster0.17ahk.mongodb.net/alqagro-db?retryWrites=true&w=majority';


moongoose.connect(URI, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useFindAndModify: false
    })
    .then(db => console.log('DB is connected'))
    .catch(err => console.error(err));