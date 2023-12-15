"use client";
import React, { useState, useEffect } from "react";
import useServicios from "app/hooks/useServicios.js";
import "./masVendidoS.css";

function MasVendidoS() {
  const { servicios, singleServicio, getServicios } = useServicios();

  // Ordenamos los productos por el atributo 'vecesVendido' en orden descendente.
  const serviciosOrdenados = [...servicios].sort(
    (a, b) => b.vecesVendido - a.vecesVendido
  );

  return (
    <section>
      <h2 className="tittleserviciosRVG blue-bg">Servicios mas vendidos</h2>
      <div className="listaserviciosRVG">
        {" "}
        {serviciosOrdenados.map((servicio) => (
          <div className="servicioRVG" key={servicio._id}>
            <span className="servicionombreRVG "> {servicio.nombre}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default MasVendidoS;
