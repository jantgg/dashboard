"use client";
import React, { useState } from "react";
import "./crearProveedor.css";
import { Toaster, toast } from "sonner";
import { useClientesContext } from "app/hooks/ClientesContext.js";
import { BsFillPersonFill } from "react-icons/bs";
import { FaRegAddressCard } from "react-icons/fa";
import { BsHouseDoorFill } from "react-icons/bs";
import { BsFillTelephoneFill } from "react-icons/bs";
import { TbMailFilled } from "react-icons/tb";

function ProveedorNuevo() {
  const { fetchClientes } = useClientesContext();
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
        fetchProveedores();
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
    <section className="sectionaddP">
      <h2>Añadir Proveedor</h2>
      <div className="inputgroupAP">
        <span className="iconAP">
          <BsFillPersonFill />
        </span>
        <input
          placeholder="Nombre"
          className="inputAP"
          type="text"
          value={proveedorData.nombre}
          onChange={(e) =>
            setProveedorData((prev) => ({ ...prev, nombre: e.target.value }))
          }
          autoComplete="nope"
        />
      </div>
      <div className="inputgroupAP">
        <span className="iconAP">
          <FaRegAddressCard />
        </span>
        <input
          placeholder="Cif"
          className="inputAP"
          value={proveedorData.cif}
          onChange={(e) =>
            setProveedorData((prev) => ({
              ...prev,
              cif: e.target.value,
            }))
          }
          autoComplete="nope"
        />
      </div>
      <div className="inputgroupAP">
        <span className="iconAP">
          <BsHouseDoorFill />
        </span>
        <input
          placeholder="Dirección"
          className="inputAP"
          value={proveedorData.direccion}
          onChange={(e) =>
            setProveedorData((prev) => ({
              ...prev,
              direccion: e.target.value,
            }))
          }
          autoComplete="nope"
        />
      </div>
      <div className="inputgroupAP">
        <span className="iconAP">
          <BsFillTelephoneFill />
        </span>
        <input
          placeholder="Teléfono"
          className="inputAP"
          value={proveedorData.telefono}
          onChange={(e) =>
            setProveedorData((prev) => ({
              ...prev,
              telefono: e.target.value,
            }))
          }
          autoComplete="nope"
        />
      </div>
      <div className="inputgroupAP">
        <span className="iconAP">
          <TbMailFilled />
        </span>
        <input
          placeholder="Email"
          className="inputAP"
          value={proveedorData.email}
          onChange={(e) =>
            setProveedorData((prev) => ({
              ...prev,
              email: e.target.value,
            }))
          }
          autoComplete="nope"
        />
      </div>

      <button className="buttonAP" onClick={() => addProveedor(proveedorData)}>
        Añadir
      </button>
    </section>
  );
}
export default ProveedorNuevo;
