const mongoose = require('mongoose');

const gastoSchema = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    tipo: {
        type: String,
        enum: ['proveedor', 'gasto fijo'],
        required: true
    },
    fecha: {
        type: Date,
        required: true
    },
    cantidadNeta: {
        type: Number,
        required: true
    },
    iva: {
        type: Number,
        required: true
    },
    cantidadBruta: {
        type: Number,
        required: true
    },
    detalles: {
        type: String,
        required: true
    },
    productos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Producto'
    }],
    proveedor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Proveedor',
        required: true
    },
    facturaProveedor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FacturaProveedor',
        required: true
    }
});

module.exports = mongoose.model('Gasto', gastoSchema);
