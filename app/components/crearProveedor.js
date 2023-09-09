"use client";
import React, { useState } from "react";
import "./crearProveedor.css";

function ProveedorNuevo() {
  const [proveedorData, setProveedorData] = useState({
    nombre: "",
    cif: "",
    direccion: "",
    telefono: "",
    email: "",
  });

  const addProveedor = async (proveedorData) => {
    try {
      const token = localStorage.getItem("token"); // Recuperar el token del localStorage

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_DATABASE_URL}/suppliers`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(proveedorData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Limpiar el formulario
        setProveedorData({
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
      console.error("Error al añadir Proveedor:", error);
    }
  };

  const getProveedores = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_DATABASE_URL}/suppliers`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setProveedores(data);
    } catch (error) {
      console.error("Error al obtener las Proveedores:", error);
    }
  };

  return (
    <div>
      <label>
        Nombre:
        <input
          type="text"
          value={proveedorData.nombre}
          onChange={(e) =>
            setProveedorData((prev) => ({ ...prev, nombre: e.target.value }))
          }
        />
      </label>

      <label>
        cif:
        <textarea
          value={proveedorData.cif}
          onChange={(e) =>
            setProveedorData((prev) => ({
              ...prev,
              cif: e.target.value,
            }))
          }
        />
      </label>

      <label>
        direccion:
        <input
          value={proveedorData.direccion}
          onChange={(e) =>
            setProveedorData((prev) => ({
              ...prev,
              direccion: e.target.value,
            }))
          }
        />
      </label>

      <label>
        telefono:
        <input
          value={proveedorData.telefono}
          onChange={(e) =>
            setProveedorData((prev) => ({
              ...prev,
              telefono: e.target.value,
            }))
          }
        />
      </label>

      <label>
       email:
        <input
          value={proveedorData.email}
          onChange={(e) =>
            setProveedorData((prev) => ({
              ...prev,
              email: e.target.value,
            }))
          }
        />
      </label>

      <button onClick={() => addProveedor(  proveedorData)}>Añadir Proveedor</button>
    </div>
  );
}
export default ProveedorNuevo;
