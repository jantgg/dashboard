
"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const useServiciosProveedor = () => {
  const [serviciosP, setServiciosP] = useState([]);
  const [singleServicioP, setSingleServicioP] = useState({
    usuario: '',
    nombre: '',
    descripcion: '',
    precioCompra: '',
    iva: '',
    proveedor: '',
    vecesComprado: '' // Solo para servicios
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchServiciosP = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_DATABASE_URL}/servicep`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setServiciosP(data);
      if (data && data.length > 0) {
        setSingleServicioP(data[0]);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener los Servicios:", error);
      setError(error);
      toast.error("Error al obtener los Servicios");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServiciosP();
  }, []);

  return { serviciosP, singleServicioP, loading, error, getServiciosP: fetchServiciosP };
};

export default useServiciosProveedor;
