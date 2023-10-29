"use client";
import React, { useState, useEffect } from "react";
import useProductos from "app/hooks/useProductos.js";
import "./masVendido.css";

function MasVendido() {
  const { productos, singleProducto, getProductos } = useProductos();

  // Ordenamos los productos por el atributo 'vecesVendido' en orden descendente.
  const productosOrdenados = [...productos].sort(
    (a, b) => b.vecesVendido - a.vecesVendido
  );

  return (
    <section>
      <h2 className="tittleproductosRVG">Productos más vendidos</h2>
      <div className="listaproductosRVG">
        {" "}
        {productosOrdenados.map((producto) => (
          <div className="productoRVG" key={producto._id}>
            {" "}
            <span className="productonombreRVG">     {producto.nombre}</span>
       
          </div>
        ))}
      </div>
    </section>
  );
}

export default MasVendido;
