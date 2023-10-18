const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true,
    },
    proveedor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Proveedor',
        required: false,
    },
    nombre: {
        type: String,
        required: true,
        unique: true,
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
    vecesVendido:{
        type: Number, 
         default: 0,
    },
    vecesComprado:{
        type:Number,
         default: 0,
    }
});

module.exports = mongoose.model('Producto', productoSchema);
