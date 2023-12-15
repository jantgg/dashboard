"use client";
import React, { useState, useEffect } from "react";
import useServicios from "app/hooks/useServicios.js";
import useProductos from "app/hooks/useProductos.js";
import useGastos from "app/hooks/useGastos.js";
import generarPdf from "app/hooks/generarPdf.js";
import "./resumenGastos.css";

function ResumenGastos() {
  const { servicios, singleServicio, getServicios } = useServicios();
  const { productos, singleProducto, getProductos } = useProductos();
  const { gastos, singleVenta, setSingleVenta, loading, error, getGastos } =
    useGastos();

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
  const serviciosOrdenados = [...servicios].sort(
    (a, b) => b.vecesVendido - a.vecesVendido
  );
  const productosOrdenados = [...productos].sort(
    (a, b) => b.vecesVendido - a.vecesVendido
  );

  const fechaActual = new Date();
  const mesActual = fechaActual.getMonth();
  const añoActual = fechaActual.getFullYear();

  const gastosDelMes = gastos?.filter((gasto) => {
    const fechaGasto = new Date(gasto.fecha);
    return (
      fechaGasto.getMonth() === mesActual &&
      fechaGasto.getFullYear() === añoActual
    );
  });

  const totalNetaDelMes = gastosDelMes?.reduce(
    (acc, gasto) => acc + (gasto.cantidadNeta || 0),
    0
  );
  const roundedGastos = Math.round(totalNetaDelMes);

  const gastosFijosDelMes = gastosDelMes?.filter(
    (gasto) => gasto.tipo === "fijo"
  );

  const totalGastosFijosDelMes = gastosFijosDelMes?.reduce(
    (acc, gasto) => acc + (gasto.cantidadNeta || 0),
    0
  );
  const roundedGastosFijos = Math.round(totalGastosFijosDelMes);
  const numeroDeGastosEsteMes = gastosDelMes?.length;

  const totalProductosComprados = gastosDelMes?.reduce((acc, gasto) => {
    return acc + (gasto.productos?.length || 0);
  }, 0);

  return (
    <section className="sectionResumenG">
      <h2 className="h2G grey-bg text-black">Resumen</h2>
      <div className="containerTexto1G">
        <h3 className="texto1G"> Gastos {nombresDeMeses[mesActual]} </h3>

        <span className="number1G">
          {roundedGastos} <span className="euro1G">€</span>
        </span>
      </div>
      <div className="containerTexto2G">
        <h3 className="texto2G"> Gastos fijos </h3>
        <span className="number1G">
          {roundedGastosFijos} <span className="euro1G">€</span>
        </span>
      </div>
      <div className="containerTexto2G">
        <h3 className="texto2G"> Nº de gastos </h3>
        <span className="number2G">{numeroDeGastosEsteMes}</span>
      </div>
      <div className="containerTexto2G">
        <h3 className="texto2G"> Nuevos productos </h3>
        <span className="number2G">{totalProductosComprados}</span>
      </div>
    </section>
  );
}

export default ResumenGastos;
