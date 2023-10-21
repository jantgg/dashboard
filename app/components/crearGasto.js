"use client";
import React, { useState, useEffect, useRef } from "react";
import "./crearProducto.css";
import { Toaster, toast } from "sonner";
import useGastos from "../hooks/useGastos";
import useProveedores from "../hooks/useProveedores";
import useProductos from "../hooks/useProductos";
import useServiciosProveedor from "../hooks/useServiciosProveedor";
import generarPdfP from "../hooks/generarPdfProveedor";

function GastoNuevo() {
  const productoRef = useRef(null);
  const cantidadRef = useRef(null);
  const servicioRef = useRef(null);
  const cantidadServicioRef = useRef(null);
  const { getGastos } = useGastos();
  const { proveedores, singleProveedor, setSingleProveedor, getProveedores } =
    useProveedores();
  const { productos, singleProducto, getProductos } = useProductos();
  const [servicio, setServicio] = useState({
    nombre: "",
    descripcion: "",
    precioCompra: "",
    iva: "",
    vecesComprado: 1,
    proveedor: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setServicio((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setGastoData((prevState) => ({
      ...prevState,
      servicios: [...prevState.servicios, servicio],
    }));

    setFacturaProveedorData((prevState) => ({
      ...prevState,
      servicios: [...prevState.servicios, servicio],
    }));

    setServicio({
      nombre: "",
      descripcion: "",
      precioCompra: "",
      iva: "",
      vecesComprado: 1,
      proveedor: "",
    });
  };
  const obtenerFechaActual = () => {
    const fecha = new Date();
    // Devuelve la fecha en formato YYYY-MM-DD
    return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(fecha.getDate()).padStart(2, "0")}`;
  };
  const [gastoData, setGastoData] = useState({
    productos: [],
    servicios: [],
    proveedor: {},
    facturaProveedor: {},
    fecha: "",
    cantidadNeta: 0,
    cantidadBruta: 0,
    iva: 0,
    detalles: "",
    tipo: "proveedor",
  });

  const [facturaProveedorData, setFacturaProveedorData] = useState({
    productos: [],
    servicios: [],
    proveedor: {},
    gasto: {},
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
  });

  useEffect(() => {
    // Cantidad bruta será equivalente a la suma de cantidadNeta y valorServicio
    // a esta suma se le restará el valor de iva (que siempre va a ser un porcentaje)
    const bruta = facturaProveedorData.cantidadNeta;
    const valorIva = bruta * (facturaProveedorData.iva / 100);
    const totalBruta = bruta - valorIva;

    setFacturaProveedorData((prev) => ({ ...prev, cantidadBruta: totalBruta }));
    setGastoData((prev) => ({ ...prev, cantidadBruta: totalBruta }));
  }, [facturaProveedorData.cantidadNeta, facturaProveedorData.iva]);

  useEffect(() => {
    // Sumar todos los productos seleccionados
    const totalProductos = gastoData.productos.reduce(
      (acc, producto) => acc + Number(producto.precioVenta),
      0
    );

    const totalServicios = gastoData.servicios.reduce(
      (acc, servicio) => acc + Number(servicio.precioCompra),
      0
    );

    const neta = totalProductos + totalServicios;
    setFacturaProveedorData((prev) => ({ ...prev, cantidadNeta: neta }));
    setGastoData((prev) => ({ ...prev, cantidadNeta: neta }));
  }, [gastoData.productos, gastoData.servicios]);

  const handleAddProducto = () => {
    const selectedProducto = productos.find(
      (producto) => producto._id === productoRef.current.value
    );
    const cantidad = parseInt(cantidadRef.current.value);

    const newProductosArray = [...gastoData.productos];

    for (let i = 0; i < cantidad; i++) {
      newProductosArray.push(selectedProducto);
    }

    setGastoData((prev) => ({
      ...prev,
      productos: newProductosArray,
    }));

    setFacturaProveedorData((prev) => ({
      ...prev,
      productos: newProductosArray,
    }));
  };

  const handleRemoveProducto = (indexToRemove) => {
    setGastoData((prev) => ({
      ...prev,
      productos: prev.productos.filter((_, index) => index !== indexToRemove),
    }));

    setFacturaProveedorData((prev) => ({
      ...prev,
      productos: prev.productos.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleRemoveServicio = (indexToRemove) => {
    setGastoData((prev) => ({
      ...prev,
      servicios: prev.servicios.filter((_, index) => index !== indexToRemove),
    }));

    setFacturaProveedorData((prev) => ({
      ...prev,
      servicios: prev.servicios.filter((_, index) => index !== indexToRemove),
    }));
  };

  const addGastoYFactura = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_DATABASE_URL}/expenses`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            gasto: gastoData,
            facturaProveedor: facturaProveedorData,
          }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        toast.success("Gasto y factura creadas con éxito!");

        generarPdfP(data.facturaId);
        // Aquí puedes resetear los estados si lo consideras necesario
        setGastoData({
          productos: [],
          servicios: [],
          proveedor: {},
          facturaProveedor: {},
          fecha: "",
          cantidadNeta: 0,
          cantidadBruta: 0,
          iva: 0,
          detalles: "",
          tipo: "proveedor",
        });
        setFacturaProveedorData({
          productos: [],
          servicios: [],
          proveedor: {},
          gasto: {},
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
        });
        getGastos();
      } else {
        const errorMsg = data.message || "Ha ocurrido un error desconocido";
        throw new Error(errorMsg);
      }
    } catch (error) {
      console.error("Error al añadir Gasto y Factura:", error);
      toast.error(`Error al añadir Gasto y Factura: ${error.message}`);
    }
  };

  return (
    <div>
      <Toaster />
      <div>
        {" "}
        <h2>Datos del Gasto</h2>
        <label>
          Proveedor:
          <select
            value={gastoData.proveedor ? gastoData.proveedor._id : ""}
            onChange={(e) => {
              const selectedProveedor = proveedores.find(
                (prov) => prov._id === e.target.value
              );

              // Actualizar el gastoData y facturaProveedorData con el proveedor seleccionado
              setGastoData((prev) => ({
                ...prev,
                proveedor: selectedProveedor,
              }));
              setFacturaProveedorData((prev) => ({
                ...prev,
                proveedor: selectedProveedor,
              }));

              // Actualizar el campo proveedor del estado servicio con el ID del proveedor seleccionado
              setServicio((prev) => ({
                ...prev,
                proveedor: e.target.value,
              }));
            }}
          >
            <option value="">Seleccione un Proveedor</option>
            {Array.isArray(proveedores) &&
              proveedores.map((proveedor) => (
                <option key={proveedor._id} value={proveedor._id}>
                  {proveedor.nombre}
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
              {gastoData.productos.map((producto, index) => (
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
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="nombre"
            value={servicio.nombre}
            onChange={handleChange}
            placeholder="Nombre"
            required
          />
          <textarea
            name="descripcion"
            value={servicio.descripcion}
            onChange={handleChange}
            placeholder="Descripción"
          />
          <input
            type="number"
            name="precioCompra"
            value={servicio.precioCompra}
            onChange={handleChange}
            placeholder="Precio de Compra"
            required
          />
          <input
            type="number"
            name="iva"
            value={servicio.iva}
            onChange={handleChange}
            placeholder="IVA"
            required
          />
          <input
            type="number"
            name="vecesComprado"
            value={servicio.vecesComprado}
            onChange={handleChange}
            placeholder="Unidades"
          />
          <button type="submit">Agregar Servicio</button>
        </form>
        <div>
          <h3>Servicios seleccionados:</h3>
          <ul>
            {gastoData.servicios.map((servicio, index) => (
              <li key={servicio._id}>
                {servicio.nombre}
                <button onClick={() => handleRemoveServicio(index)}>
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        </div>
        <label>
          Gasto Fijo:
          <input
            type="checkbox"
            checked={gastoData.tipo === "fijo"}
            onChange={(e) => {
              if (e.target.checked) {
                setGastoData((prev) => ({ ...prev, tipo: "fijo" }));
              } else {
                setGastoData((prev) => ({ ...prev, tipo: "proveedor" }));
              }
            }}
          />
        </label>
      </div>

      <div>
        <h2>Datos de la Factura</h2>

        <label>
          Numero Factura:
          <input
            type="text"
            value={facturaProveedorData.numeroFactura}
            onChange={(e) =>
              setFacturaProveedorData((prev) => ({
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
              value={facturaProveedorData.fechaEmision}
              onChange={(e) =>
                setFacturaProveedorData((prev) => ({
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
              value={facturaProveedorData.fechaOperacion}
              onChange={(e) => {
                setFacturaProveedorData((prev) => ({
                  ...prev,
                  fechaOperacion: e.target.value,
                }));
                setGastoData((prev) => ({
                  ...prev,
                  fecha: e.target.value,
                }));
              }}
            />
          </label>
          <label>
            IVA:
            <input
              type="number"
              value={facturaProveedorData.iva}
              onChange={(e) =>
                setFacturaProveedorData((prev) => ({
                  ...prev,
                  iva: parseFloat(e.target.value),
                }))
              }
            />
          </label>

          <label>
            Detalles:
            <textarea
              value={facturaProveedorData.detalles}
              onChange={(e) =>
                setFacturaProveedorData((prev) => ({
                  ...prev,
                  detalles: e.target.value,
                }))
              }
            />
          </label>
          <label>
            Estado:
            <select
              value={facturaProveedorData.estado}
              onChange={(e) =>
                setFacturaProveedorData((prev) => ({
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
              value={facturaProveedorData.cuotaTributaria}
              onChange={(e) =>
                setFacturaProveedorData((prev) => ({
                  ...prev,
                  cuotaTributaria: e.target.value,
                }))
              }
            />
          </label>
        </div>

        <label>
          Cantidad Bruta:
          <span>{facturaProveedorData.cantidadBruta.toFixed(2)}</span>
        </label>
        <label>
          Cantidad Neta:
          <span>{facturaProveedorData.cantidadNeta.toFixed(2)}</span>
        </label>
      </div>

      <button onClick={addGastoYFactura}>Añadir Gasto y Factura</button>
    </div>
  );
}
export default GastoNuevo;
