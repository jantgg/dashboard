import React, { useState } from "react";
import "./singleProducto.css";

function SingleProducto({producto}) {
  return (
    <div>
      <div>
        Nombre:
        {producto.nombre}
      </div>

      <div>
        Descripción:
        {producto.descripcion}
      </div>

      <div>
        Precio de compra sin IVA
        {producto.precioCompra}
      </div>

      <div>
        Precio de venta sin IVA
        {producto.precioVenta}
      </div>

      <div>
        IVA
        {producto.iva}
      </div>
      <div>
        Numero de serie
        {producto.numeroSerie}
      </div>
      <div>
        Stock
        {producto.stock}
      </div>
    </div>
  );
}
export default SingleProducto;
