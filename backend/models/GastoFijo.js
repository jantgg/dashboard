const mongoose = require("mongoose");

const gastoFijoSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
  tipo: {
    type: String,
    enum: [
      "luz",
      "agua",
      "gas",
      "alquiler",
      "hipoteca",
      "internet",
      "telefonia",
      "Seguros",
      "Salarios fijos",
      "limpieza",
      "tasas municipales",
      "publicidad",
      "intereses",
      "transportes",
      "seguridad",
    ],
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
    required: false,
  },
  servicios: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServicioProveedor",
    },
  ],
  proveedor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Proveedor",
    required: true,
  },
});

module.exports = mongoose.model("Gasto", gastoFijoSchema);
