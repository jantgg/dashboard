"use client"
import React, { useState } from "react";
import "./singleProducto.css";
import  {useProductosContext}  from 'app/hooks/ProductosContext.js';



function SingleProducto() {
  const {  singleProducto } = useProductosContext();
  return (
    <div>
      <div>
        Nombre:
        {singleProducto.nombre}
      </div>

      <div>
        Descripción:
        {singleProducto.descripcion}
      </div>

      <div>
        Precio de compra sin IVA
        {singleProducto.precioCompra}
      </div>

      <div>
        Precio de venta sin IVA
        {singleProducto.precioVenta}
      </div>

      <div>
        IVA
        {singleProducto.iva}
      </div>
      <div>
        Numero de serie
        {singleProducto.numeroSerie}
      </div>
      <div>
        Stock
        {singleProducto.stock}
      </div>
    </div>
  );
}
export default SingleProducto;
