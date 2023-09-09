"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import "./page.css";
import useTareas from "../hooks/useTareas";
import { Toaster, toast } from "sonner";

export default function Tareas() {
  const { tareas, loading, error, getTareas } = useTareas();

  //post
  const [tareaData, setTareaData] = useState({
    titulo: "",
    descripcion: "",
    urgente: false,
    fechaVencimiento: new Date(),
    completada: false,
  });
  //put
  const [tareaId, setTareaId] = useState(null); // Id de la tarea que quieres actualizar
  const [updatedData, setUpdatedData] = useState({
    titulo: "",
    descripcion: "",
    urgente: false,
    fechaVencimiento: new Date(),
    completada: false,
  });
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

  // post de tareas-----------------------------------------------------------------------
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
        fetchTareas();
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
        fetchTareas();
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
