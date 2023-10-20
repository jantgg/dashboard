"use client";
import React, { useState, useEffect } from "react";
import useServicios from "app/hooks/useServicios.js";
import useProductos from "app/hooks/useProductos.js";
import useGastos from "app/hooks/useGastos.js";
import "./historialGastos.css";

function HistorialGastos() {
  const { gastos, singleVenta, setSingleVenta, loading, error, getGastos } =
    useGastos();

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  // 1. Estados para el mes y año seleccionados
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  console.log(gastos);

  const gastosPorMes = {};

  // Si las gastos ya se han cargado
  if (!loading && gastos) {
    gastos.forEach((gasto) => {
      // Convertir fecha string a Date Object
      const date = new Date(gasto.fecha);
      const monthYearKey = `${date.getMonth() + 1}-${date.getFullYear()}`; // Formato "MM-YYYY"

      // Inicializar el mes si aún no ha sido registrado
      if (!gastosPorMes[monthYearKey]) {
        gastosPorMes[monthYearKey] = {
          cantidadBruta: 0,
          cantidadNeta: 0,
        };
      }

      // Agregar valores al mes correspondiente
      gastosPorMes[monthYearKey].cantidadBruta += gasto.cantidadBruta;
      gastosPorMes[monthYearKey].cantidadNeta += gasto.cantidadNeta;
    });
  }

  // 2. Input para seleccionar el mes y el año
  const handleMonthChange = (e) => {
    setSelectedMonth(Number(e.target.value));
  };

  const handleYearChange = (e) => {
    setSelectedYear(Number(e.target.value));
  };

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

  // Filtra las gastos basadas en el mes y año seleccionados
  const gastosDelMes = gastos.filter((gasto) => {
    const fechaGasto = new Date(gasto.fecha);
    return (
      fechaGasto.getMonth() === selectedMonth &&
      fechaGasto.getFullYear() === selectedYear
    );
  });

  // Calcula la suma total de cantidadBruta y cantidadNeta
  const totalBruto = gastosDelMes.reduce(
    (sum, gasto) => sum + gasto.cantidadBruta,
    0
  );
  const totalNeto = gastosDelMes.reduce(
    (sum, gasto) => sum + gasto.cantidadNeta,
    0
  );

  return (
    <div>
      <h2>Historial de gastos</h2>
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
            {/* Rango de años (puedes adaptarlo) */}
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
        GAstos de {monthNames[selectedMonth]} {selectedYear}
      </h2>
      <p>Total Bruto: {totalBruto.toFixed(2)}€</p>
      <p>Total Neto: {totalNeto.toFixed(2)}€</p>

      {gastosDelMes.map((gasto) => (
        <div key={gasto._id}>
          <p>Proveedor: {gasto.nombreProveedor}</p>
          <p>Cantidad Bruta: {gasto.cantidadBruta}</p>
          <p>Cantidad Neta: {gasto.cantidadNeta}</p>
          <button onClick={() => generarPdf(gasto.factura)}>
            Descargar Factura
          </button>
          <hr />
        </div>
      ))}
    </div>
  );
}

export default HistorialGastos;
