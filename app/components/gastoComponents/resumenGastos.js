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

  return (
    <div>
      <h2>Resumen</h2>
      <h3>Total de gastos este mes: {totalNetaDelMes?.toFixed(2) || "0.00"}</h3>
      <h3>Servicio más vendido</h3>
      <div>
        {serviciosOrdenados?.[0]?.nombre || "No hay servicios disponibles"}
      </div>
      <h3>Producto más vendido</h3>
      <div>
        {productosOrdenados?.[0]?.nombre || "No hay productos disponibles"}
      </div>
      {gastos &&
        gastos.slice(0, 5).map((gasto) => (
          <div key={gasto._id} className="gastoItem">
            <p>Descripción de la gasto: {gasto.descripcion}</p>
            <p>Proveedor: {gasto.nombreProveedor}</p>
            <button onClick={() => generarPdf(gasto.factura)}>
              Descargar Factura
            </button>
          </div>
        ))}
    </div>
  );
}

export default ResumenGastos;
