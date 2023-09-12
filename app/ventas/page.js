"use client";
import Image from "next/image";
import "./page.css";
import { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import useVentas from "../hooks/useVentas";
import generarPdf from "../hooks/generarPdf";
import useDownloadPDF from "../hooks/generarPdf";

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
        <div className="div5">
          <h2>
            Historial de ingresos a lo largo del tiempo con facturas y clientes
          </h2>

          {loading && <p>Cargando ventas...</p>}
          {error && <p>Error al cargar ventas: {error.message}</p>}
          {!loading && !error && ventas && ventas.length === 0 && (
            <p>No hay ventas registradas.</p>
          )}
          {ventas &&
            ventas.map((venta) => (
              <div key={venta._id} className="ventaItem">
                <p>Descripción de la venta: {venta.descripcion}</p>{" "}
                {/* Asume que tienes una descripción, ajusta según tu modelo */}
                <p>Cliente: {venta.cliente}</p>{" "}
                {/* Asume que tienes un campo cliente, ajusta según tu modelo */}
                <button onClick={() => generarPdf(venta.factura)}>
                  Descargar Factura
                </button>
              </div>
            ))}
        </div>
      </div>
    </main>
  );
}
