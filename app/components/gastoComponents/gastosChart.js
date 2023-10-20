"use client"
import React, { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';

function GastosChart({ data }) {
    const chartContainerRef = useRef(null);
    let chart;

    useEffect(() => {
        if (chartContainerRef.current) {
            chart = createChart(chartContainerRef.current, { width: 400, height: 300 });
            const lineSeries = chart.addLineSeries();

            // Usamos directamente 'data' sin necesidad de remapeo
            lineSeries.setData(data);
        }

        return () => {
            // Limpiar el chart al desmontar el componente
            if (chart) {
                chart.remove();
            }
        };
    }, [data]);

    return (
        <div ref={chartContainerRef} style={{ width: '400px', height: '300px' }}></div>
    );
}

export default GastosChart;
