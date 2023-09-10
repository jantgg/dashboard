"use client"
import Image from "next/image";
import "./page.css";
import { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import useVentas from "../hooks/useVentas";

export default function Ingresos() {
  const { ventas, singleVenta, setSingleVenta, loading, error, getVentas } =
    useVentas();


  return (
    <main className="home">
      <div className="parent">
        <div className="div1"> Resumen</div>
        <div className="div2"> Comparacion ingresos con meses anteriores</div>
        <div className="div3"> Producto mas vendido</div>
        <div className="div4"> Servicio mas vendido</div>
        <div className="div5"> Historial de ingresos a lo largo del tiempo con facturas y clientes</div>
      </div>
    </main>
  );
}
