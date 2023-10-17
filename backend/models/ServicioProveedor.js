const mongoose = require('mongoose');

const servicioProveedorSchema = new mongoose.Schema({
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
    iva: {
        type: Number,
        required: true,
    },
    vecesComprado:{
        type: Number, 
    },
    proveedor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Proveedor',
        required: true,
    },
});

module.exports = mongoose.model('ServicioProveedor', servicioProveedorSchema);