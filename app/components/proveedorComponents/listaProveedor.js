"useClient";
import React, { useState, useEffect } from "react";
import  {useProveedoresContext}  from 'app/hooks/ProveedoresContext.js';
import { IoMdRefresh } from "react-icons/io";
import { FaRegTrashAlt } from "react-icons/fa";
import { MdReadMore } from "react-icons/md";
import "./listaProveedor.css"


function ListaProveedor() {
  const { proveedores, setSingleProveedor, fetchProveedores } = useProveedoresContext();

  
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
        fetchProveedores();
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
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
    <section className="sectionLP">
      <header className="headerLP">
        {" "}
        <h2 className="tittleLP">Proveedores</h2>
        <button
          className="refreshLP"
          onClick={() => {
            fetchProveedores();
          }}
        >
          <span>
            <IoMdRefresh />
          </span>
        </button>
      </header>

      <ul className="listaLP">
        {Array.isArray(proveedores) &&
          proveedores.map((proveedor) => (
            <li key={proveedor._id} className="proveedorLP">
              <div className="listaleftcontainerLP">
                {" "}
                <span className="listanombreLP"> {proveedor.nombre}</span>
                <span className="listadescripcionLP">
                  {" "}
                  {proveedor.ventasTotales}€
                </span>
              </div>
              <div className="buttonscontainerLP">
                {" "}
                <button
                  className="detailsLP"
                  onClick={() => setSingleProveedor(proveedor)}
                >
                  <MdReadMore />
                </button>
                <button
                  className="trashLP"
                  onClick={() => handleDeleteProveedor(proveedor._id)}
                >
                  <FaRegTrashAlt />
                </button>
              </div>
            </li>
          ))}
      </ul>
    </section>
  );
}

export default ListaProveedor;
