"use client";
import React, { useState } from "react";
import "./crearProducto.css";

function ClienteNuevo() {
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
        // Limpiar el formulario
        setClienteData({
            nombre: "",
            cif: "",
            direccion: "",
            telefono: "",
            email: "",
        });
   
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Error al añadir cliente:", error);
    }
  };

  const getClientes = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_DATABASE_URL}/clients`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setClientes(data);
    } catch (error) {
      console.error("Error al obtener las clientes:", error);
    }
  };

  return (
    <div>
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
