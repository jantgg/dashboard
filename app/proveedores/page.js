"use client";
import Image from "next/image";
import "./page.css";
import { useEffect, useState } from "react";
import ProveedorNuevo from "../components/crearProveedor.js";
import SingleProveedor from "../components/singleProveedor.js";
import ComparacionGastos from "../components/gastoComponents/comparacionGastos.js";
import { Toaster, toast } from "sonner";
import useProveedores from "../hooks/useProveedores.js";

export default function Proveedores() {
  const { proveedores, singleProveedor, setSingleProveedor, loading, error, getProveedores } =
    useProveedores();

  useEffect(() => {
    document.title = "Proveedores";
    console.log(singleProveedor)
  }, []);

  // delete de cliiente-----------------------------------------------------------------------
  const deleteProveedor = async (tareaId) => {
    try {
      const token = localStorage.getItem("token"); // Recuperar el token del localStorage

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_DATABASE_URL}/suppliers/${tareaId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        toast.success("Proveedor eliminado con éxito!");
        getProveedores();
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Error al eliminar Proveedor:", error);
      toast.error(`Error al eliminar Proveedor: ${error.message}`);
    }
  };
  const handleDeleteProveedor = (id) => {
    if (
      window.confirm("¿Estás seguro de que deseas eliminar este Proveedor?")
    ) {
      deleteProveedor(id);
    }
  };

  return (
    <main className="home">
      <Toaster />
      <div className="parent">
        <div className="div1">
          {" "}
          <h2>Lista de proveedores </h2>
          <button
            onClick={() => {
              getProveedores();
            }}
          >
            Refresh
          </button>
          <ul>
            {proveedores.map((proveedor) => (
              <li key={proveedor._id}>
                {proveedor.nombre}
                <button onClick={() => handleDeleteProveedor(proveedor._id)}>
                  Borrar
                </button>
                <button onClick={() => setSingleProveedor(proveedor)}>
                  Detalles
                </button>
              </li>
            ))}
          </ul>{" "}
        </div>
        <div className="div2">Gasto en proveedores por mes
        <ComparacionGastos/>
   
         </div>
        <div className="div3">
          {" "}
          <h2>
            Vista detallada del proveedor con Historial de compra del proveedor
          </h2>
          <SingleProveedor proveedor={singleProveedor} />
        </div>
        <div className="div4">
          {" "}
          <h2>Añadir Proveedor</h2>
          <ProveedorNuevo />
        </div>
      </div>
    </main>
  );
}
