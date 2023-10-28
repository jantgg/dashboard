// components/Sidebar.js

import React from "react";
import Link from "next/link";
import styles from "./sidebar.css";

const Sidebar = () => {
  return (
    <section className="sidebar-father">
      {" "}
      <div className="sidebar">
        <div className="list-son">
          <a href="/resumen">Resumen</a>
        </div>
        <div className="list-son">
          <Link href="/ventas">Ventas</Link>
        </div>
        <div className="list-son">
          <Link href="/gastos">Gastos</Link>
        </div>
        <div className="list-son">
          <Link href="/tareas">Tareas</Link>
        </div>
        <div className="list-son">
          <Link href="/clientes">Clientes</Link>
        </div>
        <div className="list-son">
          <Link href="/proveedores">Proveedores</Link>
        </div>
        <div className="list-son">
          <Link href="/productos">Productos</Link>
        </div>
   
        <div className="list-son">
          <Link href="/sumar">Añadir</Link>
        </div>
        <div className="list-son">
          <Link href="/">Cerrar</Link>
        </div>
      </div>
    </section>
  );
};

export default Sidebar;
