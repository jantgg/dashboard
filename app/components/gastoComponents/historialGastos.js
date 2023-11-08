"use client";
import React, { useState, useEffect } from "react";
import useServicios from "app/hooks/useServicios.js";
import useProductos from "app/hooks/useProductos.js";
import useGastos from "app/hooks/useGastos.js";
import "./historialGastos.css";
import {AiOutlineDownload} from "react-icons/ai";

function HistorialGastos() {
  const { gastos, loading } = useGastos();

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  // 1. Estados para el mes y año seleccionados
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);

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
  const roundedBruto = Math.round(totalBruto);
  const roundedNeto = Math.round(totalNeto);

  return (
    <section className="sectionHistorialG">
      <header className="headerHistorialG">
        <h2 className="h2HeaderHistorialG">Historial de gastos</h2>
        <div className="headerRowHistorialG">
          <select
            className="selectorsHistorialG"
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
            className="selectorsHistorialG"
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

          <div className="netoybrutoHistorialG">
            <span className="netoybrutoTextoG">Bruto</span>
            <span className="netoybrutoNumeroG">{roundedBruto}€</span>{" "}
          </div>
          <div className="netoybrutoHistorialG">
            <span className="netoybrutoTextoG">Neto</span>
            <span className="netoybrutoNumeroG">{roundedNeto}€</span>{" "}
          </div>
        </div>
      </header>
      <div className="containerHistorialGastos">
        {gastosDelMes.map((gasto) => (
          <div className="gastoHistorialG" key={gasto._id}>
            <div className="gHGNombre">
              <span>{gasto.nombreProveedor}</span>
            </div>
            <div className="gHGBruto">
              Bruto: <span>{gasto.cantidadBruta}</span>
            </div>
            <div className="gHGNeto">
              Neto: <span>{gasto.cantidadNeta}</span>
            </div>
            <ul className="gHGContainerP">
              <div className="gHGTittleP">Productos</div>
              {gasto.productos.map((producto, index) => (
                <li className="gHGProducto" key={index}>
                  {producto.nombre}
                </li>
              ))}
            </ul>
            <ul className="gHGContainerS">
              <div className="gHGTittleS">Servicios</div>
              {gasto.servicios.map((servicio, index) => (
                <li className="gHGServicio" key={index}>
                  {servicio.nombre}
                </li>
              ))}
            </ul>
            <div className="buttonContainerHV">
              {" "}
              <button
                className="buttonFacturas"
                onClick={() => generarPdf(gasto.factura)}
              >
                Factura
                <span>
                  <AiOutlineDownload />
                </span>
              </button>
            </div>

            <hr />
          </div>
        ))}
      </div>
    </section>
  );
}

export default HistorialGastos;
