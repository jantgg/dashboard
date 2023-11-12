"useClient";
import React, { useState, useEffect } from "react";
import { useProductosContext } from "app/hooks/ProductosContext.js";
import { IoMdRefresh } from "react-icons/io";
import { FaRegTrashAlt } from "react-icons/fa";
import { MdReadMore } from "react-icons/md";
import "./listaProducto.css";

function ListaProducto() {
  const { productos, setSingleProducto, fetchProductos } =
    useProductosContext();

  const deleteProducto = async (productoId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_DATABASE_URL}/product/${productoId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        fetchProductos();
        toast.success("Producto eliminado con éxito!");
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Error al eliminar Producto:", error);
      toast.error(`Error al eliminar Producto: ${error.message}`);
    }
  };

  const handleDeleteProducto = (id) => {
    if (
      window.confirm(
        "¿Estás seguro de que deseas eliminar este Producto? Se elimanarán sus ventas relacionadas y se restablecerá el stock de dichas ventas."
      )
    ) {
      deleteProducto(id);
    }
  };

  return (
    <section className="sectionLPR">
      <header className="headerLPR">
        {" "}
        <h2 className="tittleLPR">Lista de Productos </h2>
        <button
          className="refreshLPR"
          onClick={() => {
            fetchProductos();
          }}
        >
          <span>
            <IoMdRefresh />
          </span>
        </button>
      </header>

      <ul className="listaLPR">
        {Array.isArray(productos) &&
          productos.map((producto) => (
            <li key={producto._id} className="productoLPR">
              <div className="listaleftcontainerLPR">
                {" "}
                <span className="listanombreLPR"> {producto.nombre}</span>
                <span className="listadescripcionLPR">
                  {" "}
                  {producto.precioVenta}€
                </span>
              </div>
              <div className="buttonscontainerLPR">
                {" "}
                <button
                  className="detailsLPR"
                  onClick={() => setSingleProducto(producto)}
                >
                  <MdReadMore />
                </button>
                <button
                  className="trashLPR"
                  onClick={() => handleDeleteProducto(producto._id)}
                >
                  <FaRegTrashAlt />
                </button>
              </div>
            </li>
          ))}
      </ul>
    </section>
  );
}

export default ListaProducto;
