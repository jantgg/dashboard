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
    },
});

module.exports = mongoose.model('Servicio', servicioSchema);