"use client";
import React, { useState } from "react";
import "./crearProveedor.css";
import useProveedores from "../../hooks/useProveedores";
import { Toaster, toast } from "sonner";

function ProveedorNuevo() {
  const {
    proveedores,
    singleProveedor,
    setSingleProveedor,
    loading,
    error,
    getProveedores,
  } = useProveedores();

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
        toast.success("Proveedor añadido con éxito!");
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Error al añadir Proveedor:", error);
      toast.error(`Error al añadir proveedor: ${error.message}`);
    }
  };

  return (
    <div>
      <Toaster/>
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

      <button onClick={() => addProveedor(proveedorData)}>
        Añadir Proveedor
      </button>
    </div>
  );
}
export default ProveedorNuevo;
