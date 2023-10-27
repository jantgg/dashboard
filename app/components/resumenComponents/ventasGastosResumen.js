"use client";
import React, { useState, useEffect, useRef } from "react";
import { createChart } from "lightweight-charts";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Estilos para el datepicker
import useVentas from "app/hooks/useVentas.js";
import useGastos from "app/hooks/useGastos.js";
import "./ventasGastosResumen.css";

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
    <div>
      <h2>Historial de ventas y gastos</h2>
      <div>
        <label>
          Mes:
          <select value={selectedMonth} onChange={handleMonthChange}>
            {monthNames.map((month, index) => (
              <option key={index} value={index}>
                {month}
              </option>
            ))}
          </select>
        </label>
        <label>
          Año:
          <select value={selectedYear} onChange={handleYearChange}>
            {Array.from({ length: 10 }, (_, i) => currentYear - i).map(
              (year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              )
            )}
          </select>
        </label>
      </div>

      <h2>
        Resumen de {monthNames[selectedMonth]} {selectedYear}
      </h2>
      <p>Total Ventas: {totalVentas.toFixed(2)}€</p>
      <p>Total Gastos: {totalGastos.toFixed(2)}€</p>
      <div className="tower-container">
    <div className="tower" style={{ height: `${ventasPercentage}%` }}>
        Ventas: {totalVentas.toFixed(2)}€
    </div>
    <div className="tower" style={{ height: `${gastosPercentage}%` }}>
        Gastos: {totalGastos.toFixed(2)}€
    </div>
</div>

    </div>
  );
}

export default VentasGastosResumen;
