"use client";
import Image from "next/image";
import "./page.css";
import { useEffect, useState } from "react";
import ClienteNuevo from "../components/crearCliente.js";
import SingleCliente from "../components/singleCliente.js";
import { Toaster, toast } from "sonner";
import useClientes from "../hooks/useClientes";

export default function Clientes() {
  const { clientes, singleCliente, setSingleCliente, loading, error, getClientes } = useClientes();


  useEffect(() => {
    document.title = "clientes";
  }, []);

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
    if (window.confirm("¿Estás seguro de que deseas eliminar este Cliente?")) {
      deleteCliente(id);
    }
  };

  return (
    <main className="home">
      <Toaster/>
      <div className="parent">
        <div className="div1">
          <h2>Lista de clientes </h2>
          <button
            onClick={() => {
              getClientes();
            }}
          >
            Refresh
          </button>
          <ul>
          {Array.isArray(clientes) &&
              clientes.map((cliente) => (
              <li key={cliente._id}>
                {cliente.nombre}
                <button onClick={() => handleDeleteCliente(cliente._id)}>
                  Borrar
                </button>
                <button onClick={() => setSingleCliente(cliente)}>
                  Detalles
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="div2">Incremento de clientes por mes </div>
        <div className="div3">
          {" "}
          <h2>
            Vista detallada del cliente con Historial de compra del cliente
          </h2>
          <SingleCliente cliente={singleCliente} />
        </div>
        <div className="div4">
          {" "}
          <h2>Añadir Cliente</h2>
          <ClienteNuevo />
        </div>
      </div>
    </main>
  );
}
