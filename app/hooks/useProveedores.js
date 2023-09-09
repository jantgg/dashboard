"use client"
import { useState, useEffect } from 'react';
import { toast } from "sonner";

const useProveedores = () => {
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
            console.error("Error al obtener los proveedores:", error);
            setError(error);
            toast.error("Error al obtener los proveedores");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProveedores();
    }, []);

    return { proveedores, singleProveedor, setSingleProveedor, loading, error, getProveedores: fetchProveedores };
};

export default useProveedores;
