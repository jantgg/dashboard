"use client";
import React, { useState, useEffect } from "react";
import useServicios from "app/hooks/useServicios.js";
import useProductos from "app/hooks/useProductos.js";
import useVentas from "app/hooks/useVentas.js";
import generarPdf from "app/hooks/generarPdf.js";
import "./historialVentas.css";
import {AiOutlineDownload} from "react-icons/ai";

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
  const roundedBruto = Math.round(totalBruto);
  const roundedNeto = Math.round(totalNeto);

  return (
    <section className="sectionHistorialV">
      <header className="headerHistorialV">
        <h2 className="h2HeaderHistorialV green-bg">Historial de ventas</h2>
        <div className="headerRowHistorialV">
          <select
            className="selectorsHistorialV"
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
            className="selectorsHistorialV"
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

          <div className="netoybrutoHistorialV">
            <span className="netoybrutoTextoV">Bruto</span>
            <span className="netoybrutoNumeroV">{roundedBruto}€</span>{" "}
          </div>
          <div className="netoybrutoHistorialV">
            <span className="netoybrutoTextoV">Neto</span>
            <span className="netoybrutoNumeroV">{roundedNeto}€</span>{" "}
          </div>
        </div>
      </header>
      <div className="containerHistorialVentas">
        {ventasDelMes.map((venta) => (
          <div className="ventaHistorialV" key={venta._id}>
            <div className="vHVNombre">
              <span>{venta.nombreCliente}</span>
            </div>
            <div className="vHVBruto">
              Bruto: <span>{venta.cantidadBruta}</span>
            </div>
            <div className="vHVNeto">
              Neto: <span>{venta.cantidadNeta}</span>
            </div>
            <ul className="vHVContainerP">
              <div className="vHVTittleP">Productos</div>
              {venta.productos.map((producto, index) => (
                <li className="vHVProducto" key={index}>
                  {producto}
                </li>
              ))}
            </ul>
            <ul className="vHVContainerS">
              <div className="vHVTittleS">Servicios</div>
              {venta.servicios.map((servicio, index) => (
                <li className="vHVServicio" key={index}>
                  {servicio}
                </li>
              ))}
            </ul>
            <div className="buttonContainerHV">
              {" "}
              <button
                className="buttonFacturas"
                onClick={() => generarPdf(venta.factura)}
              >
                Factura
                <span><AiOutlineDownload/></span>
              </button>
            </div>

            <hr />
          </div>
        ))}
      </div>
    </section>
  );
}

export default HistorialVentas;
