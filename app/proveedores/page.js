"use client";
import Image from "next/image";
import "./page.css";
import { useEffect, useState } from "react";
import ProveedorNuevo from "../components/proveedorComponents/crearProveedor.js";
import SingleProveedor from "../components/proveedorComponents/singleProveedor.js";
import ListaProveedor from "../components/proveedorComponents/listaProveedor.js";
import ComparacionGastos from "../components/gastoComponents/comparacionGastos.js";
import { Toaster, toast } from "sonner";
import { ProveedoresProvider } from "../hooks/ProveedoresContext";
import useProveedores from "../hooks/useProveedores.js";

export default function Proveedores() {
  const {
    proveedores,
    singleProveedor,
    setSingleProveedor,
    loading,
    error,
    getProveedores,
  } = useProveedores();

  useEffect(() => {
    document.title = "Proveedores";
    console.log(singleProveedor);
  }, []);

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
    <ProveedoresProvider>
      {" "}
      <main className="home">
        <div className="parentP">
          <div className="div1P">
            <ListaProveedor />
          </div>
      
          <div className="div2P">
            {" "}
     
            <SingleProveedor proveedor={singleProveedor} />
          </div>
          <div className="div3P">
            {" "}
            <h2>Añadir Proveedor</h2>
            <ProveedorNuevo />
          </div>    <div className="div4P">
            <ComparacionGastos />
          </div>
        </div>
      </main>
    </ProveedoresProvider>
  );
}
