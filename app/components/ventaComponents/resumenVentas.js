"use client";
import React from "react";
import useServicios from "app/hooks/useServicios.js";
import useProductos from "app/hooks/useProductos.js";
import useVentas from "app/hooks/useVentas.js";
import useClientes from "app/hooks/useClientes.js";
import generarPdf from "app/hooks/generarPdf.js";
import "./resumenVentas.css";
import { BsArrowUp, BsArrowDown } from "react-icons/bs"; // Asumiendo que necesitarás estos íconos más adelante

function ResumenVentas() {
  const { servicios } = useServicios();
  const { productos } = useProductos();
  const { ventas } = useVentas();
  const { clientes } = useClientes();

  const serviciosOrdenados = [...servicios].sort(
    (a, b) => b.vecesVendido - a.vecesVendido
  );
  const productosOrdenados = [...productos].sort(
    (a, b) => b.vecesVendido - a.vecesVendido
  );

  const fechaActual = new Date();
  const mesActual = fechaActual.getMonth();
  const añoActual = fechaActual.getFullYear();
  const nombresDeMeses = [
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
  // Filtrar las ventas para obtener solo las del mes y año actual
  const ventasDelMes = ventas?.filter((venta) => {
    const fechaVenta = new Date(venta.fecha);
    return (
      fechaVenta.getMonth() === mesActual &&
      fechaVenta.getFullYear() === añoActual
    );
  });

  const totalNetaDelMes = ventasDelMes?.reduce(
    (acc, venta) => acc + (venta.cantidadNeta || 0),
    0
  );
  const roundedVentas = Math.round(totalNetaDelMes);
  const ventasOrdenadas = ventas
    .slice()
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  const ultimasCincoVentas = ventasOrdenadas.slice(0, 5);


// Calcular el número total de productos vendidos este mes
const totalProductosVendidosEsteMes = ventasDelMes.reduce(
  (total, venta) => total + venta.productos.length, 0
);

// Calcular el número total de servicios vendidos este mes
const totalServiciosVendidosEsteMes = ventasDelMes.reduce(
  (total, venta) => total + venta.servicios.length, 0
);
const numeroDeVentasEsteMes = ventasDelMes.length;

// Filtrar los clientes para obtener solo los registrados en el mes y año actual
const clientesDelMes = clientes.filter((cliente) => {
  const fechaRegistro = new Date(cliente.fechaRegistro);
  return (
    fechaRegistro.getMonth() === mesActual &&
    fechaRegistro.getFullYear() === añoActual
  );
});

// Contar el número de clientes creados este mes
const numeroDeClientesEsteMes = clientesDelMes.length;

  return (
    <section className="sectionResumenV">
      <h2 className="h2V">Resumen</h2>
      <div className="containerTexto1V">
        <h3 className="texto1V"> Ventas {nombresDeMeses[mesActual]} </h3>

        <span className="number1V">
          {roundedVentas} <span className="euro1V">€</span>
        </span>
      </div>
      <div className="containerTexto2V">
        <h3 className="texto2V"> Nº de ventas </h3>
        <span className="number2V">
          {numeroDeVentasEsteMes}
        </span>
      </div>
      <div className="containerTexto2V">
        <h3 className="texto2V"> Nº de productos </h3>
        <span className="number2V">
          {totalProductosVendidosEsteMes}
        </span>
      </div>
      <div className="containerTexto2V">
        <h3 className="texto2V"> Nº de servicios </h3>
        <span className="number2V">
          {totalServiciosVendidosEsteMes}
        </span>
      </div>
      <div className="containerTexto2V">
        <h3 className="texto2V"> Nuevos clientes </h3>
        <span className="number2V">
          {numeroDeClientesEsteMes}
        </span>
      </div>
    </section>
  );
}

export default ResumenVentas;
