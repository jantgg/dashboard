const mongoose = require("mongoose");

const gastoSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
  fecha: {
    type: Date,
    required: true,
  },
  tipo: {
    type: String,
    enum: ["fijo","proveedor"],
    required: false,
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
  productos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Producto",
    },
  ],
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
  facturaProveedor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FacturaProveedor",
    required: true,
  },
});

module.exports = mongoose.model("Gasto", gastoSchema);
