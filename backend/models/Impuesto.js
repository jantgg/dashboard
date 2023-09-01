const mongoose = require('mongoose');

const impuestoSchema = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    irpf: {
        type: Number,
        required: true
    },
    iva: {
        type: Number,
        required: true
    },
    retenciones: {
        type: Number,
        required: true
    },
    css: {
        type: Number,
        required: true
    },
    iae: {
        type: Number,
        required: true
    },
    fechaInicio: {
        type: Date,
        required: true
    },
    fechaFin: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('Impuesto', impuestoSchema);
