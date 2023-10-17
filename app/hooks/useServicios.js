
"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const useServicios = () => {
  const [servicios, setServicios] = useState([]);
  const [singleServicio, setSingleServicio] = useState({
    usuario: '',
    nombre: '',
    descripcion: '',
    precioVenta: '',
    iva: '',
    vecesVendido: '' // Solo para servicios
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchServicios = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_DATABASE_URL}/service`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setServicios(data);
      if (data && data.length > 0) {
        setSingleServicio(data[0]);
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
    fetchServicios();
  }, []);

  return { servicios, singleServicio, loading, error, getServicios: fetchServicios };
};

export default useServicios;
