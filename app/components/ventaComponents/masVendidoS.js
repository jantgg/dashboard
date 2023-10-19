"use client"
import React, { useState, useEffect,  } from "react";
import useServicios from "app/hooks/useServicios.js";
import "./masVendidoS.css";

function MasVendidoS() {
    const { servicios, singleServicio, getServicios } = useServicios();

    // Ordenamos los productos por el atributo 'vecesVendido' en orden descendente.
    const serviciosOrdenados = [...servicios].sort((a, b) => b.vecesVendido - a.vecesVendido);

    return (
        <div>
            <h2>Servicios mas vendidos</h2>
            {serviciosOrdenados.map(servicio => (
                <div key={servicio.id}> {/* Suponiendo que cada servicio tiene un atributo 'id' */}
                    {servicio.nombre}
                </div>
            ))}
        </div>
    );
}

export default MasVendidoS;