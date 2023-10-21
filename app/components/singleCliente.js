"useClient"
import React, { useState, useEffect } from "react";
import useVentas from "app/hooks/useVentas.js"; // Asegúrate de tener este hook
import "./singleCliente.css";

function SingleCliente({ cliente }) {
  const { ventas, getVentas, loading } = useVentas();

  // Estados para el mes y año seleccionados
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

  const ventasDelClienteYMes = ventas.filter((venta) => {
    const fechaVenta = new Date(venta.fecha);
    return (
      venta.cliente === cliente._id &&
      fechaVenta.getMonth() === selectedMonth &&
      fechaVenta.getFullYear() === selectedYear
    );
  });

  return (
    <div>
      {/* Aquí está el código de tu cliente */}
      <div>
        Nombre:
        {cliente.nombre}
      </div>
      {/* ...resto del código... */}
      
      <div>
        <h2>Compras de {cliente.nombre}</h2>
        <div>
          <label>
            Mes:
            <select value={selectedMonth} onChange={(e) => setSelectedMonth(Number(e.target.value))}>
              {monthNames.map((month, index) => (
                <option key={index} value={index}>
                  {month}
                </option>
              ))}
            </select>
          </label>
          <label>
            Año:
            <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))}>
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

        {ventasDelClienteYMes.map((venta) => (
          <div key={venta._id}>
            <p>Cantidad Bruta: {venta.cantidadBruta}</p>
            <p>Cantidad Neta: {venta.cantidadNeta}</p>
            <button onClick={() => generarPdf(venta.factura)}>
              Descargar Factura
            </button>
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
}

export default SingleCliente;
