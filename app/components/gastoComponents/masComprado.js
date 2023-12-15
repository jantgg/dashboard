"use client";
import React, { useState, useEffect } from "react";
import useProductos from "app/hooks/useProductos.js";
import "./masComprado.css";

function MasComprado() {
  const { productos, singleProducto, getProductos } = useProductos();

  // Ordenamos los productos por el atributo 'vecesComprado' en orden descendente.
  const productosOrdenados = [...productos].sort(
    (a, b) => b.vecesComprado - a.vecesComprado
  );

  return (
    <section>
      <h2 className="tittleproductosG blue-bg">Más comprados</h2>
      <div className="listaproductosG">
        {" "}
        {productosOrdenados.map((producto) => (
          <div className="productoG" key={producto._id}>
            {" "}
            <span className="productonombreG"> {producto.nombre}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default MasComprado;
