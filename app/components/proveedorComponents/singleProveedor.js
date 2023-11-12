"use client"
import React, { useState } from "react";
import { AiOutlineDownload } from "react-icons/ai";
import  {useProveedoresContext}  from 'app/hooks/ProveedoresContext.js';
import useGastos from "app/hooks/useGastos.js";
import generarPdf from "app/hooks/generarPdf";
import "./singleProveedor.css";

function SingleProveedor() {
  const { gastos } = useGastos();
  const {  singleProveedor } = useProveedoresContext();
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

 const gastosDelProveedorYMes = gastos.filter((gasto) => {
   const fechaGasto = new Date(gasto.fecha);
   return (
     gasto.proveedor === singleProveedor._id &&
     fechaGasto.getMonth() === selectedMonth &&
     fechaGasto.getFullYear() === selectedYear
   );
 });

  return (
    <section className="sectionSP">
      <header className="headerSP">
        <div className="Pnombre">{singleProveedor.nombre}</div>
        <div className="Pcif">{singleProveedor.cif}</div>
        <div className="Ptelefono">{singleProveedor.telefono}</div>
        <div className="Pemail">{singleProveedor.email}</div>
        <div className="Pfecha">{singleProveedor.fechaRegistro}</div>{" "}
        <div className="Pdireccion">{singleProveedor.direccion}</div>
        <div className="Pgastostotales">{singleProveedor.gastosTotales}€</div>
      </header>
      <div className="historialgastosSP">
        <h2 className="historialtittleSP">Historial</h2>
        <div className="selectorscontainerSP">
          <select
            className="selectorsSP"
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
            className="selectorsSP"
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
      <div className="gastoscontainerSP">
        {gastosDelProveedorYMes.map((gasto) => (
          <div className="gastoHistorialSP" key={gasto._id}>
            <div className="leftcontainerhistorialSP">
              <div className="SPNeto">
                <span>{gasto.cantidadNeta}€</span>
              </div>
              <div className="SPTittleP">
                Productos: {gasto.productos.length}
              </div>
              <div className="SPTittleS">
                Servicios: {gasto.servicios.length}
              </div>{" "}
            </div>
            <div className="rightcontainerhistorialSP">
              <div className="SPNombre">
                <span>{formatDate(gasto.fecha)}</span>
              </div>
              <button
                className="buttonFacturasSP"
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
export default SingleProveedor;
