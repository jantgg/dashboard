const mongoose = require('mongoose');

const clienteSchema = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true,
    },
    nombre: {
        type: String,
        required: true,
    },
    cif: {
        type: String,
        required: true,
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
    },
    fechaRegistro:{
        type: String,
        required: true,
    },
    ventas: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Venta',
    }],
});

module.exports = mongoose.model('Cliente', clienteSchema);
