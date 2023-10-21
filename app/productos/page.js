"use client";
import Image from "next/image";
import "./page.css";
import { useEffect, useState } from "react";
import ProductoNuevo from "../components/crearProducto.js";
import SingleProducto from "../components/singleProducto.js";
import MasVendido from "../components/ventaComponents/masVendido.js";
import MasVendidoS from "../components/ventaComponents/masVendidoS.js";
import useProductos from "../hooks/useProductos";
import { Toaster, toast } from "sonner";

export default function Productos() {
  const { productos, singleProducto, loading, error, getProductos } =
    useProductos();

  useEffect(() => {
    document.title = "Productos";
  }, []);

  // delete de productos-----------------------------------------------------------------------
  const deleteProducto = async (tareaId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_DATABASE_URL}/product/${tareaId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        getProductos();
        // Mostrar una notificación de éxito
        toast.success("Producto eliminado con éxito!");
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      // Mostrar una notificación de error
      toast.error(`Error al eliminar producto: ${error.message}`);
    }
  };

  const handleDeleteProducto = (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      deleteProducto(id);
    }
  };

  return (
    <main className="home">
      <Toaster /> {/* Asegúrate de incluir Toaster en tu componente */}
      <div className="parent">
        <div className="div1">
          {" "}
          <h2>Lista de productos y Stock total</h2>
          <ul>
            {productos.map((producto) => (
              <li key={producto._id}>
                {producto.nombre}
                <button onClick={() => handleDeleteProducto(producto._id)}>
                  Borrar
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="div2"> Productos mas vendidos
        <MasVendido/>
        
        </div>
        <div className="div3"> Servicios mas solicitados 
        <MasVendidoS/>
        
        </div>
        <div className="div4">
          {" "}
          <h2>Añadir producto</h2>
          <ProductoNuevo />
        </div>
        <div className="div5">
          {" "}
          <h2>Detalles del producto</h2>
          <SingleProducto producto={singleProducto} />
        </div>
      </div>
    </main>
  );
}
