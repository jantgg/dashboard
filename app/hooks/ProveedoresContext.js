"use Client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

const ProveedoresContext = createContext({
    proveedores: [],
  singleProveedor: { nombre: "", cif: "", direccion: "", telefono: "", email: "" },
  setSingleProveedor: () => {},
  loading: true,
  error: null,
  fetchProveedores: () => {},
});

export const useProveedoresContext = () => useContext(ProveedoresContext);

export const ProveedoresProvider = ({ children }) => {
  const [proveedores, setProveedores] = useState([]);
  const [singleProveedor, setSingleProveedor] = useState({
    nombre: "",
    cif: "",
    direccion: "",
    telefono: "",
    email: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProveedores = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_DATABASE_URL}/suppliers`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setProveedores(data);
      if (data && data.length > 0) {
        setSingleProveedor(data[0]);
      }
      setLoading(false);
    } catch (error) {
   
      setError(error);
      toast.error("Error al obtener los Proveedores");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProveedores();
  }, []);

  const value = {
    proveedores,
    singleProveedor,
    setSingleProveedor,
    loading,
    error,
    fetchProveedores,
  };

  return (
    <ProveedoresContext.Provider value={value}>
      {children}
    </ProveedoresContext.Provider>
  );
};
