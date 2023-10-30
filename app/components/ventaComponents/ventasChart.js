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
          textColor: "black",
          background: { type: "solid", color: "rgb(196, 196, 196)" },
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
        topColor: "rgba(0, 150, 0, 0.8)",
        bottomColor: "rgba(0, 150, 0, 0.2)",
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
    <div ref={chartContainerRef} className="containerChartVentasRVG"></div>
  );
}

export default VentasChart;
