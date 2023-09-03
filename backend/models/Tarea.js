const mongoose = require('mongoose');

const tareaSchema = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true,
    },
    titulo: {
        type: String,
        required: true,
    },
    descripcion: {
        type: String,
    },
    fechaCreacion: {
        type: Date,
        default: Date.now,
    },
    fechaVencimiento: {
        type: Date,
        required: true,
    },
    completada: {
        type: Boolean,
        default: false,
    },
});

module.exports = mongoose.model('Tarea', tareaSchema);
