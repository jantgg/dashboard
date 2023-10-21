"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import "./page.css";
import useTareas from "../hooks/useTareas";
import CrearTarea from "../components/crearTarea";
import { Toaster, toast } from "sonner";

export default function Tareas() {
  const { tareas, loading, error, getTareas } = useTareas();

  // Clasificar tareas
  const tareasPendientes = tareas
    ? tareas.filter((tarea) => !tarea.completada)
    : [];

  const tareasParaHoy = tareas.filter(
    (tarea) =>
      !tarea.completada &&
      new Date(tarea.fechaVencimiento).toDateString() ===
        new Date().toDateString()
  );
  const tareasUrgentes = tareas.filter(
    (tarea) => tarea.urgente && !tarea.completada
  );
  const tareasRealizadas = tareas.filter((tarea) => tarea.completada);

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
    <main className="home">
      <Toaster />
      <div className="parent">
        <div className="div1">
          <h2>Tareas pendientes</h2>
          <ul>
            {tareasPendientes.map((tarea) => (
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

        <div className="div4">
          <CrearTarea />
        </div>

        <div className="div3">
          <h2>Tareas para hoy</h2>
          <ul>
            {tareasParaHoy.map((tarea) => (
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
        <div className="div5">
          <h2>Tareas realizadas</h2>
          <ul>
            {tareasRealizadas.map((tarea) => (
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
      </div>
    </main>
  );
}
