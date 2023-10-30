"use client";
import React, { useState, useEffect } from "react";
import useVentas from "app/hooks/useVentas.js";
import VentasChart from "./ventasChart";
import "./comparacionVentas.css";

function ComparacionVentas() {
  const { ventas } = useVentas();
  const [selectedValue, setSelectedValue] = useState("cantidadNeta");

  const [resumenMensual, setResumenMensual] = useState([]);
  useEffect(() => {
    const resumen = {};

    if (Array.isArray(ventas)) {
      ventas.forEach((venta) => {
        const fechaVenta = new Date(venta.fecha);
        const mesAño = `${fechaVenta.getMonth()}-${fechaVenta.getFullYear()}`;

        if (!resumen[mesAño]) {
          resumen[mesAño] = {
            mes: fechaVenta.getMonth(),
            year: fechaVenta.getFullYear(),
            cantidadBruta: 0,
            cantidadNeta: 0,
          };
        }

        resumen[mesAño].cantidadBruta += venta.cantidadBruta;
        resumen[mesAño].cantidadNeta += venta.cantidadNeta;
      });

      setResumenMensual(Object.values(resumen));
    }
  }, [ventas]);
  console.log(resumenMensual);

  const chartData = resumenMensual.map((d) => {
    return {
      time: `${d.year}-${String(d.mes + 1).padStart(2, "0")}-01`, // Ajustado para representar correctamente el mes/año
      value: d[selectedValue],
    };
  });

  return (
    <section className="sectionVentasRVG">
      {" "}
      <h2 className="tittleVentasRVG"> Resumen Mensual de Ventas</h2>
      <div className="containerSelectorVentasRVG">
        {" "}
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
