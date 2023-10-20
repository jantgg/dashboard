"use client"
import React, { useState, useEffect,  } from "react";
import useProductos from "app/hooks/useProductos.js";
import "./masComprado.css";

function MasComprado() {
    const { productos, singleProducto, getProductos } = useProductos();

    // Ordenamos los productos por el atributo 'vecesComprado' en orden descendente.
    const productosOrdenados = [...productos].sort((a, b) => b.vecesComprado - a.vecesComprado);

    return (
        <div>
            <h2>Productos mas Comprados</h2>
            {productosOrdenados.map(producto => (
                <div key={producto.id}> {/* Suponiendo que cada producto tiene un atributo 'id' */}
                    {producto.nombre}
                </div>
            ))}
        </div>
    );
}

export default MasComprado;