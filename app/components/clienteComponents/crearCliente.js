"use client";
import React, { useState } from "react";
import "./crearCliente.css";
import { Toaster, toast } from "sonner";
import { useClientesContext } from "app/hooks/ClientesContext.js";
import { BsFillPersonFill } from "react-icons/bs";
import {FaRegAddressCard} from "react-icons/fa";
import {BsHouseDoorFill}from "react-icons/bs";
import {BsFillTelephoneFill}from "react-icons/bs";
import {TbMailFilled}from "react-icons/tb";


function ClienteNuevo() {
  const { fetchClientes } = useClientesContext();

  const [clienteData, setClienteData] = useState({
    nombre: "",
    cif: "",
    direccion: "",
    telefono: "",
    email: "",
    fechaRegistro: "", //
  });

  const addCliente = async () => {
    const fechaActual = new Date().toISOString().split("T")[0];
    const updatedClienteData = {
      ...clienteData,
      fechaRegistro: fechaActual,
    };

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_DATABASE_URL}/clients`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedClienteData),
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
        fetchClientes();
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Error al añadir cliente:", error);
      toast.error(`Error al añadir Cliente: ${error.message}`);
    }
  };

  return (
    <section className="sectionaddC">
      <h2 className="green-bg">Añadir cliente</h2>
      <div className="inputgroupAC">
        <span className="iconAC">
          <BsFillPersonFill />
        </span>
        <input
          placeholder="Nombre"
          className="inputAC"
          type="text"
          value={clienteData.nombre}
          onChange={(e) =>
            setClienteData((prev) => ({ ...prev, nombre: e.target.value }))
          }
          autoComplete="nope"
        />
      </div>
      <div className="inputgroupAC">
        <span className="iconAC">
          <FaRegAddressCard />
        </span>
        <input
          placeholder="Cif"
          className="inputAC"
          value={clienteData.cif}
          onChange={(e) =>
            setClienteData((prev) => ({
              ...prev,
              cif: e.target.value,
            }))
          }
          autoComplete="nope"
        />
      </div>
      <div className="inputgroupAC">
        <span className="iconAC">
          <BsHouseDoorFill/>
        </span>
        <input
          placeholder="Dirección"
          className="inputAC"
          value={clienteData.direccion}
          onChange={(e) =>
            setClienteData((prev) => ({
              ...prev,
              direccion: e.target.value,
            }))
          }
          autoComplete="nope"
        />
      </div>
      <div className="inputgroupAC">
        <span className="iconAC">
          <BsFillTelephoneFill/>
        </span>
        <input
          placeholder="Teléfono"
          className="inputAC"
          value={clienteData.telefono}
          onChange={(e) =>
            setClienteData((prev) => ({
              ...prev,
              telefono: e.target.value,
            }))
          }
          autoComplete="nope"
        />
      </div>
      <div className="inputgroupAC">
        <span className="iconAC">
          <TbMailFilled />
        </span>
        <input
          placeholder="Email"
          className="inputAC"
          value={clienteData.email}
          onChange={(e) =>
            setClienteData((prev) => ({
              ...prev,
              email: e.target.value,
            }))
          }
          autoComplete="nope"
        />
      </div>

      <button className="buttonAC green-bg" onClick={() => addCliente(clienteData)}>
        Añadir
      </button>
    </section>
  );
}
export default ClienteNuevo;
