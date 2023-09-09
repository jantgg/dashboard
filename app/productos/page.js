"use client";
import Image from "next/image";
import "./page.css";
import { useEffect, useState } from "react";
import ProductoNuevo from "../components/crearProducto.js";
import SingleProducto from "../components/singleProducto.js";

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [singleProducto, setSingleProducto] = useState({
    nombre: "",
    descripcion: "",
    precioCompra: "",
    precioVenta: "",
    iva: "",
    numeroSerie: "",
    stock: "",
    vecesVendido: "",
    vecesComrpado:"",
  });

  useEffect(() => {
    document.title = "Productos";
    getProductos();
  }, []);

  const getProductos = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_DATABASE_URL}/product`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setProductos(data);
      if (data && data.length > 0) {
        setSingleProducto(data[0]);
      }
    } catch (error) {
      console.error("Error al obtener las productos:", error);
    }
  };

  // delete de productos-----------------------------------------------------------------------
  const deleteProducto = async (tareaId) => {
    try {
      const token = localStorage.getItem("token"); // Recuperar el token del localStorage

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
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Error al eliminar producto:", error);
    }
  };
  const handleDeleteProducto = (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      deleteProducto(id);
    }
  };

  return (
    <main className="home">
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
        <div className="div2"> Productos mas vendidos</div>
        <div className="div3"> Servicios mas solicitados </div>
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
