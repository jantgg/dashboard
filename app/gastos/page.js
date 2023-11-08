"use client";
import Image from "next/image";
import "./page.css";
import { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import useGastos from "../hooks/useGastos";
import generarPdf from "../hooks/generarPdf";
import MasComprado from "../components/gastoComponents/masComprado.js";
import ResumenGastos from "../components/gastoComponents/resumenGastos.js";
import ComparacionGastos from "../components/gastoComponents/comparacionGastos.js";
import HistorialGastos from "../components/gastoComponents/historialGastos.js";
import HistorialGastosFijos from "../components/gastoComponents/historialGastosFijos.js";

export default function Gastos() {
  const { gastos} =
    useGastos();

  return (
    <main className="home">
      <div className="parent">
        <div className="div1G">
          {" "}
          <ResumenGastos />
        </div>
        <div className="div2G">
          {" "}
          <ComparacionGastos />
        </div>
        <div className="div3G">
          <MasComprado />
        </div>
        <div className="div4G">
          {" "}
          <HistorialGastosFijos />
        </div>
        <div className="div5G">
          <HistorialGastos />
        </div>
      </div>
    </main>
  );
}
