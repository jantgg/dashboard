"use client"
import React, { useState, useEffect } from "react";
import useVentas from "app/hooks/useVentas.js";
import VentasChart from "./ventasChart";
import "./comparacionVentas.css";

function ComparacionVentas() {
  const { ventas } = useVentas();
  const [selectedValue, setSelectedValue] = useState("cantidadNeta");

  // Cambiar resumenMensual a resumenDiario
  const [resumenDiario, setResumenDiario] = useState([]);
  useEffect(() => {
    const ahora = new Date();
    const mesActual = ahora.getMonth();
    const añoActual = ahora.getFullYear();
    const resumen = {};

    if (Array.isArray(ventas)) {
      ventas.forEach((venta) => {
        const fechaVenta = new Date(venta.fecha);
        if (fechaVenta.getMonth() === mesActual && fechaVenta.getFullYear() === añoActual) {
          const fechaClave = fechaVenta.toISOString().split('T')[0];

          if (!resumen[fechaClave]) {
            resumen[fechaClave] = {
              fecha: fechaClave,
              cantidadBruta: 0,
              cantidadNeta: 0,
            };
          }

          resumen[fechaClave].cantidadBruta += venta.cantidadBruta;
          resumen[fechaClave].cantidadNeta += venta.cantidadNeta;
        }
      });

      setResumenDiario(Object.values(resumen).sort((a, b) => new Date(a.fecha) - new Date(b.fecha)));
    }
  }, [ventas]);

  const chartData = resumenDiario.map((d) => {
    return {
      time: d.fecha,
      value: d[selectedValue],
    };
  });

  return (
    <section className="sectionVentasRVG">
      <h2 className="tittleVentasRVG">Ventas de este mes</h2>
      <div className="containerSelectorVentasRVG">
        <select
          value={selectedValue}
          onChange={(e) => setSelectedValue(e.target.value)}
          className="selectorVentasRVG"
        >
          <option value="cantidadNeta">Cantidad Neta</option>
          <option value="cantidadBruta">Cantidad Bruta</option>
        </select>
      </div>
      <VentasChart data={chartData} />
    </section>
  );
}

export default ComparacionVentas;
