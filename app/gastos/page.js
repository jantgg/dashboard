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

export default function Gastos() {
  const { gastos} =
    useGastos();

  return (
    <main className="home">
      <div className="parent">
        <div className="div1">
          {" "}
          <ResumenGastos />
        </div>
        <div className="div2">
          {" "}
          <ComparacionGastos />
        </div>
        <div className="div3">
          <MasComprado />
        </div>
        <div className="div4">
          {" "}
      
        </div>
        <div className="div5">
          <HistorialGastos />
        </div>
      </div>
    </main>
  );
}
