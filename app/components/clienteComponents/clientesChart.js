"use client";
import React, { useEffect, useRef } from "react";
import { createChart } from "lightweight-charts";
import "./clientesChart.css";

function ClientesChart({ data }) {
  const chartContainerRef = useRef(null);
  let chart = null;

  useEffect(() => {
    if (chartContainerRef.current) {
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
        color: "rgba(0, 0, 230, 1)",
        topColor: "rgba(0, 0, 230, 0.8)",
        bottomColor: "rgba(0, 0, 230, 0.2)",
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

    const handleResize = () => {
      if (chartContainerRef.current && chart) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        });
      }
    };
    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", handleResize);
      }
      if (chart) {
        chart.remove();
        chart = null;
      }
    };
  }, [data]);

  return <div ref={chartContainerRef} className="containerChartClientes"></div>;
}

export default ClientesChart;
