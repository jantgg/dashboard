import React, { useState } from "react";
import "./singleCliente.css";

function SingleCliente({ cliente }) {
  return (
    <div>
      <div>
        Nombre:
        {cliente.nombre}
      </div>

      <div>
        Descripción:
        {cliente.cif}
      </div>

      <div>
        Precio de compra sin IVA
        {cliente.direccion}
      </div>

      <div>
        Precio de venta sin IVA
        {cliente.telefono}
      </div>

      <div>
        IVA
        {cliente.email}
      </div>
    </div>
  );
}
export default SingleCliente;
