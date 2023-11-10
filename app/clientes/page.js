"use client";
import Image from "next/image";
import "./page.css";
import { useEffect, useState } from "react";
import ClienteNuevo from "../components/crearCliente.js";
import SingleCliente from "../components/singleCliente.js";
import ComparacionClientes from "../components/comparacionClientes.js";
import ListaCliente from "../components/clienteComponents/listaCliente.js";
import { Toaster, toast } from "sonner";
import useClientes from "../hooks/useClientes";

export default function Clientes() {
  const {
    clientes,
    singleCliente,
    setSingleCliente,
    loading,
    error,
    getClientes,
  } = useClientes();

  useEffect(() => {
    document.title = "clientes";
  }, []);

  return (
    <main className="home">
      <Toaster />
      <div className="parentC">
        <div className="div1C">
          <ListaCliente />
        </div>
        <div className="div2C">
          <SingleCliente cliente={singleCliente} />
        </div>
        <div className="div3C">
          {" "}
          <ClienteNuevo />
       
        </div>
        <div className="div4C">
          Incremento de clientes por mes
          <ComparacionClientes />
        </div>
      </div>
    </main>
  );
}
