"use client"
import Image from "next/image";
import "./pdf.css";
import useFacturasCliente from '../hooks/useFacturasCliente';  // Asegúrate de ajustar la ruta al hook si es necesario

export default function Pdfview() {
  const { singleFactura } = useFacturasCliente();

  // Si aún no se ha cargado la factura, muestra un mensaje o un loader
  if (!singleFactura) return <p>Cargando factura...</p>;

  return (
    <main className="pdf-background">
      <div className="pdf-container">
        <h1>Factura</h1>
        <div className="header1">
          <div className="numero">Numero factura: {singleFactura.numeroFactura}</div>
          <div className="">Fecha emisión: {singleFactura.fechaEmision}</div>
          <div className="">Fecha cobro: {singleFactura.fechaOperacion}</div>
        </div>
        <div className="header2">
          <div className="header2-son">
            <h2 className="">Cliente</h2>
            <div className="">{singleFactura.cliente.nombre}</div>
            <div className="">{singleFactura.cliente.NIF}</div>
            <div className="">{singleFactura.cliente.direccionFiscal}</div>
          </div>
          <div className="header2-son">
            <h2 className="">Emisor</h2>
            <div className="">Nombre y apellidos del emisor</div>
            <div className="">NIF/CIF del emisor</div>
            <div className="">Dirección fiscal del emisor</div>
          </div>
        </div>
        <div className="tabla">
          {/* Aquí puedes renderizar información adicional, como los productos de la factura */}
        </div>
      </div>
    </main>
  );
}

