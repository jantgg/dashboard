const mongoose = require('mongoose');

const proveedorSchema = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    nombre: {
        type: String,
        required: true,
    },
    cif: {
        type: String,
        required: true,
        unique: true,
    },
    direccion: {
        type: String,
        required: true,
    },
    telefono: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    gastos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Gasto',
    }],
});

module.exports = mongoose.model('Proveedor', proveedorSchema);
