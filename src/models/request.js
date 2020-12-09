const mongoose = require('mongoose');
const path = require('path');
const { stringify } = require('querystring');
const { Schema } = mongoose;

const RequestSchema = new Schema({
    finca: { type: String, required: true },
    valor: { type: Number, required: true },
    total: { type: Number, required: true },
    fecha_alq: { type: Date, required: true },
    tipo: { type: String, required: true},
    machine: { type: String },
    owner: { type: String },
    user: { type: String },
    area: { type: Number, required: true},
    arar: { type: Boolean, default: false},
    rastrillar: { type: Boolean, default: false},
    fumigar: { type: Boolean, default: false},
    nivelar: { type: Boolean, default: false},
    sembrar: { type: Boolean, default: false},
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Request', RequestSchema)