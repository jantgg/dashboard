"use Client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

const ProductosContext = createContext({
    productos: [],
  singleProducto: { nombre: "", cif: "", direccion: "", telefono: "", email: "" },
  setSingleProducto: () => {},
  loading: true,
  error: null,
  fetchProductos: () => {},
});

export const useProductosContext = () => useContext(ProductosContext);

export const ProductosProvider = ({ children }) => {
  const [productos, setProductos] = useState([]);
  const [singleProducto, setSingleProducto] = useState({
    nombre: "",
    cif: "",
    direccion: "",
    telefono: "",
    email: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProductos = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_DATABASE_URL}/product`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setProductos(data);
      if (data && data.length > 0) {
        setSingleProducto(data[0]);
      }
      setLoading(false);
      console.log(" fetch exito");
    } catch (error) {
      console.error("Error al obtener los Productos:", error);
      setError(error);
      toast.error("Error al obtener los Productos");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const value = {
    productos,
    singleProducto,
    setSingleProducto,
    loading,
    error,
    fetchProductos,
  };

  return (
    <ProductosContext.Provider value={value}>
      {children}
    </ProductosContext.Provider>
  );
};
