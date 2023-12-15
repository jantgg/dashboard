"use client";
import React, { useState, useEffect, useRef } from "react";
import "./crearVenta.css";
import { Toaster, toast } from "sonner";
import useVentas from "../hooks/useVentas";
import useClientes from "../hooks/useClientes";
import useProductos from "../hooks/useProductos";
import useServicios from "../hooks/useServicios";
import generarPdf from "../hooks/generarPdf";
import { BsFillPersonFill } from "react-icons/bs";
import { FaRegTrashAlt } from "react-icons/fa";
import { BsCheckCircle } from "react-icons/bs";

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
    iva: "",
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
    iva: "",
    detalles: "",
    pdfFactura: "",
    estado: "pagada",
    cuotaTributaria: "",
    servicio: "",
    valorServicio: "",
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
  }, [
    ventaData.productos,
    facturaClienteData.valorServicio,
    ventaData.servicios,
  ]);

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
    <section className="sectionCV">
      <h2 className="tittleCV green-bg">Añadir nueva Venta</h2>
      <div className="sectionCV-child">
        <div className="inputgroupCV">
          <span className="iconCV">
            <BsFillPersonFill />
          </span>
          <select
            className="inputCV"
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
        </div>

        <div className="producto-group">
          <h2 className="h2-servicio blue-bg">Añadir producto</h2>
          <div className="inputgroupCV">
            <span className="iconCV">
              <BsFillPersonFill />
            </span>
            <select ref={productoRef} className="inputCV">
              <option value="">Seleccione un producto</option>
              {Array.isArray(productos) &&
                productos.map((producto) => (
                  <option key={producto._id} value={producto._id}>
                    {producto.nombre}
                  </option>
                ))}
            </select>
          </div>

          <div className="inputgroupCV-h">
            <span className="iconCV-h">
              <BsFillPersonFill />
            </span>
            <input
              className="inputCV-h"
              placeholder="Cantidad"
              autoComplete="nope"
              type="number"
              ref={cantidadRef}
              min="1"
            />
          </div>
          <button className="buttonCV" onClick={handleAddProducto}>
            Añadir
          </button>
        </div>

        <div className="producto-group">
          <h2 className="h2-servicio blue-bg">Añadir servicio</h2>
          <div className="inputgroupCV">
            <span className="iconCV">
              <BsFillPersonFill />
            </span>
            <select ref={servicioRef} className="inputCV">
              <option value="">Seleccione un servicio</option>
              {Array.isArray(servicios) &&
                servicios.map((servicio) => (
                  <option key={servicio._id} value={servicio._id}>
                    {servicio.nombre}
                  </option>
                ))}
            </select>
          </div>

          <div className="inputgroupCV-h">
            <span className="iconCV-h">
              <BsFillPersonFill />
            </span>
            <input
              className="inputCV-h"
              placeholder="Cantidad"
              type="number"
              autoComplete="nope"
              ref={cantidadServicioRef}
              min="1"
            />
          </div>
          <button className="buttonCV" onClick={handleAddServicio}>
            Añadir
          </button>
        </div>
        <div className="producto-group">
          <h2 className="h2-servicio blue-bg">Datos factura</h2>
          <div className="inputgroupCV">
            <span className="iconCV">
              <BsFillPersonFill />
            </span>
            <input
              className="inputCV"
              placeholder="Numero factura"
              autoComplete="nope"
              type="text"
              value={facturaClienteData.numeroFactura}
              onChange={(e) =>
                setFacturaClienteData((prev) => ({
                  ...prev,
                  numeroFactura: e.target.value,
                }))
              }
            />
          </div>

          <div className="inputgroupCV-f">
            <span className="iconCV-f">Estado</span>
            <select
              className="inputCV-f"
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
          </div>
          <div className="inputgroupCV-f">
            <span className="iconCV-f">Emisión</span>
            <input
              className="inputCV-f"
              placeholder="Fecha emision"
              autoComplete="nope"
              type="date"
              value={facturaClienteData.fechaEmision}
              onChange={(e) =>
                setFacturaClienteData((prev) => ({
                  ...prev,
                  fechaEmision: e.target.value,
                }))
              }
            />
          </div>

          <div className="inputgroupCV-f">
            <span className="iconCV-f">Operación</span>
            <input
              className="inputCV-f"
              placeholder="Fecha operación"
              autoComplete="nope"
              type="date"
              value={facturaClienteData.fechaOperacion}
              onChange={(e) =>
                setFacturaClienteData((prev) => ({
                  ...prev,
                  fechaOperacion: e.target.value,
                }))
              }
            />
          </div>
          <div className="inputgroupCV">
            <span className="iconCV">
              <BsFillPersonFill />
            </span>
            <textarea
              className="inputCV"
              autoComplete="nope"
              value={facturaClienteData.detalles}
              onChange={(e) =>
                setFacturaClienteData((prev) => ({
                  ...prev,
                  detalles: e.target.value,
                }))
              }
              placeholder="Descripción"
            />
          </div>

          <div className="inputgroupCV">
            <span className="iconCV">
              IVA
            </span>
            <input
              className="inputCV"
              placeholder="IVA"
              autoComplete="nope"
              type="text"
              value={facturaClienteData.iva}
              onChange={(e) =>
                setFacturaClienteData((prev) => ({
                  ...prev,
                  iva: parseFloat(e.target.value),
                }))
              }
           
              required
            />
          </div>
          <div className="inputgroupCV">
            <span className="iconCV">
              <BsFillPersonFill />
            </span>
            <input
              className="inputCV"
              autoComplete="nope"
              type="text"
              value={facturaClienteData.cuotaTributaria}
              onChange={(e) =>
                setFacturaClienteData((prev) => ({
                  ...prev,
                  cuotaTributaria: e.target.value,
                }))
              }
              placeholder="Cuota Tributaria"
              required
            />
          </div>

          <div className="inputgroupCV">
            <span className="iconCV">
              <BsFillPersonFill />
            </span>
            <input
              className="inputCV"
              autoComplete="nope"
              type="text"
              value={facturaClienteData.servicio}
              onChange={(e) =>
                setFacturaClienteData((prev) => ({
                  ...prev,
                  servicio: e.target.value,
                }))
              }
              placeholder="Servicio adicional"
              required
            />
          </div>

          <div className="inputgroupCV">
            <span className="iconCV">
              <BsFillPersonFill />
            </span>
            <input
              className="inputCV"
              autoComplete="nope"
              type="text"
              value={facturaClienteData.valorServicio}
              onChange={(e) =>
                setFacturaClienteData((prev) => ({
                  ...prev,
                  valorServicio: parseFloat(e.target.value),
                }))
              }
              placeholder="Precio servicio"
              required
            />
          </div>
        </div>
      </div>




      <div className="sectionCV-child">
        {" "}
        <div className="selectedproductsCV">
          <h3 className="pink-bg">Productos seleccionados</h3>
          <ul className="listaproductosCV-s">
            {ventaData.productos.map((producto, index) => (
              <li className="productoCV-s" key={producto._id}>
              <span className="productonombreCV-s">     {producto.nombre}</span>
            <div className="buttonsproductoCV-s">
              {" "}
              <button className="trashCV-s" onClick={() => handleRemoveProducto(index)}>
                <FaRegTrashAlt  />
              </button>
            </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="selectedproductsCV">
        <h3 className="pink-bg">Servicios seleccionados</h3>
          <ul className="listaproductosCV-s">
            {ventaData.servicios.map((servicio, index) => (
              <li className="productoCV-s" key={servicio._id}>
              <span className="productonombreCV-s">     {servicio.nombre}</span>
            <div className="buttonsproductoCV-s">
              {" "}
              <button className="trashCV-s" onClick={() => handleRemoveServicio(index)}>
                <FaRegTrashAlt  />
              </button>
            </div>
              </li>
            ))}
          </ul>
        </div>



     
        <div className="totaldegastosCV">  
        <label className="tgCV-child">
        <span className="name-tgCV-child">Cantidad Bruta</span>
            
            <span className="valor-tgCV-child green-bg">{facturaClienteData.cantidadBruta}</span>
          </label>
          <label className="tgCV-child">
          <span className="name-tgCV-child">  Cantidad Neta</span>
          
            <span className="valor-tgCV-child green-bg">{facturaClienteData.cantidadNeta}</span>
          </label>
        <button className="button-tgCV-child green-bg" onClick={addVentaYFactura}>Añadir Venta y Factura</button>
        </div>
      
      </div>




   

    </section>
  );
}
export default VentaNueva;
