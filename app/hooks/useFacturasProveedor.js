"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const useFacturasProveedor = () => {
  const [facturasP, setFacturasP] = useState([]);
  const [singleFacturaP, setSingleFacturaP] = useState({
    productos: [],
    servicios: [],
    proveedor: {},
    gasto: {},
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
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const selectFactura = (numeroFactura) => {
    const selectedFactura = facturasP.find(factura => factura._id === numeroFactura);
    setSingleFacturaP(selectedFactura);
  };
  

  const fetchFacturasP = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_DATABASE_URL}/supplierbills`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setFacturasP(data);
      if (data && data.length > 0) {
        setSingleFacturaP(data[0]);
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
    fetchFacturasP();
  }, []);

  return {
    facturasP,
    singleFacturaP,
    setSingleFacturaP,
    loading,
    error,
    getFacturas: fetchFacturasP,
    selectFactura,
  };
};

export default useFacturasProveedor;
