"use client";
import React, { useState, useEffect, useRef } from "react";
import "./crearVenta.css";
import { Toaster, toast } from "sonner";
import useVentas from "../hooks/useVentas";
import useClientes from "../hooks/useClientes";
import useProductos from "../hooks/useProductos";
import useServicios from "../hooks/useServicios";
import generarPdf from "../hooks/generarPdf";

function VentaNueva() {
  const productoRef = useRef(null);
  const cantidadRef = useRef(null);
  const servicioRef = useRef(null);
  const cantidadServicioRef = useRef(null);
  const { getVentas } = useVentas();
  const { clientes, singleCliente, setSingleCliente, getClientes } =
    useClientes();
  const { productos, singleProducto, getProductos } = useProductos();
  const { servicios, singleServicio, getServicios } = useServicios();
  const obtenerFechaActual = () => {
    const fecha = new Date();
    // Devuelve la fecha en formato YYYY-MM-DD
    return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(fecha.getDate()).padStart(2, "0")}`;
  };
  const [ventaData, setVentaData] = useState({
    productos: [],
    servicios: [],
    cliente: null, // Aquí puedes usar null en lugar de un objeto vacío.
    factura: null, // Si no tienes una entidad 'factura' relacionada directamente con 'venta' en el backend, probablemente deberías omitir este campo.
    fecha: obtenerFechaActual(),
    cantidadNeta: 0,
    cantidadBruta: 0,
    iva: 0,
    detalles: "",
  });

  const [facturaClienteData, setFacturaClienteData] = useState({
    productos: [],
    servicios: [],
    cliente: null,
    numeroFactura: "",
    fechaEmision: "",
    fechaOperacion: "",
    cantidadNeta: 0,
    cantidadBruta: 0,
    iva: 0,
    detalles: "",
    pdfFactura: "",
    estado: "pagada",
    cuotaTributaria: "",
    servicio: "",
    valorServicio: 0,
  });
  useEffect(() => {
    // Cantidad bruta será equivalente a la suma de cantidadNeta y valorServicio
    // a esta suma se le restará el valor de iva (que siempre va a ser un porcentaje)
    const bruta =
      facturaClienteData.cantidadNeta + facturaClienteData.valorServicio;
    const valorIva = bruta * (facturaClienteData.iva / 100);
    const totalBruta = bruta - valorIva;

    setFacturaClienteData((prev) => ({ ...prev, cantidadBruta: totalBruta }));
    setVentaData((prev) => ({ ...prev, cantidadBruta: totalBruta }));
  }, [
    facturaClienteData.cantidadNeta,
    facturaClienteData.valorServicio,
    facturaClienteData.iva,
  ]);

  useEffect(() => {
    // Sumar todos los productos seleccionados
    const totalProductos = ventaData.productos.reduce(
      (acc, producto) => acc + producto.precioVenta,
      0
    );
    const totalServicios = ventaData.servicios.reduce(
      (acc, servicio) => acc + servicio.precioVenta,
      0
    );
    const totalSP = totalProductos + totalServicios;
    // Calcular cantidadNeta (suma de todos los precios de productos más valorServicio)
    const neta = totalSP + facturaClienteData.valorServicio;
    setFacturaClienteData((prev) => ({ ...prev, cantidadNeta: neta }));
    setVentaData((prev) => ({ ...prev, cantidadNeta: neta }));
  }, [ventaData.productos, facturaClienteData.valorServicio, ventaData.servicios ]);

  const handleAddProducto = () => {
    const selectedProducto = productos.find(
      (producto) => producto._id === productoRef.current.value
    );
    const cantidad = parseInt(cantidadRef.current.value);

    const newProductosArray = [...ventaData.productos];

    for (let i = 0; i < cantidad; i++) {
      newProductosArray.push(selectedProducto);
    }

    setVentaData((prev) => ({
      ...prev,
      productos: newProductosArray,
    }));

    setFacturaClienteData((prev) => ({
      ...prev,
      productos: newProductosArray,
    }));
  };

  const handleRemoveProducto = (indexToRemove) => {
    setVentaData((prev) => ({
      ...prev,
      productos: prev.productos.filter((_, index) => index !== indexToRemove),
    }));

    setFacturaClienteData((prev) => ({
      ...prev,
      productos: prev.productos.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleAddServicio = () => {
    const selectedServicio = servicios.find(
      (servicio) => servicio._id === servicioRef.current.value
    );
    const cantidad = parseInt(cantidadRef.current.value);

    const newServiciosArray = [...ventaData.servicios];

    for (let i = 0; i < cantidad; i++) {
      newServiciosArray.push(selectedServicio);
    }

    setVentaData((prev) => ({
      ...prev,
      servicios: newServiciosArray,
    }));

    setFacturaClienteData((prev) => ({
      ...prev,
      servicios: newServiciosArray,
    }));
  };

  const handleRemoveServicio = (indexToRemove) => {
    setVentaData((prev) => ({
      ...prev,
      servicios: prev.servicios.filter((_, index) => index !== indexToRemove),
    }));

    setFacturaClienteData((prev) => ({
      ...prev,
      servicios: prev.servicios.filter((_, index) => index !== indexToRemove),
    }));
  };

  const addVentaYFactura = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_DATABASE_URL}/sales`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            venta: ventaData,
            facturaCliente: facturaClienteData,
          }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        toast.success("Venta y factura creadas con éxito!");

        generarPdf(data.facturaId);
        // Aquí puedes resetear los estados si lo consideras necesario
        setVentaData({
          productos: [],
          servicios: [],
          cliente: null, // Aquí puedes usar null en lugar de un objeto vacío.
          factura: null, // Si no tienes una entidad 'factura' relacionada directamente con 'venta' en el backend, probablemente deberías omitir este campo.
          fecha: obtenerFechaActual(),
          cantidadNeta: 0,
          cantidadBruta: 0,
          iva: 0,
          detalles: "",
        });
        setFacturaClienteData({
          productos: [],
          servicios: [],
          cliente: null, // De nuevo, usando null.
          venta: null, // Este se llenará después de que hayas creado la venta en el backend.
          numeroFactura: "",
          fechaEmision: "",
          fechaOperacion: "",
          cantidadNeta: 0,
          cantidadBruta: 0,
          iva: 0,
          detalles: "",
          pdfFactura: "",
          estado: "",
          cuotaTributaria: "",
          servicio: "",
          valorServicio: 0,
        });
        getVentas();
      } else {
        const errorMsg = data.message || "Ha ocurrido un error desconocido";
        throw new Error(errorMsg);
      }
    } catch (error) {
      console.error("Error al añadir Venta y Factura:", error);
      toast.error(`Error al añadir Venta y Factura: ${error.message}`);
    }
  };

  return (
    <div>
      <Toaster />
      <div>
        {" "}
        <h2>Datos de la Venta</h2>
        <label>
          Cliente:
          <select
            value={ventaData.cliente ? ventaData.cliente._id : ""}
            onChange={(e) => {
              const selectedCliente = clientes.find(
                (cliente) => cliente._id === e.target.value
              );
              setVentaData((prev) => ({ ...prev, cliente: selectedCliente }));
              setFacturaClienteData((prev) => ({
                ...prev,
                cliente: selectedCliente,
              }));
            }}
          >
            <option value="">Seleccione un cliente</option>
            {Array.isArray(clientes) &&
              clientes.map((cliente) => (
                <option key={cliente._id} value={cliente._id}>
                  {cliente.nombre}
                </option>
              ))}
          </select>
        </label>
        <div>
          {" "}
          <label>
            Producto:
            <select ref={productoRef}>
              <option value="">Seleccione un producto</option>
              {Array.isArray(productos) &&
                productos.map((producto) => (
                  <option key={producto._id} value={producto._id}>
                    {producto.nombre}
                  </option>
                ))}
            </select>
          </label>
          <label>
            Cantidad:
            <input type="number" ref={cantidadRef} min="1" />
          </label>
          <button onClick={handleAddProducto}>Añadir Producto</button>
          <div>
            <h3>Productos seleccionados:</h3>
            <ul>
              {ventaData.productos.map((producto, index) => (
                <li key={producto._id}>
                  {producto.nombre}
                  <button onClick={() => handleRemoveProducto(index)}>
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div>
          {" "}
          <label>
            SErvicio:
            <select ref={servicioRef}>
              <option value="">Seleccione un servicio</option>
              {Array.isArray(servicios) &&
                servicios.map((servicio) => (
                  <option key={servicio._id} value={servicio._id}>
                    {servicio.nombre}
                  </option>
                ))}
            </select>
          </label>
          <label>
            Cantidad:
            <input type="number" ref={cantidadServicioRef} min="1" />
          </label>
          <button onClick={handleAddServicio}>Añadir Servicio</button>
          <div>
            <h3>Servicios seleccionados:</h3>
            <ul>
              {ventaData.servicios.map((servicio, index) => (
                <li key={servicio._id}>
                  {servicio.nombre}
                  <button onClick={() => handleRemoveServicio(index)}>
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div>
        <h2>Datos de la Factura</h2>

        <label>
          Numero Factura:
          <input
            type="text"
            value={facturaClienteData.numeroFactura}
            onChange={(e) =>
              setFacturaClienteData((prev) => ({
                ...prev,
                numeroFactura: e.target.value,
              }))
            }
          />
        </label>
        <div className="input-group">
          <label>
            Fecha de Emisión:
            <input
              type="date"
              value={facturaClienteData.fechaEmision}
              onChange={(e) =>
                setFacturaClienteData((prev) => ({
                  ...prev,
                  fechaEmision: e.target.value,
                }))
              }
            />
          </label>

          <label>
            Fecha de Operación:
            <input
              type="date"
              value={facturaClienteData.fechaOperacion}
              onChange={(e) =>
                setFacturaClienteData((prev) => ({
                  ...prev,
                  fechaOperacion: e.target.value,
                }))
              }
            />
          </label>
          <label>
            IVA:
            <input
              type="number"
              value={facturaClienteData.iva}
              onChange={(e) =>
                setFacturaClienteData((prev) => ({
                  ...prev,
                  iva: parseFloat(e.target.value),
                }))
              }
            />
          </label>

          <label>
            Detalles:
            <textarea
              value={facturaClienteData.detalles}
              onChange={(e) =>
                setFacturaClienteData((prev) => ({
                  ...prev,
                  detalles: e.target.value,
                }))
              }
            />
          </label>
          <label>
            Estado:
            <select
              value={facturaClienteData.estado}
              onChange={(e) =>
                setFacturaClienteData((prev) => ({
                  ...prev,
                  estado: e.target.value,
                }))
              }
            >
              <option value="pagada">Pagada</option>
              <option value="pendiente">Pendiente</option>
              <option value="vencida">Vencida</option>
            </select>
          </label>

          <label>
            Cuota Tributaria:
            <input
              type="text"
              value={facturaClienteData.cuotaTributaria}
              onChange={(e) =>
                setFacturaClienteData((prev) => ({
                  ...prev,
                  cuotaTributaria: e.target.value,
                }))
              }
            />
          </label>

          <label>
            Servicio:
            <input
              type="text"
              value={facturaClienteData.servicio}
              onChange={(e) =>
                setFacturaClienteData((prev) => ({
                  ...prev,
                  servicio: e.target.value,
                }))
              }
            />
          </label>

          <label>
            Valor del Servicio:
            <input
              type="number"
              value={facturaClienteData.valorServicio}
              onChange={(e) =>
                setFacturaClienteData((prev) => ({
                  ...prev,
                  valorServicio: parseFloat(e.target.value),
                }))
              }
            />
          </label>
        </div>

        <label>
          Cantidad Bruta:
          <span>{facturaClienteData.cantidadBruta.toFixed(2)}</span>
          {/* toFixed(2) muestra el valor con 2 decimales */}
        </label>
        <label>
          Cantidad Neta:
          <span>{facturaClienteData.cantidadNeta.toFixed(2)}</span>
          {/* toFixed(2) muestra el valor con 2 decimales */}
        </label>
      </div>

      <button onClick={addVentaYFactura}>Añadir Venta y Factura</button>
    </div>
  );
}
export default VentaNueva;
