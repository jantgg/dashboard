"use client";
import React, { useState, useEffect } from "react";
import useClientes from "app/hooks/useClientes.js";
import ClientesChart from "app/components/clientesChart.js";  // Suponiendo que tienes un componente de gráfico para clientes

function ResumenClientes() {
  const { clientes } = useClientes();
  
  const [resumenMensual, setResumenMensual] = useState([]);

  useEffect(() => {
    const resumen = {};

    if (Array.isArray(clientes)) {
      clientes.forEach((cliente) => {
        const fechaCliente = new Date(cliente.fechaRegistro);  // Suponiendo que cada cliente tiene una fecha de registro
        const mesAño = `${fechaCliente.getMonth()}-${fechaCliente.getFullYear()}`;

        if (!resumen[mesAño]) {
          resumen[mesAño] = {
            mes: fechaCliente.getMonth(),
            year: fechaCliente.getFullYear(),
            cantidadClientes: 0,
          };
        }

        resumen[mesAño].cantidadClientes += 1;  // Incrementamos en 1 por cada cliente en ese mes
      });

      setResumenMensual(Object.values(resumen));
    }
  }, [clientes]);

  const chartData = resumenMensual.map((d) => {
    return {
        time: `${d.year}-${String(d.mes + 1).padStart(2, '0')}-01`,
        value: d.cantidadClientes,
    };
  });

  return (
    <div>
      <h2>Resumen Mensual de Clientes</h2>
      <ClientesChart data={chartData} />
    </div>
  );
}

export default ResumenClientes;
