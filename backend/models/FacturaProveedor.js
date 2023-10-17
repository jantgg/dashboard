const mongoose = require('mongoose');

const facturaProveedorSchema = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    numeroFactura: {
        type: String,
        required: true
    },
    fechaEmision: {
        type: Date,
        required: true
    },
    fechaOperacion: {
        type: Date,
        required: true
    },
    cantidadBruta: {
        type: Number,
        required: true
    },
    iva: {
        type: Number,
        required: true
    },
    cantidadNeta: {
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
    servicios:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ServicioProveedor'
    }],
    pdfFactura: {
        type: String,
    },
    estado: {
        type: String,
        enum: ['pagada', 'pendiente', 'vencida'],
        required: true
    },
    cuotaTributaria: {
        type: Number,
        required: true
    },
    proveedor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Proveedor',
        required: true
    }
});

module.exports = mongoose.model('FacturaProveedor', facturaProveedorSchema);
