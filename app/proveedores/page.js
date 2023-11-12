"use client";
import Image from "next/image";
import "./page.css";
import { useEffect, useState } from "react";
import ProveedorNuevo from "../components/proveedorComponents/crearProveedor.js";
import SingleProveedor from "../components/proveedorComponents/singleProveedor.js";
import ListaProveedor from "../components/proveedorComponents/listaProveedor.js";
import GraficaGastos from "../components/proveedorComponents/graficaGastos.js";
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
  }, []);


  return (
    <ProveedoresProvider>
      {" "}
      <main className="home">
        <div className="parentP">
          <div className="div1P">
            <ListaProveedor />
          </div>
          <div className="div2P">
            <SingleProveedor />
          </div>
          <div className="div3P">
            <ProveedorNuevo />
          </div>{" "}
          <div className="div4P">
            <GraficaGastos />
          </div>
        </div>
      </main>
    </ProveedoresProvider>
  );
}
