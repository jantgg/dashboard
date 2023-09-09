import React, { useState } from "react";
import "./singleProveedor.css";

function SingleProveedor({ proveedor }) {
  return (
    <div>
      <div>
        Nombre:
        {proveedor.nombre}
      </div>

      <div>
        Descripción:
        {proveedor.cif}
      </div>

      <div>
        Precio de compra sin IVA
        {proveedor.direccion}
      </div>

      <div>
        Precio de venta sin IVA
        {proveedor.telefono}
      </div>

      <div>
        IVA
        {proveedor.email}
      </div>
    </div>
  );
}
export default SingleProveedor;
