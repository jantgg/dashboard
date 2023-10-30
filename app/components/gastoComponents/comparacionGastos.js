"use client";
import React, { useState, useEffect } from "react";
import useGastos from "app/hooks/useGastos.js";
import GastosChart from "./gastosChart";
import "./comparacionGastos.css";

function ComparacionGastos() {
  const { gastos } = useGastos();
  const [selectedValue, setSelectedValue] = useState("cantidadNeta");

  const [resumenMensual, setResumenMensual] = useState([]);
  useEffect(() => {
    const resumen = {};

    if (Array.isArray(gastos)) {
      gastos.forEach((gasto) => {
        const fechaGasto = new Date(gasto.fecha);
        const mesAño = `${fechaGasto.getMonth()}-${fechaGasto.getFullYear()}`;

        if (!resumen[mesAño]) {
          resumen[mesAño] = {
            mes: fechaGasto.getMonth(),
            year: fechaGasto.getFullYear(),
            cantidadBruta: 0,
            cantidadNeta: 0,
          };
        }

        resumen[mesAño].cantidadBruta += gasto.cantidadBruta;
        resumen[mesAño].cantidadNeta += gasto.cantidadNeta;
      });

      setResumenMensual(Object.values(resumen));
    }
  }, [gastos]);
  console.log(resumenMensual);

  const chartData = resumenMensual.map((d) => {
    return {
      time: `${d.year}-${String(d.mes + 1).padStart(2, "0")}-01`, // Ajustado para representar correctamente el mes/año
      value: d[selectedValue],
    };
  });

  console.log(chartData);

  return (
    <section className="sectionGastosRVG">

        {" "}
        <h2 className="tittleGastosRVG"> Resumen Mensual de Gastos</h2>
        <div className="containerSelectorGastosRVG">   <select
          value={selectedValue}
          onChange={(e) => setSelectedValue(e.target.value)}
          className="selectorGastosRVG"
        >
          <option value="cantidadNeta">Cantidad Neta</option>
          <option value="cantidadBruta">Cantidad Bruta</option>
        </select></div>
     


      <GastosChart data={chartData} />
    </section>
  );
}

export default ComparacionGastos;
