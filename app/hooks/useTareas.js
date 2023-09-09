"use client"
import { useState, useEffect } from 'react';
import { toast } from "sonner";

const useTareas = () => {
    const [tareas, setTareas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchTareas = async () => {
        const token = localStorage.getItem("token");
        setLoading(true);
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_DATABASE_URL}/tarea`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const data = await response.json();
            setTareas(data);
            setLoading(false);
        } catch (error) {
            console.error("Error al obtener las tareas:", error);
            setError(error);
            toast.error("Error al obtener las tareas");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTareas();
    }, []);

    return { tareas, loading, error, getTareas: fetchTareas };
};

export default useTareas;
