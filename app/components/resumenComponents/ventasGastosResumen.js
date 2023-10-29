"use client";
import React, { useState, useEffect, useRef } from "react";
import { createChart } from "lightweight-charts";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Estilos para el datepicker
import useVentas from "app/hooks/useVentas.js";
import useGastos from "app/hooks/useGastos.js";
import "./ventasGastosResumen.css";
import { BsArrowUp } from "react-icons/bs";
import { BsArrowDown } from "react-icons/bs";

function VentasGastosResumen() {
  const { ventas } = useVentas();
  const { gastos } = useGastos();

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  // Filtra las ventas basadas en el mes y año seleccionados
  const ventasDelMes = ventas.filter((venta) => {
    const fechaVenta = new Date(venta.fecha);
    return (
      fechaVenta.getMonth() === selectedMonth &&
      fechaVenta.getFullYear() === selectedYear
    );
  });

  const gastosDelMes = gastos.filter((gasto) => {
    const fechaGasto = new Date(gasto.fecha);
    return (
      fechaGasto.getMonth() === selectedMonth &&
      fechaGasto.getFullYear() === selectedYear
    );
  });

  // Calcula la suma total de cantidadNeta para ventas y gastos
  const totalVentas = ventasDelMes.reduce(
    (sum, venta) => sum + venta.cantidadNeta,
    0
  );

  const totalGastos = gastosDelMes.reduce(
    (sum, gasto) => sum + gasto.cantidadNeta,
    0
  );
  const roundedVentas = Math.round(totalVentas);
  const roundedGastos = Math.round(totalGastos);
  const roundedTotal = Math.round(totalVentas - totalGastos);

  const handleMonthChange = (e) => {
    setSelectedMonth(Number(e.target.value));
  };

  const handleYearChange = (e) => {
    setSelectedYear(Number(e.target.value));
  };
  const maxValue = Math.max(totalVentas, totalGastos);

  const ventasPercentage = (totalVentas / maxValue) * 100;
  const gastosPercentage = (totalGastos / maxValue) * 100;

  return (
    <section className="sectionRVG">
      <h2 className="h2RVG">Balance general</h2>
      <div className="selectorscontainer1RVG">
        <select
          className="selectors1SVG"
          value={selectedMonth}
          onChange={handleMonthChange}
        >
          {monthNames.map((month, index) => (
            <option key={index} value={index} className="txt-black">
              {month}
            </option>
          ))}
        </select>

        <select
          className="selectors1SVG"
          value={selectedYear}
          onChange={handleYearChange}
        >
          {Array.from({ length: 10 }, (_, i) => currentYear - i).map((year) => (
            <option key={year} value={year} className="txt-black">
              {year}
            </option>
          ))}
        </select>
      </div>

      <div className="bottomcontainerRVG">
      <div className="tower-container">
          <div
            className="tower1RVG"
            style={{ height: `${ventasPercentage}%` }}
          ></div>
          <div
            className="tower2RVG"
            style={{ height: `${gastosPercentage}%` }}
          ></div>
        </div>
        <div className="numeros1RVG">
          <div className="containerVentasRVG">
            <span className="number1RVG">
              {roundedVentas} <span className="euro1RVG">€</span>
            </span>
            <span className="flechaup">
              <BsArrowUp />
            </span>
          </div>
          <div className="containerGastosRVG">
            <span className="number1RVG">
              {roundedGastos} <span className="euro1RVG">€</span>
            </span>
            <span className="flechadown">
              <BsArrowDown />
            </span>
          </div>
          <div className="containerTotalRVG">
            <span
              className={`number1RVG ${
                roundedTotal < 0 ? "negativeRVG" : "positiveRVG"
              }`}
            >
              {roundedTotal} <span className="euro1RVG">€</span>
            </span>
          </div>
        </div>
  
      </div>
    </section>
  );
}

export default VentasGastosResumen;
