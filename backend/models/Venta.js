const mongoose = require('mongoose');

const ventaSchema = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true,
    },
    productos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Producto',
    }],
    servicios: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Servicio',
    }],
    cliente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cliente',
        required: true,
    },
    factura: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FacturaCliente',
        required: true,
    },
    fecha: {
        type: Date,
        required: true,
    },
    cantidadNeta: {
        type: Number,
        required: true,
    },
    iva: {
        type: Number,
        required: true,
    },
    cantidadBruta: {
        type: Number,
        required: true,
    },
    detalles: {
        type: String,
    },
});

module.exports = mongoose.model('Venta', ventaSchema);
