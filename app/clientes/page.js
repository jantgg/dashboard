"use client";
import Image from "next/image";
import "./page.css";
import { useEffect, useState } from "react";
import ClienteNuevo from "../components/clienteComponents/crearCliente.js";
import SingleCliente from "app/components/clienteComponents/singleCliente.js";
import ComparacionClientes from "../components/comparacionClientes.js";
import ListaCliente from "../components/clienteComponents/listaCliente.js";
import { Toaster, toast } from "sonner";
import useClientes from "../hooks/useClientes";
import { ClientesProvider } from "../hooks/ClientesContext";
import  {useClientesContext}  from 'app/hooks/ClientesContext.js';

export default function Clientes() {
  const { clientes, singleCliente, setSingleCliente, fetchClientes } = useClientesContext();

  useEffect(() => {
    document.title = "clientes";
    fetchClientes();
  }, []);

  return (
    <ClientesProvider>
      {" "}
      <main className="home">
        <Toaster />
        <div className="parentC">
          <div className="div1C">
            <ListaCliente />
          </div>
          <div className="div2C">
            <SingleCliente />
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
    </ClientesProvider>
  );
}
