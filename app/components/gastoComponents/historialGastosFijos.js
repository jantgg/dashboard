"use client";
import React, { useState, useEffect } from "react";
import useServicios from "app/hooks/useServicios.js";
import useProductos from "app/hooks/useProductos.js";
import useGastos from "app/hooks/useGastos.js";
import "./historialGastosFijos.css";
import { AiOutlineDownload } from "react-icons/ai";

function HistorialGastosFijos() {
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
      fechaGasto.getFullYear() === selectedYear &&
      gasto.tipo === "fijo" // Asegurarte de que el tipo sea "fijo"
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
  const roundedBruto = Math.round(totalBruto);
  const roundedNeto = Math.round(totalNeto);

  return (
    <section className="sectionHistorialGF">
      <header className="headerHistorialGF">
        <h2 className="h2HeaderHistorialGF orange-bg">Gastos Fijos</h2>
        <div className="headerRowHistorialGF">
          <select
            className="selectorsHistorialGF"
            value={selectedMonth}
            onChange={handleMonthChange}
          >
            {monthNames.map((month, index) => (
              <option className="txt-black" key={index} value={index}>
                {month}
              </option>
            ))}
          </select>

          <select
            className="selectorsHistorialGF"
            value={selectedYear}
            onChange={handleYearChange}
          >
            {/* Rango de años (puedes adaptarlo) */}
            {Array.from({ length: 10 }, (_, i) => currentYear - i).map(
              (year) => (
                <option className="txt-black" key={year} value={year}>
                  {year}
                </option>
              )
            )}
          </select>

          <div className="netoybrutoHistorialGF">
            <span className="netoybrutoTextoGF">Bruto</span>
            <span className="netoybrutoNumeroGF">{roundedBruto}€</span>{" "}
          </div>
          <div className="netoybrutoHistorialGF">
            <span className="netoybrutoTextoGF">Neto</span>
            <span className="netoybrutoNumeroGF">{roundedNeto}€</span>{" "}
          </div>
        </div>
      </header>
      <div className="containerHistorialGastos">
        {gastosDelMes.map((gasto) => (
          <div className="gastoHistorialGF" key={gasto._id}>
              {gasto.servicios.map((servicio, index) => (
              <div className="gHGFServicio" key={index}>
                {servicio.nombre}
              </div>
            ))}{" "}
            <div className="gHGFNombre">
              <span>{gasto.nombreProveedor}</span>
            </div>
            <div className="gHGFNeto">{gasto.cantidadNeta}</div>
          
            <button
              className="buttonFacturasGF"
              onClick={() => generarPdf(gasto.factura)}
            >
              <span>
                <AiOutlineDownload />
              </span>
            </button>
         
          </div>
        ))}
      </div>
    </section>
  );
}

export default HistorialGastosFijos;
