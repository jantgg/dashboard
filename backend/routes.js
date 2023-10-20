const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const Tarea = require("./models/Tarea");
const Producto = require("./models/Producto");
const Servicio = require("./models/Servicio");
const Cliente = require("./models/Cliente");
const Proveedor = require("./models/Proveedor");
const Venta = require("./models/Venta");
const ServicioProveedor = require("./models/ServicioProveedor");
const Gasto = require("./models/Gasto");
const FacturaCliente = require("./models/FacturaCliente");
const FacturaProveedor = require("./models/FacturaProveedor");
const verifyToken = require("./verifyToken");
const mongoose = require("mongoose");

const router = express.Router();
const fs = require("fs");
const PDFDocument = require("pdfkit");
let doc = new PDFDocument({ size: "A4", margin: 50 });

// ruta protegida
// router.get('/protected', verifyToken, (req, res) => {
//     res.send('Esta es una ruta protegida');
// });
function formatDate(date) {
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();

  day = day < 10 ? "0" + day : day;
  month = month < 10 ? "0" + month : month;

  return `${day}/${month}/${year}`;
}

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

// Obtener todas los productos del usuario autenticado--------------------------------------------------------------------------------------------------------------
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
    const { nombre, stock } = req.body;
    // Buscar si el producto ya existe en la base de datos
    let productoExistente = await Producto.findOne({ nombre: nombre });
    if (productoExistente) {
      // Si el producto ya existe, actualizamos el stock
      productoExistente.vecesComprado =
        Number(productoExistente.vecesComprado || 0) + Number(stock);
      productoExistente.stock = Number(productoExistente.stock) + Number(stock);
      await productoExistente.save();

      return res.status(200).json({
        message: "Producto ya registrado en la base, se ha añadido el stock",
        producto: productoExistente,
      });
    }
    // Si el producto no existe, creamos uno nuevo
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
      return res.status(404).json({ message: "producto no encontrado" });
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

