"use client";
import Image from "next/image";
import "./page.css";
import { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import useVentas from "../hooks/useVentas";
import generarPdf from "../hooks/generarPdf";
import useDownloadPDF from "../hooks/generarPdf";
import SingleCliente from "../components/ventaComponents/masVendido.js";
import MasVendido from "../components/ventaComponents/masVendido.js";
import MasVendidoS from "../components/ventaComponents/masVendidoS.js";
import ResumenVentas from "../components/ventaComponents/resumenVentas.js";
import ComparacionVentas from "../components/ventaComponents/comparacionVentas.js";
import HistorialVentas from "../components/ventaComponents/historialVentas.js";

export default function Ingresos() {
  const { ventas, singleVenta, setSingleVenta, loading, error, getVentas } =
    useVentas();

  return (
    <main className="home">
      <div className="parent">
        <div className="div1V">
          {" "}
          <ResumenVentas />
        </div>
        <div className="div2V">
          {" "}
          <ComparacionVentas />
        </div>
        <div className="div3V">
          <MasVendido />
        </div>
        <div className="div4V">
          {" "}
          <MasVendidoS />
        </div>
        <div className="div5V">
          <HistorialVentas />
        </div>
      </div>
    </main>
  );
}
