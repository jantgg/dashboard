"use client";
import { useState, useEffect } from "react";
import useTareas from "app/hooks/useTareas";


 function TareasUrgentesResumen() {
  const { tareas, getTareas } = useTareas();

  const tareasUrgentes = tareas.filter(
    (tarea) => tarea.urgente && !tarea.completada
  );
  // put de tareas-----------------------------------------------------------------------
  const toggleCompletada = async (tareaId, completada) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_DATABASE_URL}/tarea/${tareaId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ completada: !completada }),
        }
      );

      if (response.ok) {
        // Actualiza el estado local de la tarea
        // const updatedTareas = tareas.map(t =>
        //     t._id === tareaId ? { ...t, completada: !completada } : t
        // );
        // setTareas(updatedTareas);
        getTareas();
      } else {
        const data = await response.json();
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Error al actualizar tarea:", error);
    }
  };

  // delete de tareas-----------------------------------------------------------------------
  const deleteTarea = async (tareaId) => {
    try {
      const confirmation = window.confirm(
        "¿Estás seguro de que deseas eliminar esta tarea?"
      );

      if (!confirmation) {
        return; // No hacer nada si el usuario cancela la eliminación
      }

      const token = localStorage.getItem("token"); // Recuperar el token del localStorage

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_DATABASE_URL}/tarea/${tareaId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        getTareas();
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Error al eliminar tarea:", error);
    }
  };
  return (
    <section>
      <div className="div2">
        <h2>Tareas urgentes</h2>
        <ul>
          {tareasUrgentes.map((tarea) => (
            <li key={tarea._id}>
              {tarea.titulo}
              <button
                onClick={() => toggleCompletada(tarea._id, tarea.completada)}
              >
                {tarea.completada
                  ? "Marcar como no completada"
                  : "Marcar como completada"}
              </button>
              <button onClick={() => deleteTarea(tarea._id)}>Borrar</button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default  TareasUrgentesResumen;