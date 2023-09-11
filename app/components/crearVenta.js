"use client";
import React, { useState, useEffect, useRef } from "react";
import "./crearProducto.css";
import { Toaster, toast } from "sonner";
import useVentas from "../hooks/useVentas";
import useClientes from "../hooks/useClientes";
import useProductos from "../hooks/useProductos";

function VentaNueva() {
  const productoRef = useRef(null);
  const cantidadRef = useRef(null);

  const { getVentas } = useVentas();
  const { clientes, singleCliente, setSingleCliente, getClientes } =
    useClientes();
  const { productos, singleProducto, getProductos } = useProductos();
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
    cliente: null, // De nuevo, usando null.
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
    // Calcular cantidadNeta (suma de todos los precios de productos más valorServicio)
    const neta = totalProductos + facturaClienteData.valorServicio;
    setFacturaClienteData((prev) => ({ ...prev, cantidadNeta: neta }));
    setVentaData((prev) => ({ ...prev, cantidadNeta: neta }));
  }, [ventaData.productos, facturaClienteData.valorServicio]);

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
        // Aquí puedes resetear los estados si lo consideras necesario
        setVentaData({
          productos: [],
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
