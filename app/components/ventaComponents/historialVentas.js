"use client";
import React, { useState, useEffect } from "react";
import useServicios from "app/hooks/useServicios.js";
import useProductos from "app/hooks/useProductos.js";
import useVentas from "app/hooks/useVentas.js";
import "./masVendidoS.css";

function HistorialVentas() {
  const { ventas, singleVenta, setSingleVenta, loading, error, getVentas } =
    useVentas();

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  // 1. Estados para el mes y año seleccionados
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  console.log(ventas);

  const ventasPorMes = {};

  // Si las ventas ya se han cargado
  if (!loading && ventas) {
    ventas.forEach((venta) => {
      // Convertir fecha string a Date Object
      const date = new Date(venta.fecha);
      const monthYearKey = `${date.getMonth() + 1}-${date.getFullYear()}`; // Formato "MM-YYYY"

      // Inicializar el mes si aún no ha sido registrado
      if (!ventasPorMes[monthYearKey]) {
        ventasPorMes[monthYearKey] = {
          cantidadBruta: 0,
          cantidadNeta: 0,
        };
      }

      // Agregar valores al mes correspondiente
      ventasPorMes[monthYearKey].cantidadBruta += venta.cantidadBruta;
      ventasPorMes[monthYearKey].cantidadNeta += venta.cantidadNeta;
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

  // Filtra las ventas basadas en el mes y año seleccionados
  const ventasDelMes = ventas.filter((venta) => {
    const fechaVenta = new Date(venta.fecha);
    return (
      fechaVenta.getMonth() === selectedMonth &&
      fechaVenta.getFullYear() === selectedYear
    );
  });

  // Calcula la suma total de cantidadBruta y cantidadNeta
  const totalBruto = ventasDelMes.reduce(
    (sum, venta) => sum + venta.cantidadBruta,
    0
  );
  const totalNeto = ventasDelMes.reduce(
    (sum, venta) => sum + venta.cantidadNeta,
    0
  );

  return (
    <div>
      <h2>Historial de ventas</h2>
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
        Ventas de {monthNames[selectedMonth]} {selectedYear}
      </h2>
      <p>Total Bruto: {totalBruto.toFixed(2)}€</p>
      <p>Total Neto: {totalNeto.toFixed(2)}€</p>

      {ventasDelMes.map((venta) => (
        <div key={venta._id}>
          <p>Cliente: {venta.cliente}</p>
          <p>Cantidad Bruta: {venta.cantidadBruta}</p>
          <p>Cantidad Neta: {venta.cantidadNeta}</p>
          <button onClick={() => generarPdf(venta.factura)}>
            Descargar Factura
          </button>
          <hr />
        </div>
      ))}
    </div>
  );
}

export default HistorialVentas;
