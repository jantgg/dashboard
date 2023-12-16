"use client";
import React, { useState, useEffect, useRef } from "react";
import "./crearGasto.css";
import { Toaster, toast } from "sonner";
import useGastos from "../hooks/useGastos";
import useProveedores from "../hooks/useProveedores";
import useProductos from "../hooks/useProductos";
import generarPdfP from "../hooks/generarPdfProveedor";
import { BsFillPersonFill } from "react-icons/bs";
import { FaRegTrashAlt } from "react-icons/fa";
import { GrUserWorker } from "react-icons/gr";
import { MdOutlineDescription } from "react-icons/md";
import { TbReceiptTax } from "react-icons/tb";
import { AiOutlineFieldNumber } from "react-icons/ai";
import { LuBox } from "react-icons/lu";


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
    vecesComprado: "",
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
    iva: "",
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
    <section className="sectionCG">
      <h2 className="tittleCG orange-bg">Añadir nuevo Gasto</h2>
      <div className="sectionCG-child">
        <div className="inputgroupCG">
          <span className=" inputcheckCG"> ¿Gasto fijo?</span>
          <input
            className="checkboxCG"
            type="checkbox"
            checked={gastoData.tipo === "fijo"}
            onChange={(e) => {
              if (e.target.checked) {
                setGastoData((prev) => ({ ...prev, tipo: "fijo" }));
              } else {
                setGastoData((prev) => ({ ...prev, tipo: "proveedor" }));
              }
            }}
          />{" "}
        </div>{" "}


        <div className="inputgroupCG">
          <span className="iconCG">
            <GrUserWorker />
          </span>
          <select
            className="inputCG"
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
        </div>



        <div className="producto-group">
          <h2 className="h2-servicio blue-bg">Añadir producto</h2>
          <div className="inputgroupCG">
            <span className="iconCG">
              <LuBox /> 
            </span>
            <select ref={productoRef} className="inputCG">
              <option value="">Seleccione un producto</option>
              {Array.isArray(productos) &&
                productos.map((producto) => (
                  <option key={producto._id} value={producto._id}>
                    {producto.nombre}
                  </option>
                ))}
            </select>
          </div>

          <div className="inputgroupCG-h">
            <span className="iconCG-h">
              <AiOutlineFieldNumber />
            </span>
            <input
              className="inputCG-h"
              placeholder="Cantidad"
              autoComplete="nope"
              type="number"
              ref={cantidadRef}
              min="1"
            />
          </div>
          <button className="buttonCG" onClick={handleAddProducto}>
            Añadir
          </button>
        </div>

        <form onSubmit={handleSubmit} className="producto-group">
          <h2 className="h2-servicio blue-bg">Añadir servicio</h2>
          <div className="inputgroupCG">
            <span className="iconCG">
              <BsFillPersonFill />
            </span>
            <input
              className="inputCG"
              placeholder="Nombre"
              autoComplete="nope"
              type="text"
              name="nombre"
              value={servicio.nombre}
              onChange={handleChange}
              required
            />
          </div>
          <div className="inputgroupCG">
            <span className="iconCG">
              <MdOutlineDescription />
            </span>
            <textarea
              className="inputCG"
              autoComplete="nope"
              name="descripcion"
              value={servicio.descripcion}
              onChange={handleChange}
              placeholder="Descripción"
            />
          </div>

          <div className="inputgroupCG">
            <span className="iconCG">
              €
            </span>
            <input
              className="inputCG"
              autoComplete="nope"
              type="number"
              name="precioCompra"
              value={servicio.precioCompra}
              onChange={handleChange}
              placeholder="Precio de Compra"
              required
            />
          </div>

          <div className="inputgroupCG">
            <span className="iconCG">
              <TbReceiptTax />
            </span>
            <input
              className="inputCG"
              autoComplete="nope"
              type="number"
              name="iva"
              value={servicio.iva}
              onChange={handleChange}
              placeholder="IVA"
              required
            />
          </div>

          <div className="inputgroupCG-h">
            <span className="iconCG-h">
              <AiOutlineFieldNumber />
            </span>
            <input
              className="inputCG-h"
              autoComplete="nope"
              type="number"
              name="vecesComprado"
              value={servicio.vecesComprado}
              onChange={handleChange}
              placeholder="Unidades"
            />
          </div>

          <button className="buttonCG" type="submit">
            Añadir
          </button>
        </form>
 
        <div className="totaldegastosCG">  
        <label className="tgCG-child">
        <span className="name-tgCG-child">Cantidad Bruta</span>
            
            <span className="valor-tgCG-child green-bg">{facturaProveedorData.cantidadBruta.toFixed(2)}</span>
          </label>
          <label className="tgCG-child">
          <span className="name-tgCG-child">  Cantidad Neta</span>
          
            <span className="valor-tgCG-child green-bg">{facturaProveedorData.cantidadNeta.toFixed(2)}</span>
          </label>
        <button className="button-tgCG-child green-bg" onClick={addGastoYFactura}>Añadir Gasto y Factura</button>
        </div>
      </div>





      <div className="sectionCG-child">
        {" "}
        <div className="selectedproductsCG">
          <h3 className="pink-bg">Productos seleccionados</h3>
          <ul className="listaproductosCG-s">
            {gastoData.productos.map((producto, index) => (
              <li className="productoCG-s" key={producto._id}>
              <span className="productonombreCG-s">     {producto.nombre}</span>
            <div className="buttonsproductoCG-s">
              {" "}
              <button className="trashCG-s" onClick={() => handleRemoveProducto(index)}>
                <FaRegTrashAlt  />
              </button>
            </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="selectedproductsCG">
        <h3 className="pink-bg">Servicios seleccionados</h3>
          <ul className="listaproductosCG-s">
            {gastoData.servicios.map((servicio, index) => (
              <li className="productoCG-s" key={servicio._id}>
              <span className="productonombreCG-s">     {servicio.nombre}</span>
            <div className="buttonsproductoCG-s">
              {" "}
              <button className="trashCG-s" onClick={() => handleRemoveServicio(index)}>
                <FaRegTrashAlt  />
              </button>
            </div>
              </li>
            ))}
          </ul>
        </div>



        <div className="producto-group">
          <h2 className="h2-servicio blue-bg">Datos factura</h2>
          <div className="inputgroupCG">
            <span className="iconCG">
              <AiOutlineFieldNumber />
            </span>
            <input
              className="inputCG"
              placeholder="Numero factura"
              autoComplete="nope"
              type="text"
              value={facturaProveedorData.numeroFactura}
              onChange={(e) =>
                setFacturaProveedorData((prev) => ({
                  ...prev,
                  numeroFactura: e.target.value,
                }))
              }
            />
          </div>

          <div className="inputgroupCG-f">
            <span className="iconCG-f">
            Estado
            </span>
            <select className="inputCG-f"
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
          </div>
          <div className="inputgroupCG-f">
            <span className="iconCG-f">
            Emisión
            </span>
            <input
              className="inputCG-f"
              placeholder="Fecha emision"
              autoComplete="nope"
              type="date"
              value={facturaProveedorData.fechaEmision}
              onChange={(e) =>
                setFacturaProveedorData((prev) => ({
                  ...prev,
                  fechaEmision: e.target.value,
                }))
              }
            />
          </div>
      
          <div className="inputgroupCG-f">
            <span className="iconCG-f">
            Operación
            </span>
            <input
              className="inputCG-f"
              placeholder="Fecha operación"
              autoComplete="nope"
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
          </div>
          <div className="inputgroupCG">
            <span className="iconCG">
              <MdOutlineDescription />
            </span>
            <textarea
              className="inputCG"
              autoComplete="nope"
              name="descripcion"
              value={facturaProveedorData.detalles}
                onChange={(e) =>
                  setFacturaProveedorData((prev) => ({
                    ...prev,
                    detalles: e.target.value,
                  }))
                }
              placeholder="Descripción"
            />
          </div>



          <div className="inputgroupCG">
            <span className="iconCG">
              <TbReceiptTax />
            </span>
            <input
              className="inputCG"
              autoComplete="nope"
              type="text"
              value={facturaProveedorData.iva}
              onChange={(e) =>
                setFacturaProveedorData((prev) => ({
                  ...prev,
                  iva: parseFloat(e.target.value),
                }))
              }
              placeholder="IVA"
              required
            />
          </div>
          <div className="inputgroupCG">
            <span className="iconCG">
            <TbReceiptTax />
            </span>
            <input
              className="inputCG"
              autoComplete="nope"
              type="text"
          
                value={facturaProveedorData.cuotaTributaria}
                onChange={(e) =>
                  setFacturaProveedorData((prev) => ({
                    ...prev,
                    cuotaTributaria: e.target.value,
                  }))
                }
              placeholder="Cuota Tributaria"
              required
            />
          </div>
        </div>
      
      </div>
    </section>
  );
}
export default GastoNuevo;
