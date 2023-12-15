"use client";
import { useState, useEffect } from "react";
import useTareas from "app/hooks/useTareas";
import "./tareasUrgentesResumen.css";
import { AiOutlineWarning } from "react-icons/ai";
import { FaRegTrashAlt } from "react-icons/fa";
import { BsCheckCircle } from "react-icons/bs";

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
      <h2 className="tittletareasRVG orange-bg">Tareas urgentes</h2>
      <ul className="listatareasRVG">
        {tareasUrgentes.map((tarea) => (
          <li key={tarea._id} className="tareaRVG">
            {/* <AiOutlineWarning className="warningRVG" /> */}
            <span className="tareanombreRVG"> {tarea.titulo}</span>
            <div className="buttonstareaRVG">
              {" "}
              <button
              className="checkRVG"
                onClick={() => toggleCompletada(tarea._id, tarea.completada)}
              >
                <BsCheckCircle  />
              </button>
              <button className="trashRVG" onClick={() => deleteTarea(tarea._id)}>
                <FaRegTrashAlt  />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default TareasUrgentesResumen;
