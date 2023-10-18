"use client";
import React, { useState } from "react";
import "./crearProducto.css";
import { Toaster, toast } from "sonner";
import useProductos from "../hooks/useProductos";
import useServicios from "../hooks/useServicios";
import useProveedores from "../hooks/useProveedores";

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
    proveedor:"",
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
          proveedor:"",
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
    <div>
      <div>
        <label>
          <input
            type="radio"
            value="product"
            checked={itsProduct}
            onChange={handleSelectionChange}
          />
          Producto
        </label>

        <label>
          <input
            type="radio"
            value="service"
            checked={!itsProduct}
            onChange={handleSelectionChange}
          />
          Servicio
        </label>
      </div>
      <Toaster /> {/* Asegúrate de incluir Toaster en tu componente */}
      {itsProduct ? (
        <>
          {" "}
          <label>
            Nombre:
            <input
              type="text"
              value={productoData.nombre}
              onChange={(e) =>
                setProductoData((prev) => ({ ...prev, nombre: e.target.value }))
              }
            />
          </label>
          <label>
          Proveedor:
          <select
            value={productoData.proveedor ? productoData.proveedor._id : ""}
            onChange={(e) => {
              const selectedProveedor = proveedores.find(
                (proveedor) => proveedor._id === e.target.value
              );
              setProductoData((prev) => ({ ...prev, proveedor: selectedProveedor }));
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
        </label>
          <label>
            Descripción:
            <textarea
              value={productoData.descripcion}
              onChange={(e) =>
                setProductoData((prev) => ({
                  ...prev,
                  descripcion: e.target.value,
                }))
              }
            />
          </label>
          <label>
            Precio de compra con IVA
            <input
              value={productoData.precioCompra}
              onChange={(e) =>
                setProductoData((prev) => ({
                  ...prev,
                  precioCompra: e.target.value,
                }))
              }
            />
          </label>
          <label>
            Precio de venta con IVA
            <input
              value={productoData.precioVenta}
              onChange={(e) =>
                setProductoData((prev) => ({
                  ...prev,
                  precioVenta: e.target.value,
                }))
              }
            />
          </label>
          <label>
            IVA
            <input
              value={productoData.iva}
              onChange={(e) =>
                setProductoData((prev) => ({
                  ...prev,
                  iva: e.target.value,
                }))
              }
            />
          </label>
          <label>
            Numero de serie
            <input
              value={productoData.numeroSerie}
              onChange={(e) =>
                setProductoData((prev) => ({
                  ...prev,
                  numeroSerie: e.target.value,
                }))
              }
            />
          </label>
          <label>
            Numero de unidades
            <input
              value={productoData.stock}
              onChange={(e) =>
                setProductoData((prev) => ({
                  ...prev,
                  stock: e.target.value,
                  vecesComprado: e.target.value,
                }))
              }
            />
          </label>
          <button onClick={() => addProducto(productoData)}>
            Añadir Producto
          </button>
        </>
      ) : (
        <>
          {" "}
          <label>
            Nombre:
            <input
              type="text"
              value={servicioData.nombre}
              onChange={(e) =>
                setServicioData((prev) => ({ ...prev, nombre: e.target.value }))
              }
            />
          </label>
          <label>
            Descripción:
            <textarea
              value={servicioData.descripcion}
              onChange={(e) =>
                setServicioData((prev) => ({
                  ...prev,
                  descripcion: e.target.value,
                }))
              }
            />
          </label>
          <label>
            Precio de venta con IVA
            <input
              value={servicioData.precioVenta}
              onChange={(e) =>
                setServicioData((prev) => ({
                  ...prev,
                  precioVenta: e.target.value,
                }))
              }
            />
          </label>
          <label>
            IVA
            <input
              value={servicioData.iva}
              onChange={(e) =>
                setServicioData((prev) => ({
                  ...prev,
                  iva: e.target.value,
                }))
              }
            />
          </label>
          <button onClick={() => addServicio(servicioData)}>
            Añadir Servicio
          </button>
        </>
      )}
    </div>
  );
}
export default ProductoNuevo;
