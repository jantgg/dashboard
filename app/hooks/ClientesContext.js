"use Client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

const ClientesContext = createContext({
  clientes: [],
  singleCliente: { nombre: "", cif: "", direccion: "", telefono: "", email: "" },
  setSingleCliente: () => {},
  loading: true,
  error: null,
  fetchClientes: () => {},
});

export const useClientesContext = () => useContext(ClientesContext);

export const ClientesProvider = ({ children }) => {
  const [clientes, setClientes] = useState([]);
  const [singleCliente, setSingleCliente] = useState({
    nombre: "",
    cif: "",
    direccion: "",
    telefono: "",
    email: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchClientes = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_DATABASE_URL}/clients`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setClientes(data);
      if (data && data.length > 0) {
        setSingleCliente(data[0]);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener los clientes:", error);
      setError(error);
      toast.error("Error al obtener los clientes");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const value = {
    clientes,
    singleCliente,
    setSingleCliente,
    loading,
    error,
    fetchClientes,
  };

  return (
    <ClientesContext.Provider value={value}>
      {children}
    </ClientesContext.Provider>
  );
};
