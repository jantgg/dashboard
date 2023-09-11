const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const Tarea = require("./models/Tarea");
const Producto = require("./models/Producto");
const Cliente = require("./models/Cliente");
const Proveedor = require("./models/Proveedor");
const Venta = require("./models/Venta");
const verifyToken = require("./verifyToken");
const FacturaCliente = require("./models/FacturaCliente");
const router = express.Router();
const PDFDocument = require("pdfkit");
const fs = require("fs");

// ruta protegida
// router.get('/protected', verifyToken, (req, res) => {
//     res.send('Esta es una ruta protegida');
// });

// Login de usuario -----------------------------------------------------------------------------------------------------
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  // Validación de entrada
  if (!email || !password) {
    return res.status(400).json({
      message: "Por favor, introduzca su correo electrónico y contraseña.",
    });
  }
  try {
    // Comprueba si el usuario existe
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Correo electrónico no registrado." });
    }
    // Comprueba si la contraseña es correcta
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: "Contraseña incorrecta." });
    }
    // Creación de token de autenticación
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ message: "Inicio de sesión exitoso", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error de servidor" });
  }
});

// Crear una nueva tarea--------------------------------------------------------------------------------------------------------------
router.post("/tarea", verifyToken, async (req, res) => {
  try {
    const nuevaTarea = new Tarea({
      ...req.body,
      usuario: req.userId, // asumiendo que el ID del usuario decodificado se almacena en req.userId
    });
    await nuevaTarea.save();
    res
      .status(201)
      .json({ message: "Tarea creada con éxito", tarea: nuevaTarea });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error de servidor al crear la tarea" });
  }
});

// Obtener todas las tareas del usuario autenticado--------------------------------------------------------------------------------------------------------------
router.get("/tarea", verifyToken, async (req, res) => {
  try {
    const tareas = await Tarea.find({ usuario: req.userId });
    res.status(200).json(tareas);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error de servidor al obtener las tareas" });
  }
});

// Actualizar una tarea (deberías verificar si la tarea pertenece al usuario autenticado)--------------------------------------------------------------------------------------------------------------
router.put("/tarea/:id", verifyToken, async (req, res) => {
  try {
    const tarea = await Tarea.findById(req.params.id);
    if (!tarea) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }

    if (tarea.usuario.toString() !== req.userId) {
      return res
        .status(403)
        .json({ message: "No tienes permiso para modificar esta tarea" });
    }

    tarea.completada = req.body.completada;
    await tarea.save();

    res.status(200).json({ message: "Tarea actualizada con éxito", tarea });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error de servidor al actualizar la tarea" });
  }
});

// Eliminar una tarea --------------------------------------------------------------------------------------------------------------
router.delete("/tarea/:id", verifyToken, async (req, res) => {
  try {
    const tarea = await Tarea.findById(req.params.id);
    if (!tarea) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }

    if (tarea.usuario.toString() !== req.userId) {
      return res
        .status(403)
        .json({ message: "No tienes permiso para eliminar esta tarea" });
    }

    await Tarea.findByIdAndRemove(req.params.id);
    res.status(200).json({ message: "Tarea eliminada con éxito" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error de servidor al eliminar la tarea" });
  }
});
// Obtener todas las productos del usuario autenticado--------------------------------------------------------------------------------------------------------------
router.get("/product", verifyToken, async (req, res) => {
  try {
    const producto = await Producto.find({ usuario: req.userId });
    res.status(200).json(producto);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error de servidor al obtener las productos" });
  }
});
// Crear una nuevo Producto--------------------------------------------------------------------------------------------------------------
router.post("/product", verifyToken, async (req, res) => {
  try {
    const nuevoProducto = new Producto({
      ...req.body,
      usuario: req.userId, // asumiendo que el ID del usuario decodificado se almacena en req.userId
    });
    await nuevoProducto.save();
    res
      .status(201)
      .json({ message: "Producto creado con éxito", producto: nuevoProducto });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error de servidor al crear el producto" });
  }
});
// Eliminar un producto --------------------------------------------------------------------------------------------------------------
router.delete("/product/:id", verifyToken, async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);
    if (!producto) {
      return res.status(404).json({ message: "producto no encontrada" });
    }

    if (producto.usuario.toString() !== req.userId) {
      return res
        .status(403)
        .json({ message: "No tienes permiso para eliminar esta producto" });
    }

    await Producto.findByIdAndRemove(req.params.id);
    res.status(200).json({ message: "producto eliminada con éxito" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error de servidor al eliminar la producto" });
  }
});

