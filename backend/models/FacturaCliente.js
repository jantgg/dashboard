const mongoose = require("mongoose");

const facturaClienteSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
  cliente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cliente",
    required: true,
  },
  numeroFactura: {
    type: String,
    required: true,
  },
  fechaEmision: {
    type: Date,
    required: true,
  },
  fechaOperacion: {
    type: Date,
    required: true,
  },
  cantidadBruta: {
    type: Number,
    required: true,
  },
  iva: {
    type: Number,
    required: true,
  },
  cantidadNeta: {
    type: Number,
    required: true,
  },
  detalles: {
    type: String,
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
      ref: "Servicio",
    },
  ],
  pdfFactura: {
    type: String,
  },
  estado: {
    type: String,
    enum: ["pagada", "pendiente", "vencida"],
    required: true,
  },
  cuotaTributaria: {
    type: Number,
  },
  servicio: {
    type: String,
  },
  valorServicio: {
    type: Number,
  },
});

module.exports = mongoose.model("FacturaCliente", facturaClienteSchema);
