"use client";
import React, { useEffect, useState } from "react";
import "./singleProducto.css";
import { useProductosContext } from "app/hooks/ProductosContext.js";

function SingleProducto() {
  const { singleProducto } = useProductosContext();

  useEffect(() => {
    console.log(singleProducto);
  }, [singleProducto]);

  return (
    <section className="sectionSPR">
      <h2 className="pink-bg">Detalles de producto</h2>
      <div className="contentSPR">
        {" "}
        <div className="nombreSPR">{singleProducto.nombre}</div>
        <div className="descriptionSPR">{singleProducto.descripcion}</div>
        <div className="preciocSPR">
          <span className="span1SPR"> Precio de compra </span>
          <span className="span2SPR"> {singleProducto.precioCompra}</span>
        </div>
        <div className="preciovSPR">
        <span className="span1SPR"> Precio de Venta </span>
          <span className="span2SPR"> {singleProducto.precioVenta}</span>
        </div>
        <div className="ivaSPR">
        <span className="span1SPR"> Iva </span>
          <span className="span2SPR"> {singleProducto.iva}%</span>
        </div>
        <div className="numeroSPR">
        <span className="span1SPR"> Numero de serie </span>
          <span className="span2SPR"> {singleProducto.numeroSerie}</span>
        </div>
        <div className="stockSPR">
        <span className="span1SPR"> Stock </span>
          <span className="span2SPR"> {singleProducto.stock}</span>
        </div>
        <div className="vcSPR">
        <span className="span1SPR"> Veces comprado </span>
          <span className="span2SPR"> {singleProducto.vecesComprado}</span>
        </div>
        <div className="vvSPR">
        <span className="span1SPR"> Veces vendido</span>
          <span className="span2SPR"> {singleProducto.vecesVendido}</span>
        </div>
      </div>
    </section>
  );
}
export default SingleProducto;
