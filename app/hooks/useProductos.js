// useProducts.js
"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const useProductos = () => {
  const [productos, setProductos] = useState([]);
  const [singleProducto, setSingleProducto] = useState({
    nombre: "",
    descripcion: "",
    precioCompra: "",
    precioVenta: "",
    iva: "",
    numeroSerie: "",
    stock: "",
    vecesVendido: "",
    vecesComprado: "",
    proveedor: "",
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
    } catch (error) {
      console.error("Error al obtener los productos:", error);
      setError(error);
      toast.error("Error al obtener los productos");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  return { productos, singleProducto, loading, error, getProductos: fetchProductos };
};

export default useProductos;
