"use client";
import React, { useState } from "react";
import "./crearProducto.css";

function ProductoNuevo() {
  
  const [productoData, setProductoData] = useState({
    nombre: "",
    descripcion: "",
    precioCompra: "",
    precioVenta: "",
    iva: "",
    numeroSerie: "",
    stock: "",
  });

  const addProducto = async (productoData) => {
    try {
      const token = localStorage.getItem("token"); // Recuperar el token del localStorage

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
        });
        getProductos();

      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Error al añadir producto:", error);
    }
  };
  const getProductos = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch( `${process.env.NEXT_PUBLIC_DATABASE_URL}/product`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setProductos(data);
    } catch (error) {
      console.error("Error al obtener las productos:", error);
    }
  };

  return (
    <div>
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
        Precio de compra sin IVA
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
        Precio de venta sin IVA
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
        Stock
        <input
          value={productoData.stock}
          onChange={(e) =>
            setProductoData((prev) => ({
              ...prev,
              stock: e.target.value,
            }))
          }
        />
      </label>

      <button onClick={() => addProducto(productoData)}>Añadir Producto</button>
    </div>
  );
}
export default ProductoNuevo;
