"use client"
import { useState, useEffect } from 'react';
import { toast } from "sonner";

const useVentas = () => {
    const [ventas, setVentas] = useState([]);
    const [singleVenta, setSingleVenta] = useState({
        productos: [],
        cliente: {},
        factura: {},
        fecha: "",
        cantidadNeta: 0,
        cantidadBruta: 0,
        iva: 0,
        detalles: "",
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchVentas = async () => {
        const token = localStorage.getItem("token");
        setLoading(true);
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_DATABASE_URL}/sales`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const data = await response.json();
            setVentas(data);
            if (data && data.length > 0) {
                setSingleVenta(data[0]);
            }
            setLoading(false);
        } catch (error) {
            console.error("Error al obtener los Ventas:", error);
            setError(error);
            toast.error("Error al obtener los Ventas");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVentas();
    }, []);

    return { ventas, singleVenta, setSingleVenta, loading, error, getVentas: fetchVentas };
};

export default useVentas;