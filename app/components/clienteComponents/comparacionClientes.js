"use client";
import React, { useState, useEffect } from "react";
import useClientes from "app/hooks/useClientes.js";
import ClientesChart from "app/components/clienteComponents/clientesChart.js"; // Suponiendo que tienes un componente de gráfico para clientes
import { useClientesContext } from "app/hooks/ClientesContext.js";
import "./comparacionClientes.css";

function ResumenClientes() {
  const { clientes } = useClientesContext();
  const [resumenDiario, setResumenDiario] = useState([]);
  const [mesSeleccionado, setMesSeleccionado] = useState(new Date().getMonth());
  const [anioSeleccionado, setAnioSeleccionado] = useState(
    new Date().getFullYear()
  );

  useEffect(() => {
    const resumen = {};

    if (Array.isArray(clientes)) {
      clientes.forEach((cliente) => {
        const fechaCliente = new Date(cliente.fechaRegistro);
        const fecha = fechaCliente.toISOString().split("T")[0]; // Formato YYYY-MM-DD

        if (
          fechaCliente.getMonth() === mesSeleccionado &&
          fechaCliente.getFullYear() === anioSeleccionado
        ) {
          if (!resumen[fecha]) {
            resumen[fecha] = 0;
          }
          resumen[fecha] += 1;
        }
      });

      setResumenDiario(
        Object.entries(resumen).map(([fecha, cantidad]) => ({
          time: fecha,
          value: cantidad,
        }))
      );
    }
  }, [clientes, mesSeleccionado, anioSeleccionado]);

  return (
    <section className="clientesgraficasection">
      <header className="clientesgrafica">
        {" "}
        <h2 className="orange-bg">Resumen de Clientes</h2>
        <select
          id="anioSelector"
          onChange={(e) => setAnioSeleccionado(parseInt(e.target.value))}
        >
          {[...Array(5).keys()].map((offset) => {
            const year = new Date().getFullYear() - offset;
            return (
              <option key={year} value={year}>
                {year}
              </option>
            );
          })}
        </select>
        <select
          id="mesSelector"
          onChange={(e) => setMesSeleccionado(parseInt(e.target.value))}
        >
          {[...Array(12).keys()].map((mes) => {
            const nombreMes = new Date(0, mes).toLocaleString("es", {
              month: "long",
            });
            const nombreMesCapitalizado =
              nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1);

            return (
              <option key={mes} value={mes}>
                {nombreMesCapitalizado}
              </option>
            );
          })}
        </select>
      </header>

        {" "}
        <ClientesChart data={resumenDiario} />
 
    </section>
  );
}

export default ResumenClientes;
