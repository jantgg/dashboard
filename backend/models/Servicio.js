const mongoose = require('mongoose');

const servicioSchema = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true,
    },
    nombre: {
        type: String,
        required: true,
        unique: true,
    },
    descripcion: {
        type: String,
    },
    precioVenta: {
        type: Number,
        required: true,
    },
    iva: {
        type: Number,
        required: true,
    },
    vecesVendido:{
        type: Number, 
        default: 0,
    },
});

module.exports = mongoose.model('Servicio', servicioSchema);