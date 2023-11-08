"use client";
import React, { useState } from "react";
import { Toaster, toast } from "sonner";
import useTareas from "../hooks/useTareas";

function CrearTarea() {
  const { tareas, loading, error, getTareas } = useTareas();

  //post
  const [tareaData, setTareaData] = useState({
    titulo: "",
    descripcion: "",
    urgente: false,
    fechaVencimiento: new Date(),
    completada: false,
  });

  const addTarea = async (tareaData) => {
    try {
      const token = localStorage.getItem("token"); // Recuperar el token del localStorage
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_DATABASE_URL}/tarea`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(tareaData),
        }
      );

      const data = await response.json();
      if (response.ok) {
        // Limpiar el formulario
        setTareaData({
          titulo: "",
          descripcion: "",
          urgente: false,
          fechaVencimiento: new Date(),
          completada: false,
        });
        getTareas();
        // Mostrar una notificación de éxito
        toast.success("Tarea añadida con éxito!");
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Error al añadir tarea:", error);
      // Mostrar una notificación de error
      toast.error(`Error al añadir tarea: ${error.message}`);
    }
  };

  return (
    <div className="">
      {" "}
      <h2>Añadir tareas</h2>
      <div className="task-inputs">
        <label>
          Título:
          <input
            type="text"
            value={tareaData.titulo}
            onChange={(e) =>
              setTareaData((prev) => ({ ...prev, titulo: e.target.value }))
            }
          />
        </label>

        <label>
          Descripción:
          <textarea
            value={tareaData.descripcion}
            onChange={(e) =>
              setTareaData((prev) => ({
                ...prev,
                descripcion: e.target.value,
              }))
            }
          />
        </label>

        <label>
          ¿Es urgente?
          <input
            type="checkbox"
            checked={tareaData.urgente}
            onChange={(e) =>
              setTareaData((prev) => ({
                ...prev,
                urgente: e.target.checked,
              }))
            }
          />
        </label>

        <label>
          Fecha de vencimiento:
          <input
            type="date"
            value={tareaData.fechaVencimiento.toISOString().split("T")[0]}
            onChange={(e) =>
              setTareaData((prev) => ({
                ...prev,
                fechaVencimiento: new Date(e.target.value),
              }))
            }
          />
        </label>

        <label>
          ¿Está completada?
          <input
            type="checkbox"
            checked={tareaData.completada}
            onChange={(e) =>
              setTareaData((prev) => ({
                ...prev,
                completada: e.target.checked,
              }))
            }
          />
        </label>

        <button onClick={() => addTarea(tareaData)}>Añadir tarea</button>
      </div>
    </div>
  );
}
export default CrearTarea;
