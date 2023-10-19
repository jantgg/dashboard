"use client"
import React, { useState, useEffect,  } from "react";
import useProductos from "app/hooks/useProductos.js";
import "./masVendido.css";

function MasVendido() {
    const { productos, singleProducto, getProductos } = useProductos();

    // Ordenamos los productos por el atributo 'vecesVendido' en orden descendente.
    const productosOrdenados = [...productos].sort((a, b) => b.vecesVendido - a.vecesVendido);

    return (
        <div>
            <h2>Productos mas vendidos</h2>
            {productosOrdenados.map(producto => (
                <div key={producto.id}> {/* Suponiendo que cada producto tiene un atributo 'id' */}
                    {producto.nombre}
                </div>
            ))}
        </div>
    );
}

export default MasVendido;