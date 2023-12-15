"use client";
import React, { useState } from "react";
import "./crearProducto.css";
import { Toaster, toast } from "sonner";
import useProductos from "../../hooks/useProductos";
import useServicios from "../../hooks/useServicios";
import useProveedores from "../../hooks/useProveedores";
import { BsFillPersonFill } from "react-icons/bs";
import { GrUserWorker } from "react-icons/gr";
import { MdOutlineDescription } from "react-icons/md";
import { TbReceiptTax } from "react-icons/tb";
import { AiOutlineFieldNumber } from "react-icons/ai";



function ProductoNuevo() {
  const [itsProduct, setItsProduct] = useState(true);
  const { productos, singleProducto, getProductos } = useProductos();
  const { servicios, singleServicio, getServicios } = useServicios();
  const { proveedores, singleProveedor, getProveedores } = useProveedores();
  const [productoData, setProductoData] = useState({
    nombre: "",
    descripcion: "",
    precioCompra: "",
    precioVenta: "",
    iva: "",
    numeroSerie: "",
    stock: "",
    vecesComprado: "",
    proveedor: "",
  });
  const [servicioData, setServicioData] = useState({
    usuario: "",
    nombre: "",
    descripcion: "",
    precioVenta: "",
    iva: "",
    vecesVendido: "", // Solo para servicios
  });

  const addProducto = async (productoData) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_DATABASE_URL}/product`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(productoData),
        }
      );
      const data = await response.json();
      if (response.ok) {
        // Limpiar el formulario
        setProductoData({
          nombre: "",
          descripcion: "",
          precioCompra: "",
          precioVenta: "",
          iva: "",
          numeroSerie: "",
          stock: "",
          proveedor: "",
        });
        getProductos();
        // Mostrar una notificación de éxito
        toast.success(data.message);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Error al añadir producto:", error);

      // Mostrar una notificación de error
      toast.error(`Error al añadir producto: ${error.message}`);
    }
  };

  const addServicio = async (servicioData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_DATABASE_URL}/service`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(servicioData),
        }
      );
      const data = await response.json();
      if (response.ok) {
        // Limpiar el formulario
        setServicioData({
          usuario: "",
          nombre: "",
          descripcion: "",
          precioVenta: "",
          iva: "",
          vecesVendido: "", // Solo para servicios
        });
        getServicios();
        // Mostrar una notificación de éxito
        toast.success(data.message);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Error al añadir Servicio:", error);

      // Mostrar una notificación de error
      toast.error(`Error al añadir Servicio: ${error.message}`);
    }
  };

  const handleSelectionChange = (event) => {
    if (event.target.value === "product") {
      setItsProduct(true);
    } else if (event.target.value === "service") {
      setItsProduct(false);
    }
  };

  return (
    <section className="sectionCPR">
      <h2 className="green-bg">Crear producto</h2>
      <div className="typeselectorCPR">
        <input
          id="product"
          type="radio"
          name="type"
          value="product"
          checked={itsProduct}
          onChange={handleSelectionChange}
        />
        <label for="product">Producto</label>

        <input
          id="service"
          type="radio"
          name="type"
          value="service"
          checked={!itsProduct}
          onChange={handleSelectionChange}
        />
        <label for="service">Servicio</label>
      </div>
      {itsProduct ? (
        <>
          {" "}
          <div className="inputgroupCPR">
            <span className="iconCPR">
              <BsFillPersonFill />
            </span>
            <input
              className="inputCPR"
              placeholder="Nombre"
              autoComplete="nope"
              type="text"
              value={productoData.nombre}
              onChange={(e) =>
                setProductoData((prev) => ({ ...prev, nombre: e.target.value }))
              }
            />
          </div>
          <div className="inputgroupCPR">
            <span className="iconCPR">
            <GrUserWorker />
            </span>
            <select
              className="inputCPR"
              value={productoData.proveedor ? productoData.proveedor._id : ""}
              onChange={(e) => {
                const selectedProveedor = proveedores.find(
                  (proveedor) => proveedor._id === e.target.value
                );
                setProductoData((prev) => ({
                  ...prev,
                  proveedor: selectedProveedor,
                }));
              }}
            >
              <option value="">Seleccione un proveedor</option>
              {Array.isArray(proveedores) &&
                proveedores.map((proveedor) => (
                  <option key={proveedor._id} value={proveedor._id}>
                    {proveedor.nombre}
                  </option>
                ))}
            </select>
          </div>
          <div className="inputgroupCPR">
            <span className="iconCPR">
            <MdOutlineDescription />
            </span>
            <textarea
              className="inputCPR"
              placeholder="Descripción"
              autoComplete="nope"
              value={productoData.descripcion}
              onChange={(e) =>
                setProductoData((prev) => ({
                  ...prev,
                  descripcion: e.target.value,
                }))
              }
            />
          </div>
          <div className="inputgroupCPR-h">
            <span className="iconCPR-h">
            €
            </span>
            <input
              className="inputCPR-h"
              placeholder="€ compra c/IVA"
              autoComplete="nope"
              type="text"
              value={productoData.precioCompra}
              onChange={(e) =>
                setProductoData((prev) => ({
                  ...prev,
                  precioCompra: e.target.value,
                }))
              }
            />
          </div>
          <div className="inputgroupCPR-h">
            <span className="iconCPR-h">
           €
            </span>
            <input
              className="inputCPR-h"
              placeholder="€ venta c/IVA"
              autoComplete="nope"
              type="text"
              value={productoData.precioVenta}
              onChange={(e) =>
                setProductoData((prev) => ({
                  ...prev,
                  precioVenta: e.target.value,
                }))
              }
            />
          </div>
          <div className="inputgroupCPR-h">
            <span className="iconCPR-h">
            <TbReceiptTax />
            </span>
            <input
              className="inputCPR-h"
              placeholder="IVA"
              autoComplete="nope"
              type="text"
              value={productoData.iva}
              onChange={(e) =>
                setProductoData((prev) => ({
                  ...prev,
                  iva: e.target.value,
                }))
              }
            />
          </div>
          <div className="inputgroupCPR-h">
            <span className="iconCPR-h">
     
<AiOutlineFieldNumber />
            </span>
            <input
              className="inputCPR-h"
              placeholder="Nº unidades"
              autoComplete="nope"
              type="text"
              value={productoData.stock}
              onChange={(e) =>
                setProductoData((prev) => ({
                  ...prev,
                  stock: e.target.value,
                  vecesComprado: e.target.value,
                }))
              }
            />
          </div>
          <div className="inputgroupCPR-h">
            <span className="iconCPR-h">
     
<AiOutlineFieldNumber />
            </span>
            <input
              className="inputCPR-h"
              placeholder="Nº serie"
              autoComplete="nope"
              type="text"
              value={productoData.numeroSerie}
              onChange={(e) =>
                setProductoData((prev) => ({
                  ...prev,
                  numeroSerie: e.target.value,
                }))
              }
            />
          </div>
       
          <button className="buttonCPR green-bg" onClick={() => addProducto(productoData)}>
            Añadir Producto
          </button>
        </>
      ) : (
        <>
          {" "}
          <div className="inputgroupCPR">
            <span className="iconCPR">
              <BsFillPersonFill />
            </span>
            <input
              className="inputCPR"
              placeholder="Nombre"
              autoComplete="nope"
              type="text"
              value={servicioData.nombre}
              onChange={(e) =>
                setServicioData((prev) => ({ ...prev, nombre: e.target.value }))
              }
            />
          </div>
         
          <div className="inputgroupCPR">
            <span className="iconCPR">
            <MdOutlineDescription />
            </span>
            <textarea
              className="inputCPR"
              placeholder="Descripción"
              autoComplete="nope"
              value={servicioData.descripcion}
              onChange={(e) =>
                setServicioData((prev) => ({
                  ...prev,
                  descripcion: e.target.value,
                }))
              }
            />
          </div>
          <div className="inputgroupCPR-h">
            <span className="iconCPR-h">
             €
            </span>
            <input
              className="inputCPR-h"
              placeholder="€ venta c/IVA"
              autoComplete="nope"
              type="text"
              value={servicioData.precioVenta}
              onChange={(e) =>
                setServicioData((prev) => ({
                  ...prev,
                  precioVenta: e.target.value,
                }))
              }
            />
          </div>
          <div className="inputgroupCPR-h">
            <span className="iconCPR-h">
            <TbReceiptTax />
            </span>
            <input
              className="inputCPR-h"
              placeholder="IVA"
              autoComplete="nope"
              type="text"
              value={servicioData.iva}
              onChange={(e) =>
                setServicioData((prev) => ({
                  ...prev,
                  iva: e.target.value,
                }))
              }
            />
          </div>

          <button className="buttonCPR-s green-bg" onClick={() => addServicio(servicioData)}>
            Añadir Servicio
          </button>
        </>
      )}
    </section>
  );
}
export default ProductoNuevo;
