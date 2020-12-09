const mongoose = require('mongoose');
const path = require('path');
const { stringify } = require('querystring');
const { Schema } = mongoose;

const MachineSchema = new Schema({
    tipo: { type: String, required: true },
    ubicacion: { type: String, required: true },
    valor: { type: Number, required: true },
    arar: { type: Boolean, default: false},
    rastrillar: { type: Boolean, default: false},
    fumigar: { type: Boolean, default: false},
    nivelar: { type: Boolean, default: false},
    sembrar: { type: Boolean, default: false},
    date: { type: Date, default: Date.now },
    estado: { type: Boolean, default: true },
    user: { type: String },
    rutaImage: {
        type: String,
        default: path.join(__dirname, '../public/uploads/tractor_default.jpg')
    }
});

module.exports = mongoose.model('Machine', MachineSchema)