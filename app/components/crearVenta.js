"use client";
import React, { useState } from "react";
import "./crearProducto.css";
import { Toaster, toast } from "sonner";
import useVentas from "../hooks/useVentas";

function VentaNueva() {
  const { ventas, singleVenta, setSingleVenta, loading, error, getVentas } =
    useVentas();

  const [ventaData, setVentaData] = useState({
    productos: [],
    cliente: {},
    factura: {},
    fecha: "",
    cantidadNeta: 0,
    cantidadBruta: 0,
    iva: 0,
    detalles: "",
  });
  const [facturaClienteData, setFacturaClienteData] = useState({
    productos: [],
    cliente: {},
    venta: {},
    numeroFactura: "",
    fechaEmision: "",
    fechaOperacion: "",
    cantidadNeta: 0,
    cantidadBruta: 0,
    iva: 0,
    detalles: "",
    pdfFactura: "",
    estado: "",
    cuotaTributaria: "",
    servicio: "",
    valorServicio: 0,
  });

  const addVentaYFactura = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_DATABASE_URL}/sales`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            venta: ventaData,
            facturaCliente: facturaClienteData
          }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        toast.success("Venta y factura creadas con éxito!");
        // Aquí puedes resetear los estados si lo consideras necesario
        setVentaData({
    productos: [],
    cliente: {},
    factura: {},
    fecha: "",
    cantidadNeta: 0,
    cantidadBruta: 0,
    iva: 0,
    detalles: "",
  });
        setFacturaClienteData({
    productos: [],
    cliente: {},
    venta: {},
    numeroFactura: "",
    fechaEmision: "",
    fechaOperacion: "",
    cantidadNeta: 0,
    cantidadBruta: 0,
    iva: 0,
    detalles: "",
    pdfFactura: "",
    estado: "",
    cuotaTributaria: "",
    servicio: "",
    valorServicio: 0,
  });
        getVentas();
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Error al añadir Venta y Factura:", error);
      toast.error(`Error al añadir Venta y Factura: ${error.message}`);
    }
  };
  

  return (
    <div>
      <Toaster />
      <label>
        Nombre:
        <input
          type="text"
          value={ventaData.nombre}
          onChange={(e) =>
            setVentaData((prev) => ({ ...prev, nombre: e.target.value }))
          }
        />
      </label>

      <label>
        cif:
        <textarea
          value={ventaData.cif}
          onChange={(e) =>
            setVentaData((prev) => ({
              ...prev,
              cif: e.target.value,
            }))
          }
        />
      </label>

      <label>
        direccion:
        <input
          value={ventaData.direccion}
          onChange={(e) =>
            setVentaData((prev) => ({
              ...prev,
              direccion: e.target.value,
            }))
          }
        />
      </label>

      <label>
        telefono:
        <input
          value={ventaData.telefono}
          onChange={(e) =>
            setVentaData((prev) => ({
              ...prev,
              telefono: e.target.value,
            }))
          }
        />
      </label>

      <label>
        email:
        <input
          value={ventaData.email}
          onChange={(e) =>
            setVentaData((prev) => ({
              ...prev,
              email: e.target.value,
            }))
          }
        />
      </label>

      <button onClick={() => addVenta(ventaData)}>Añadir Venta</button>
    </div>
  );
}
export default VentaNueva;
