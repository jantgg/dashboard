// components/Sidebar.js

import React from "react";
import Link from "next/link";
import styles from "./sidebar.css";

const Sidebar = () => {
  return (
    <section className="sidebar-father">
      {" "}
      <div className="sidebar">
       
          <Link className="list-son" href="/resumen">Resumen</Link>
      
       
          <Link className="list-son" href="/ventas">Ventas</Link>
      
  
          <Link className="list-son" href="/gastos">Gastos</Link>
      
       
          <Link className="list-son" href="/tareas">Tareas</Link>
      
       
          <Link className="list-son" href="/clientes">Clientes</Link>
      
       
          <Link className="list-son" href="/proveedores">Proveedores</Link>
      
       
          <Link className="list-son" href="/productos">Productos</Link>
      
   
       
          <Link className="list-son" href="/sumar">Añadir</Link>
      
       
          <Link className="list-son" href="/">Cerrar</Link>
      
      </div>
    </section>
  );
};

export default Sidebar;
