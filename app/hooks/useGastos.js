"use client"
import { useState, useEffect } from 'react';
import { toast } from "sonner";

const useGastos = () => {
    const [gastos, setGastos] = useState([]);
    const [singleGasto, setSingleGasto] = useState({
        productos: [],
        servicios: [],
        proveedor: {},
        facturaProveedor: {},
        fecha: "",
        cantidadNeta: 0,
        cantidadBruta: 0,
        iva: 0,
        detalles: "",
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchGastos = async () => {
        const token = localStorage.getItem("token");
        setLoading(true);
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_DATABASE_URL}/expenses`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const data = await response.json();
            setGastos(data);
            if (data && data.length > 0) {
                setSingleGasto(data[0]);
            }
            setLoading(false);
        } catch (error) {
            console.error("Error al obtener los Gastos:", error);
            setError(error);
            toast.error("Error al obtener los Gastos");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGastos();
    }, []);

    return { gastos, singleGasto, setSingleGasto, loading, error, getGastos: fetchGastos };
};

export default useGastos;