// Obtener todas los SERVICIOS PROVEEEDOR del usuario autenticado--------------------------------------------------------------------------------------------------------------
router.get("/servicep", verifyToken, async (req, res) => {
  try {
    const servicio = await ServicioProveedor.find({ usuario: req.userId });
    res.status(200).json(servicio);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error de servidor al obtener las servicios" });
  }
});
// Crear una nuevo SERVICIO PROVEEEDOR--------------------------------------------------------------------------------------------------------------
router.post("/servicep", verifyToken, async (req, res) => {
  try {
    const nuevoServicio = new ServicioProveedor({
      ...req.body,
      usuario: req.userId, // asumiendo que el ID del usuario decodificado se almacena en req.userId
    });
    await nuevoServicio.save();
    res.status(201).json({
      message: "Servicio proveedor creado con éxito",
      servicio: nuevoServicio,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error de servidor al crear el Servicio de proveedor" });
  }
});

// Obtener todas los SERVICIOS del usuario autenticado--------------------------------------------------------------------------------------------------------------
router.get("/service", verifyToken, async (req, res) => {
  try {
    const servicio = await Servicio.find({ usuario: req.userId });
    res.status(200).json(servicio);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error de servidor al obtener las servicios" });
  }
});
// Crear una nuevo SERVICIO--------------------------------------------------------------------------------------------------------------
router.post("/service", verifyToken, async (req, res) => {
  try {
    const nuevoServicio = new Servicio({
      ...req.body,
      usuario: req.userId, // asumiendo que el ID del usuario decodificado se almacena en req.userId
    });
    await nuevoServicio.save();
    res
      .status(201)
      .json({ message: "Servicio creado con éxito", servicio: nuevoServicio });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error de servidor al crear el Servicio" });
  }
});
// Eliminar un SERVICIO --------------------------------------------------------------------------------------------------------------
router.delete("/servicio/:id", verifyToken, async (req, res) => {
  try {
    const servicio = await Servicio.findById(req.params.id);
    if (!servicio) {
      return res.status(404).json({ message: "Servicio no encontrado" });
    }

    if (servicio.usuario.toString() !== req.userId) {
      return res
        .status(403)
        .json({ message: "No tienes permiso para eliminar esta Servicio" });
    }

    await Servicio.findByIdAndRemove(req.params.id);
    res.status(200).json({ message: "Servicio eliminada con éxito" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error de servidor al eliminar la Servicio" });
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

// Obtener todas los GASTOS  del usuario autenticado--------------------------------------------------------------------------------------------------------------
router.get("/expenses", verifyToken, async (req, res) => {
  try {
    const gastos = await Gasto.find({ usuario: req.userId })
                              .populate('proveedor', 'nombre') // Solo traer el campo 'nombre' del modelo Proveedor
                              .exec();

    const gastosConNombreProveedor = gastos.map(gasto => {
      const gastoObj = gasto.toObject();

      gastoObj.nombreProveedor = gasto.proveedor.nombre;
      gastoObj.proveedor = gasto.proveedor._id.toString(); // Asignar solo el valor ID (convertido a string) de proveedor

      return gastoObj;
    });

    res.status(200).json(gastosConNombreProveedor);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error de servidor al obtener los gastos" });
  }
});


// Obtener todas las ventas  del usuario autenticado--------------------------------------------------------------------------------------------------------------
router.get("/sales", verifyToken, async (req, res) => {
  try {
    const ventas = await Venta.find({ usuario: req.userId })
                              .populate('cliente', 'nombre') // Solo traer el campo 'nombre' del modelo Cliente
                              .exec();

    const ventasConNombreCliente = ventas.map(venta => {
      const ventaObj = venta.toObject();

      ventaObj.nombreCliente = venta.cliente.nombre;
      ventaObj.cliente = venta.cliente._id.toString(); // Asignar solo el valor ID (convertido a string) de cliente

      return ventaObj;
    });

    res.status(200).json(ventasConNombreCliente);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error de servidor al obtener las ventas" });
  }
});



// Obtener todas las facturas de cliente  del usuario autenticado--------------------------------------------------------------------------------------------------------------
router.get("/clientbills", verifyToken, async (req, res) => {
  try {
    const facturas = await FacturaCliente.find({ usuario: req.userId });
    res.status(200).json(facturas);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error de servidor al obtener las facturas de clientes",
    });
  }
});
// Obtener todas las facturas de proveedor del usuario autenticado--------------------------------------------------------------------------------------------------------------
router.get("/supplierbills", verifyToken, async (req, res) => {
  try {
    const facturas = await FacturaProveedor.find({ usuario: req.userId });
    res.status(200).json(facturas);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error de servidor al obtener las facturas de proveedores",
    });
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

    // Actualizar stock y vecesVendido para cada producto vendido
    for (let producto of venta.productos) {
      await Producto.findOneAndUpdate(
        { _id: producto._id },
        {
          $inc: {
            stock: -1, // Reducir stock en 1
            vecesVendido: 1, // Incrementar vecesVendido en 1
          },
        }
      );
    }

    // Actualizar vecesVendido para cada servicio vendido
    for (let servicio of venta.servicios) {
      await Servicio.findOneAndUpdate(
        { _id: servicio._id },
        {
          $inc: {
            vecesVendido: 1, // Incrementar vecesVendido en 1
          },
        }
      );
    }

    // Asignar el ID de la factura a la venta
    venta.factura = savedFactura._id;

    // Añadiendo el usuario a la información de venta
    venta.usuario = req.userId;

    // Creando la Venta
    const newVenta = new Venta(venta);
    await newVenta.save();

    res.status(201).json({
      message: "Venta y factura creadas con éxito!",
      facturaId: savedFactura._id,
    });
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

// Crear GASTO y facturas del usuario autenticado---Imitacion de lo que seria transacciones en mongoose-----------------------------------------------------------------------------------------------------------
router.post("/expenses", verifyToken, async (req, res) => {
  let savedFactura = null;
  let createdServicios = []; // Aquí almacenamos los servicios creados para eliminarlos si algo sale mal

  try {
    const { gasto, facturaProveedor } = req.body;

    // Lógica para los servicios
    const serviciosConUsuario = gasto.servicios.map((servicio) => ({
      ...servicio,
      usuario: req.userId,
    }));

    for (const servicio of serviciosConUsuario) {
      let servicioExistente = await ServicioProveedor.findOne({
        nombre: servicio.nombre,
        proveedor: servicio.proveedor,
      });

      if (servicioExistente) {
        servicioExistente.vecesComprado =
          Number(servicioExistente.vecesComprado) + 1;
        await servicioExistente.save();
        createdServicios.push(servicioExistente);
      } else {
        const nuevoServicio = new ServicioProveedor(servicio);
        const savedServicio = await nuevoServicio.save();
        createdServicios.push(savedServicio);
      }
    }

    // Lógica para productos
    for (const producto of gasto.productos) {
      let productoToUpdate = await Producto.findById(producto._id);
      if (productoToUpdate) {
        productoToUpdate.stock = Number(productoToUpdate.stock) + 1; // Disminuimos el stock en 1 por cada gasto.
        productoToUpdate.vecesComprado =
          Number(productoToUpdate.vecesComprado || 0) + 1;
        await productoToUpdate.save();
      } else {
        console.error(`No se encontró el producto con el ID: ${producto._id}`);
      }
    }

    const servicioIds = createdServicios.map((servicio) => servicio._id);
    gasto.servicios = servicioIds;
    facturaProveedor.servicios = servicioIds;

    // Añadiendo el usuario a la información de factura
    facturaProveedor.usuario = req.userId;

    // Creando la facturaProveedor
    const newFacturaProveedor = new FacturaProveedor(facturaProveedor);
    savedFactura = await newFacturaProveedor.save();

    // Asignar el ID de la factura al gasto
    gasto.facturaProveedor = savedFactura._id;

    // Añadiendo el usuario a la información de gasto
    gasto.usuario = req.userId;

    // Creando el gasto
    const newGasto = new Gasto(gasto);
    await newGasto.save();

    res.status(201).json({
      message: "Gasto y factura creadas con éxito!",
      facturaId: savedFactura._id,
    });
  } catch (error) {
    console.error("Error al crear Gasto y Factura:", error);

    // Si hay un error, eliminamos cualquier servicio que se haya creado
    if (createdServicios.length) {
      await ServicioProveedor.deleteMany({
        _id: { $in: createdServicios.map((servicio) => servicio._id) },
      });
      console.error(
        "Servicios eliminados debido a un error al crear el gasto o la factura."
      );
    }

    // Si hay un error y ya se ha creado la FacturaProveedor, la eliminamos
    if (savedFactura) {
      await FacturaProveedor.findByIdAndDelete(savedFactura._id);
      console.error("Factura eliminada debido a un error al crear la venta.");
    }

    res.status(500).json({ message: error.message });
  }
});

// GENERARA PDF -----------------------------------------------------------------------------------------------------------------------------------------------
router.get("/generatePDF/:facturaId", verifyToken, async (req, res) => {
  try {
    const facturaId = req.params.facturaId;
    const facturaCliente = await FacturaCliente.findById(facturaId).populate([
      "productos",
      "cliente",
      "servicios",
    ]);

    if (!facturaCliente) {
      return res.status(404).json({ message: "Factura no encontrada" });
    }

    if (facturaCliente.usuario.toString() !== req.userId) {
      return res
        .status(403)
        .json({ message: "No tienes permiso para acceder a esta factura" });
    }

    const PDFDocument = require("pdfkit");
    const doc = new PDFDocument();

    doc
      .fontSize(20)
      .text("Factura Cliente", { align: "center", underline: true })
      .moveDown(1);

    doc.fontSize(14);
    const startX = 50;
    doc.text(`Número de Factura: ${facturaCliente.numeroFactura}`, startX);
    doc.text(
      `Fecha de Emisión: ${new Date(
        facturaCliente.fechaEmision
      ).toLocaleDateString()}`,
      startX
    );
    doc.text(
      `Fecha de Operación: ${new Date(
        facturaCliente.fechaOperacion
      ).toLocaleDateString()}`,
      startX
    );
    doc.moveDown(2);

    const startX1 = 50;
    const startX2 = 300;
    const lineHeight = 20;

    // Guardamos la posición actual en el eje Y para usarla en ambos grupos
    let initialY = doc.y;
    let yCliente = initialY;
    let yEmisor = initialY;

    // Datos del Cliente
    doc.text(`Cliente: ${facturaCliente.cliente.nombre}`, startX1, yCliente);
    yCliente += lineHeight;

    doc.text(`NIF/NIE/CIF: ${facturaCliente.cliente.cif}`, startX1, yCliente);
    yCliente += lineHeight;

    doc.text(
      `Direccion: ${facturaCliente.cliente.direccion}`,
      startX1,
      yCliente
    );
    yCliente += lineHeight;

    // Datos del Emisor usando el y inicial
    doc.text(`Emisor: Negocio`, startX2, yEmisor);
    yEmisor += lineHeight;

    doc.text(`NIF/NIE/CIF: 234345345`, startX2, yEmisor);
    yEmisor += lineHeight;

    doc.text(`Direccion: C. Pacoland`, startX2, yEmisor);

    doc.moveDown(2);
    let startY = doc.y;

    const columns = [
      { title: "Producto", width: 150 },
      { title: "N/u", width: 150 },
      { title: "Precio con IVA", width: 150 },
    ];

    // Dibujar encabezados de la tabla
    let x = 50;
    columns.forEach((column) => {
      doc.text(column.title, x, startY);
      x += column.width;
    });

    // Línea horizontal después de encabezados
    doc
      .moveTo(50, startY + 20)
      .lineTo(x, startY + 20)
      .stroke();

    // Dibujar contenido de la tabla desde facturaCliente.productos
    startY += 30; // Mover abajo para empezar a dibujar los datos
    facturaCliente.productos.forEach((producto) => {
      let x = 50;
      doc.text(producto.nombre, x, startY);
      x += columns[0].width;

      doc.text(producto.numeroSerie, x, startY);
      x += columns[1].width;

      doc.text(`${producto.precioVenta} €`, x, startY);
      x += columns[2].width;

      startY += 15;
    });

    // Línea horizontal
    doc
      .moveTo(50, startY + 10)
      .lineTo(x, startY + 10)
      .stroke();

    startY += 25; // Mover abajo para empezar a dibujar los datos

    // Crear un objeto para contar las unidades de cada servicio
    let serviceCounts = {};
    facturaCliente.servicios.forEach((servicio) => {
      if (!serviceCounts[servicio.nombre]) {
        serviceCounts[servicio.nombre] = {
          count: 0,
          precioVenta: servicio.precioVenta,
        };
      }
      serviceCounts[servicio.nombre].count++;
    });

    // Ahora, dibuja cada servicio con su cuenta en el PDF
    Object.keys(serviceCounts).forEach((serviceName) => {
      let x = 50;
      doc.text(serviceName, x, startY);
      x += columns[0].width;

      doc.text(serviceCounts[serviceName].count.toString(), x, startY);
      x += columns[1].width;

      doc.text(`${serviceCounts[serviceName].precioVenta} €`, x, startY);
      x += columns[2].width;

      startY += 5;
    });

    // Dibujar contenido de la tabla desde facturaCliente.servicios
    startY += 15; // Mover abajo para empezar a dibujar los datos

    let x4 = 50;
    doc.text(facturaCliente.servicio, x4, startY);
    x4 += columns[0].width;
    doc.text(facturaCliente.servicio.numeroSerie, x4, startY);
    x4 += columns[1].width;
    doc.text(`${facturaCliente.valorServicio} €`, x4, startY);
    x4 += columns[2].width;
    startY += 20;

    // Línea horizontal al final de la tabla
    doc.moveTo(50, startY).lineTo(x, startY).stroke();
    doc.moveDown(2);

    const leftColumnX = 300; // Ajusta este valor según tu necesidad
    const rightColumnX = 400;

    // Bruto
    let currentY = doc.y;
    doc.text("Bruto:", leftColumnX, currentY);
    doc.text(`${facturaCliente.cantidadBruta} €`, rightColumnX, currentY);

    // Avanza a la siguiente línea
    doc.moveDown(0.5);
    currentY = doc.y;

    // IVA
    doc.text(`IVA (${facturaCliente.iva}%):`, leftColumnX, currentY);
    doc.text(
      `${(facturaCliente.cantidadNeta * (facturaCliente.iva / 100)).toFixed(
        2
      )} €`,
      rightColumnX,
      currentY
    );

    // Avanza a la siguiente línea
    doc.moveDown(0.5);
    currentY = doc.y;

    // Total`${producto.precioVenta} €`
    doc.text("Total:", leftColumnX, currentY);
    doc.text(`${facturaCliente.cantidadNeta} €`, rightColumnX, currentY);

    doc.pipe(res); // Enviar el PDF como respuesta
    doc.end();
  } catch (error) {
    console.error("Error generando el PDF:", error);
    res.status(500).json({
      message: "Error de servidor al generar el PDF",
      error: error.message,
    });
  }
});
// GENERARA PDF PROVEEDOR -----------------------------------------------------------------------------------------------------------------------------------------------
router.get("/generatePDFP/:facturaId", verifyToken, async (req, res) => {
  try {
    const facturaId = req.params.facturaId;
    const facturaProveedor = await FacturaProveedor.findById(
      facturaId
    ).populate(["productos", "proveedor", "servicios"]);

    if (!facturaProveedor) {
      return res.status(404).json({ message: "Factura no encontrada" });
    }

    if (facturaProveedor.usuario.toString() !== req.userId) {
      return res
        .status(403)
        .json({ message: "No tienes permiso para acceder a esta factura" });
    }

    const PDFDocument = require("pdfkit");
    const doc = new PDFDocument();

    doc
      .fontSize(20)
      .text("Factura Proveedor", { align: "center", underline: true })
      .moveDown(1);

    doc.fontSize(14);
    const startX = 50;
    doc.text(`Número de Factura: ${facturaProveedor.numeroFactura}`, startX);
    doc.text(
      `Fecha de Emisión: ${new Date(
        facturaProveedor.fechaEmision
      ).toLocaleDateString()}`,
      startX
    );
    doc.text(
      `Fecha de Operación: ${new Date(
        facturaProveedor.fechaOperacion
      ).toLocaleDateString()}`,
      startX
    );
    doc.moveDown(2);

    const startX1 = 50;
    const startX2 = 300;
    const lineHeight = 20;

    // Guardamos la posición actual en el eje Y para usarla en ambos grupos
    let initialY = doc.y;
    let yProveedor = initialY;
    let yReceptor = initialY;

    // Datos del Proveedor
    doc.text(
      `Proveedor: ${facturaProveedor.proveedor.nombre}`,
      startX1,
      yProveedor
    );
    yProveedor += lineHeight;

    doc.text(
      `NIF/NIE/CIF: ${facturaProveedor.proveedor.cif}`,
      startX1,
      yProveedor
    );
    yProveedor += lineHeight;

    doc.text(
      `Direccion: ${facturaProveedor.proveedor.direccion}`,
      startX1,
      yProveedor
    );
    yProveedor += lineHeight;

    // Datos del Receptor usando el y inicial
    doc.text(`Receptor: Negocio`, startX2, yReceptor);
    yReceptor += lineHeight;

    doc.text(`NIF/NIE/CIF: 234345345`, startX2, yReceptor);
    yReceptor += lineHeight;

    doc.text(`Direccion: C. Pacoland`, startX2, yReceptor);

    doc.moveDown(2);
    let startY = doc.y;

    const columns = [
      { title: "Producto", width: 150 },
      { title: "N/u", width: 150 },
      { title: "Precio con IVA", width: 150 },
    ];

    // Dibujar encabezados de la tabla
    let x = 50;
    columns.forEach((column) => {
      doc.text(column.title, x, startY);
      x += column.width;
    });

    // Línea horizontal después de encabezados
    doc
      .moveTo(50, startY + 20)
      .lineTo(x, startY + 20)
      .stroke();

    // Dibujar contenido de la tabla desde facturaProveedor.productos
    startY += 30; // Mover abajo para empezar a dibujar los datos
    facturaProveedor.productos.forEach((producto) => {
      let x = 50;
      doc.text(producto.nombre, x, startY);
      x += columns[0].width;

      doc.text(producto.numeroSerie, x, startY);
      x += columns[1].width;

      doc.text(`${producto.precioVenta} €`, x, startY);
      x += columns[2].width;

      startY += 15;
    });

    // Línea horizontal
    doc
      .moveTo(50, startY + 10)
      .lineTo(x, startY + 10)
      .stroke();

    startY += 25; // Mover abajo para empezar a dibujar los datos

    // Crear un objeto para contar las unidades de cada servicio
    let serviceCounts = {};
    facturaProveedor.servicios.forEach((servicio) => {
      if (!serviceCounts[servicio.nombre]) {
        serviceCounts[servicio.nombre] = {
          count: 0,
          precioCompra: servicio.precioCompra,
        };
      }
      serviceCounts[servicio.nombre].count++;
    });

    // Ahora, dibuja cada servicio con su cuenta en el PDF
    Object.keys(serviceCounts).forEach((serviceName) => {
      let x = 50;
      doc.text(serviceName, x, startY);
      x += columns[0].width;

      doc.text(serviceCounts[serviceName].count.toString(), x, startY);
      x += columns[1].width;

      doc.text(`${serviceCounts[serviceName].precioCompra} €`, x, startY);
      x += columns[2].width;

      startY += 5;
    });

    // Línea horizontal al final de la tabla
    doc.moveTo(50, startY).lineTo(x, startY).stroke();
    doc.moveDown(2);

    const leftColumnX = 300; // Ajusta este valor según tu necesidad
    const rightColumnX = 400;

    // Bruto
    let currentY = doc.y;
    doc.text("Bruto:", leftColumnX, currentY);
    doc.text(`${facturaProveedor.cantidadBruta} €`, rightColumnX, currentY);

    // Avanza a la siguiente línea
    doc.moveDown(0.5);
    currentY = doc.y;

    // IVA
    doc.text(`IVA (${facturaProveedor.iva}%):`, leftColumnX, currentY);
    doc.text(
      `${(facturaProveedor.cantidadNeta * (facturaProveedor.iva / 100)).toFixed(
        2
      )} €`,
      rightColumnX,
      currentY
    );

    // Avanza a la siguiente línea
    doc.moveDown(0.5);
    currentY = doc.y;

    // Total`${producto.precioVenta} €`
    doc.text("Total:", leftColumnX, currentY);
    doc.text(`${facturaProveedor.cantidadNeta} €`, rightColumnX, currentY);

    doc.pipe(res); // Enviar el PDF como respuesta
    doc.end();
  } catch (error) {
    console.error("Error generando el PDF:", error);
    res.status(500).json({
      message: "Error de servidor al generar el PDF",
      error: error.message,
    });
  }
});

module.exports = router;
