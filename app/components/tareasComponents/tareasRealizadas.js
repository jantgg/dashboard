"use client";
import { useState, useEffect } from "react";
import useTareas from "app/hooks/useTareas";
import "./tareasRealizadas.css";
import { AiOutlineWarning } from "react-icons/ai";
import { FaRegTrashAlt } from "react-icons/fa";
import { LuXCircle } from "react-icons/lu";

function TareasRealizadas() {
  const { tareas, getTareas } = useTareas();

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
    <section>
    <h2 className="tittletareasTR pink-bg">Tareas realizadas</h2>
    <ul className="listatareasTR">
      {tareasRealizadas.map((tarea) => (
        <li key={tarea._id} className="tareaTR">
          <div className="tarealeftcontainerTR">
            {" "}
            <span className="tareanombreTR"> {tarea.titulo}</span>
    
          </div>

          <div className="buttonstareaTR">
            {" "}
            <button
              className="checkTR"
              onClick={() => toggleCompletada(tarea._id, tarea.completada)}
            >
              <LuXCircle />
            </button>
            <button
              className="trashTR"
              onClick={() => deleteTarea(tarea._id)}
            >
              <FaRegTrashAlt />
            </button>
          </div>
        </li>
      ))}
    </ul>
  </section>
  );
}

export default TareasRealizadas;
