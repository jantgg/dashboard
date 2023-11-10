"useClient";
import React, { useState, useEffect } from "react";
import useClientes from "app/hooks/useClientes.js"; // Asegúrate de tener este hook
import  {useClientesContext}  from 'app/hooks/ClientesContext.js';
import { IoMdRefresh } from "react-icons/io";
import { FaRegTrashAlt } from "react-icons/fa";
import { MdReadMore } from "react-icons/md";
import "./listaCliente.css"


function ListaCliente() {
  const { clientes, singleCliente, setSingleCliente, fetchClientes } = useClientesContext();

  // delete de cliiente-----------------------------------------------------------------------
  const deleteCliente = async (tareaId) => {
    try {
      const token = localStorage.getItem("token"); // Recuperar el token del localStorage

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_DATABASE_URL}/clients/${tareaId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        getClientes();
        toast.success("Cliente eliminado con éxito!");
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Error al eliminar Cliente:", error);
      toast.error(`Error al eliminar Cliente: ${error.message}`);
    }
  };

  const handleDeleteCliente = (id) => {
    if (
      window.confirm(
        "¿Estás seguro de que deseas eliminar este Cliente? Se elimanarán sus ventas relacionadas y se restablecerá el stock de dichas ventas."
      )
    ) {
      deleteCliente(id);
    }
  };

  return (
    <section className="sectionLC">
      <header className="headerLC">
        {" "}
        <h2 className="tittleLC">Lista de clientes </h2>
        <button
          className="refreshLC"
          onClick={() => {
            getClientes();
          }}
        >
          <span>
            <IoMdRefresh />
          </span>
        </button>
      </header>

      <ul className="listaLC">
        {Array.isArray(clientes) &&
          clientes.map((cliente) => (
            <li key={cliente._id} className="clienteLC">
              <div className="listaleftcontainerLC">
                {" "}
                <span className="listanombreLC"> {cliente.nombre}</span>
                <span className="listadescripcionLC">
                  {" "}
                  {cliente.ventasTotales}€
                </span>
              </div>
              <div className="buttonscontainerLC">
                {" "}
                <button
                  className="detailsLC"
                  onClick={() => setSingleCliente(cliente)}
                >
                  <MdReadMore />
                </button>
                <button
                  className="trashLC"
                  onClick={() => handleDeleteCliente(cliente._id)}
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

export default ListaCliente;
