const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true,
    },
    nombre: {
        type: String,
        required: true,
    },
    descripcion: {
        type: String,
    },
    precioCompra: {
        type: Number,
        required: true,
    },
    precioVenta: {
        type: Number,
        required: true,
    },
    iva: {
        type: Number,
        required: true,
    },
    numeroSerie: {
        type: String,
    },
    stock: {
        type: Number,
        required: true,
    },
});

module.exports = mongoose.model('Producto', productoSchema);
