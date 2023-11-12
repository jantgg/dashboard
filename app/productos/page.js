"use client";
import Image from "next/image";
import "./page.css";
import { useEffect, useState } from "react";
import ProductoNuevo from "../components/crearProducto.js";
import SingleProducto from "../components/productoComponents/singleProducto.js";
import MasVendido from "../components/ventaComponents/masVendido.js";
import MasVendidoS from "../components/ventaComponents/masVendidoS.js";
import ListaProducto from "../components/productoComponents/listaProducto.js";
import useProductos from "../hooks/useProductos";
import { Toaster, toast } from "sonner";
import { ProductosProvider } from "../hooks/ProductosContext";

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
    <ProductosProvider>
      {" "}
      <main className="home">
        <div className="parent">
          <div className="div1PR">
            {" "}
            <ListaProducto />
          </div>
          <div className="div4PR">
            <MasVendido />
          </div>
          <div className="div5PR">
            <MasVendidoS />
          </div>
          <div className="div3PR">
            <ProductoNuevo />
          </div>
          <div className="div2PR">
            <SingleProducto producto={singleProducto} />
          </div>
        </div>
      </main>
    </ProductosProvider>
  );
}
