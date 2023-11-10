"useClient";
import React, { useState, useEffect } from "react";
import useVentas from "app/hooks/useVentas.js"; // Asegúrate de tener este hook
import "./singleCliente.css";
import { AiOutlineDownload } from "react-icons/ai";
import  {useClientesContext}  from 'app/hooks/ClientesContext.js';

function SingleCliente() {
  const { ventas, getVentas, loading } = useVentas();
  const {  singleCliente } = useClientesContext();

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
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString("es-ES", options);
  };

  const ventasDelClienteYMes = ventas.filter((venta) => {
    const fechaVenta = new Date(venta.fecha);
    return (
      venta.cliente === singleCliente._id &&
      fechaVenta.getMonth() === selectedMonth &&
      fechaVenta.getFullYear() === selectedYear
    );
  });

  return (
    <section className="sectionSC">
      <header className="headerSC">
        <div className="Cnombre">{singleCliente.nombre}</div>
        <div className="Ccif">{singleCliente.cif}</div>
        <div className="Ctelefono">{singleCliente.telefono}</div>
        <div className="Cemail">{singleCliente.email}</div>
        <div className="Cfecha">{singleCliente.fechaRegistro}</div>{" "}
        <div className="Cdireccion">{singleCliente.direccion}</div>
        <div className="Cventastotales">{singleCliente.ventasTotales}€</div>
      </header>
      <div className="historialventasSC">
        <h2 className="historialtittleSC">Historial</h2>
        <div className="selectorscontainerSC">
          <select
            className="selectorsSC"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
          >
            {monthNames.map((month, index) => (
              <option key={index} value={index}>
                {month}
              </option>
            ))}
          </select>

          <select
            className="selectorsSC"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          >
            {Array.from({ length: 10 }, (_, i) => currentYear - i).map(
              (year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              )
            )}
          </select>
        </div>
      </div>{" "}
      <div className="ventascontainerSC">
        {ventasDelClienteYMes.map((venta) => (
          <div className="ventaHistorialSC" key={venta._id}>
            <div className="leftcontainerhistorialSC">
              <div className="SCNeto">
                <span>{venta.cantidadNeta}€</span>
              </div>
              <div className="SCTittleP">
                Productos: {venta.productos.length}
              </div>
              <div className="SCTittleS">
                Servicios: {venta.servicios.length}
              </div>{" "}
            </div>
            <div className="rightcontainerhistorialSC">
              <div className="SCNombre">
                <span>{formatDate(venta.fecha)}</span>
              </div>
              <button
                className="buttonFacturasSC"
                onClick={() => generarPdf(venta.factura)}
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

export default SingleCliente;