// Obtener todas los clientes del usuario autenticado--------------------------------------------------------------------------------------------------------------
router.get("/clients", verifyToken, async (req, res) => {
  try {
    const client = await Cliente.find({ usuario: req.userId });
    res.status(200).json(client);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error de servidor al obtener los clientes" });
  }
});
// Crear una nuevo Cliente--------------------------------------------------------------------------------------------------------------
router.post("/clients", verifyToken, async (req, res) => {
  try {
    const nuevoCliente = new Cliente({
      ...req.body,
      usuario: req.userId, // asumiendo que el ID del usuario decodificado se almacena en req.userId
    });
    await nuevoCliente.save();
    res
      .status(201)
      .json({ message: "Cliente creado con éxito", Cliente: nuevoCliente });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error de servidor al crear el Cliente" });
  }
});
// Eliminar un cliente --------------------------------------------------------------------------------------------------------------
router.delete("/clients/:id", verifyToken, async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.params.id);
    if (!cliente) {
      return res.status(404).json({ message: "cliente no encontrada" });
    }

    if (cliente.usuario.toString() !== req.userId) {
      return res
        .status(403)
        .json({ message: "No tienes permiso para eliminar esta cliente" });
    }

    await Cliente.findByIdAndRemove(req.params.id);
    res.status(200).json({ message: "cliente eliminada con éxito" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error de servidor al eliminar la cliente" });
  }
});
// Obtener todas los proveedor  del usuario autenticado--------------------------------------------------------------------------------------------------------------
router.get("/suppliers", verifyToken, async (req, res) => {
  try {
    const proveedor = await Proveedor.find({ usuario: req.userId });
    res.status(200).json(proveedor);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error de servidor al obtener los proveedores" });
  }
});
// Crear una nuevo proveedor --------------------------------------------------------------------------------------------------------------
router.post("/suppliers", verifyToken, async (req, res) => {
  try {
    const nuevoProveedor = new Proveedor({
      ...req.body,
      usuario: req.userId, // asumiendo que el ID del usuario decodificado se almacena en req.userId
    });
    await nuevoProveedor.save();
    res.status(201).json({
      message: "Proveedor creado con éxito",
      Proveedor: nuevoProveedor,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error de servidor al crear el Proveedor" });
  }
});
// Eliminar un proveedor  --------------------------------------------------------------------------------------------------------------
router.delete("/suppliers/:id", verifyToken, async (req, res) => {
  try {
    const proveedor = await Proveedor.findById(req.params.id);
    if (!proveedor) {
      return res.status(404).json({ message: "proveedor no encontrada" });
    }
    if (proveedor.usuario.toString() !== req.userId) {
      return res
        .status(403)
        .json({ message: "No tienes permiso para eliminar esta proveedor" });
    }
    await Proveedor.findByIdAndRemove(req.params.id);
    res.status(200).json({ message: "proveedor eliminada con éxito" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error de servidor al eliminar la proveedor" });
  }
});

// Obtener todas las ventas  del usuario autenticado--------------------------------------------------------------------------------------------------------------
router.get("/sales", verifyToken, async (req, res) => {
  try {
    const ventas = await Venta.find({ usuario: req.userId });
    res.status(200).json(ventas);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error de servidor al obtener las ventas" });
  }
});

// Obtener todas las facturas  del usuario autenticado--------------------------------------------------------------------------------------------------------------
router.get("/clientbills", verifyToken, async (req, res) => {
  try {
    const facturas = await FacturaCliente.find({ usuario: req.userId });
    res.status(200).json(facturas);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error de servidor al obtener las facturas" });
  }
});

// Crear Venta y facturas del usuario autenticado---Imitacion de lo que seria transacciones en mongoose-----------------------------------------------------------------------------------------------------------
router.post("/sales", verifyToken, async (req, res) => {
  let savedFactura = null; // Declaramos fuera del try para poder acceder en el catch

  try {
    const { venta, facturaCliente } = req.body;

    // Añadiendo el usuario a la información de factura
    facturaCliente.usuario = req.userId;

    // Creando la FacturaCliente
    const newFacturaCliente = new FacturaCliente(facturaCliente);
    savedFactura = await newFacturaCliente.save();

    // Asignar el ID de la factura a la venta
    venta.factura = savedFactura._id;

    // Añadiendo el usuario a la información de venta
    venta.usuario = req.userId;

    // Creando la Venta
    const newVenta = new Venta(venta);
    await newVenta.save();

    res.status(201).json({ message: "Venta y factura creadas con éxito!" });
  } catch (error) {
    console.error("Error al crear Venta y Factura:", error);

    // Si hay un error y ya se ha creado la FacturaCliente, la eliminamos
    if (savedFactura) {
      await FacturaCliente.findByIdAndDelete(savedFactura._id);
      console.error("Factura eliminada debido a un error al crear la venta.");
    }
    res.status(500).json({ message: error.message });
  }
});

//GENERAR PDF -----------------------------------------------------------------------------------------------------
router.get("/generatePDF/:facturaId", verifyToken, async (req, res) => {
  try {
      const facturaId = req.params.facturaId;
      const facturaCliente = await FacturaCliente.findById(facturaId);

      if (!facturaCliente) {
          return res.status(404).json({ message: "Factura no encontrada" });
      }

      // Usando PDFKit para generar el PDF
      const doc = new PDFDocument();

      // Configuraciones generales
      doc.fontSize(20);
      doc.text("Factura Cliente", {
          align: 'center',
          underline: true
      });

      // Espacio entre secciones
      doc.moveDown(2);
      
      doc.fontSize(14);
      doc.text(`Número de Factura: ${facturaCliente.numeroFactura}`);
      doc.moveDown(0.5);
      doc.text(`Fecha de Emisión: ${facturaCliente.fechaEmision}`);
      doc.moveDown(0.5);
      doc.text(`Fecha de Operación: ${facturaCliente.fechaOperacion}`);
      doc.moveDown(0.5);
      doc.text(`Cantidad Neta: ${facturaCliente.cantidadNeta}`);
      doc.moveDown(0.5);

      // Puedes seguir añadiendo más campos de la factura de la misma forma.

      doc.pipe(res); // Enviar directamente el PDF como respuesta
      doc.end();

  } catch (error) {
      console.error("Error generando el PDF:", error);
      res.status(500).json({ message: "Error de servidor al generar el PDF" });
  }
});


module.exports = router;
