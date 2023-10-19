"use client";
import React, { useState, useEffect } from "react";
import useServicios from "app/hooks/useServicios.js";
import useProductos from "app/hooks/useProductos.js";
import useVentas from "app/hooks/useVentas.js";
import generarPdf from "app/hooks/generarPdf.js";
import "./masVendidoS.css";

function ResumenVentas() {
  const { servicios, singleServicio, getServicios } = useServicios();
  const { productos, singleProducto, getProductos } = useProductos();
  const { ventas, singleVenta, setSingleVenta, loading, error, getVentas } =
    useVentas();

  const serviciosOrdenados = [...servicios].sort(
    (a, b) => b.vecesVendido - a.vecesVendido
  );
  const productosOrdenados = [...productos].sort(
    (a, b) => b.vecesVendido - a.vecesVendido
  );

  const fechaActual = new Date();
  const mesActual = fechaActual.getMonth();
  const añoActual = fechaActual.getFullYear();

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

  return (
    <div>
      <h2>Resumen</h2>
      <h3>Total de ventas este mes: {totalNetaDelMes?.toFixed(2) || "0.00"}</h3>
      <h3>Servicio más vendido</h3>
      <div>
        {serviciosOrdenados?.[0]?.nombre || "No hay servicios disponibles"}
      </div>
      <h3>Producto más vendido</h3>
      <div>
        {productosOrdenados?.[0]?.nombre || "No hay productos disponibles"}
      </div>
      {ventas &&
        ventas.slice(0, 5).map((venta) => (
          <div key={venta._id} className="ventaItem">
            <p>Descripción de la venta: {venta.descripcion}</p>
            <p>Cliente: {venta.nombreCliente}</p>
            <button onClick={() => generarPdf(venta.factura)}>
              Descargar Factura
            </button>
          </div>
        ))}
    </div>
  );
}

export default ResumenVentas;
