"use client";

import React, { useEffect, useRef } from "react";
import { createChart } from "lightweight-charts";
import "./ventasCharts.css";

function VentasChart({ data }) {
  const chartContainerRef = useRef(null);
  // Declara chart fuera de useEffect para que sea accesible en la función de limpieza
  let chart = null;

  useEffect(() => {
    if (chartContainerRef.current) {
      // Aquí se asigna el chart si el contenedor está disponible
      chart = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: chartContainerRef.current.clientHeight,
        layout: {
          backgroundColor: "#808080", // Asegúrate de que este es el color gris que quieres.
          textColor: "rgba(0, 0, 0, 1)",
        },
        grid: {
          vertLines: {
            color: "rgba(42, 46, 57, 0.6)",
          },
          horzLines: {
            color: "rgba(42, 46, 57, 0.6)",
          },
        },
        priceScale: {
          scaleMargins: {
            top: 0.1,
            bottom: 0.25,
          },
          borderVisible: false,
        },
      });

      const lineSeries = chart.addLineSeries({
        color: "rgba(0, 150, 0, 1)",
        lineWidth: 2,
      });

      lineSeries.setData(data);

      chart.applyOptions({
        priceScale: {
          autoScale: true,
          mode: 2,
          entireTextOnly: true,
        },
      });
    }

    return () => {
      // Ahora chart está definido correctamente en este contexto
      if (chart) {
        chart.remove();
        chart = null; // Asegúrate de limpiar la referencia a chart
      }
    };
  }, [data]);

  return (
    <div
      ref={chartContainerRef}
  
      className="containerChartVentasRVG"
    ></div>
  );
}

export default VentasChart;
