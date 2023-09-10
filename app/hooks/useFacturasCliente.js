"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const useFacturasCliente = () => {
  const [facturas, setFacturas] = useState([]);
  const [singleFactura, setSingleFactura] = useState({
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFacturas = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_DATABASE_URL}/clientbills`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setFacturas(data);
      if (data && data.length > 0) {
        setSingleFactura(data[0]);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener los Facturas:", error);
      setError(error);
      toast.error("Error al obtener los Facturas");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacturas();
  }, []);

  return {
    facturas,
    singleFactura,
    setSingleFactura,
    loading,
    error,
    getFacturas: fetchFacturas,
  };
};

export default useFacturasCliente;
