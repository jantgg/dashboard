"use client";
import React, { useState } from "react";
import "./crearProducto.css";
import { Toaster, toast } from "sonner";
import useClientes from "../hooks/useClientes";

function ClienteNuevo() {
  const { clientes, singleCliente, setSingleCliente, loading, error, getClientes } = useClientes();

  const [clienteData, setClienteData] = useState({
    nombre: "",
    cif: "",
    direccion: "",
    telefono: "",
    email: "",
  });

  const addCliente = async (clienteData) => {
    try {
      const token = localStorage.getItem("token"); // Recuperar el token del localStorage
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_DATABASE_URL}/clients`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(clienteData),
        }
      );
      const data = await response.json();
      if (response.ok) {
        toast.success("Cliente creado con éxito!");
        setClienteData({
          nombre: "",
          cif: "",
          direccion: "",
          telefono: "",
          email: "",
        });
        getClientes();
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Error al añadir cliente:", error);
      toast.error(`Error al añadir Cliente: ${error.message}`);
    }
  };

  return (
    <div>
      <Toaster/>
      <label>
        Nombre:
        <input
          type="text"
          value={clienteData.nombre}
          onChange={(e) =>
            setClienteData((prev) => ({ ...prev, nombre: e.target.value }))
          }
        />
      </label>

      <label>
        cif:
        <textarea
          value={clienteData.cif}
          onChange={(e) =>
            setClienteData((prev) => ({
              ...prev,
              cif: e.target.value,
            }))
          }
        />
      </label>

      <label>
        direccion:
        <input
          value={clienteData.direccion}
          onChange={(e) =>
            setClienteData((prev) => ({
              ...prev,
              direccion: e.target.value,
            }))
          }
        />
      </label>

      <label>
        telefono:
        <input
          value={clienteData.telefono}
          onChange={(e) =>
            setClienteData((prev) => ({
              ...prev,
              telefono: e.target.value,
            }))
          }
        />
      </label>

      <label>
        email:
        <input
          value={clienteData.email}
          onChange={(e) =>
            setClienteData((prev) => ({
              ...prev,
              email: e.target.value,
            }))
          }
        />
      </label>

      <button onClick={() => addCliente(clienteData)}>Añadir cliente</button>
    </div>
  );
}
export default ClienteNuevo;
