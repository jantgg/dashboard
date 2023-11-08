"use client";
import { useState, useEffect } from "react";
import useTareas from "app/hooks/useTareas";
import "./tareasPendientes.css";
import { AiOutlineWarning } from "react-icons/ai";
import { FaRegTrashAlt } from "react-icons/fa";
import { BsCheckCircle } from "react-icons/bs";

function TareasPendientes() {
  const { tareas, getTareas } = useTareas();

  const tareasPendientes = tareas
    ? tareas.filter((tarea) => !tarea.completada)
    : [];
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
      <h2 className="tittletareasTP">Tareas pendientes</h2>
      <ul className="listatareasTP">
        {tareasPendientes.map((tarea) => (
          <li key={tarea._id} className="tareaTP">
            <div className="tarealeftcontainerTP">
              {" "}
              <span className="tareanombreTP"> {tarea.titulo}</span>
              <span className="tareadescripcionTP">{tarea.descripcion}</span>
            </div>

            <div className="buttonstareaTP">
              {" "}
              <button
                className="checkTP"
                onClick={() => toggleCompletada(tarea._id, tarea.completada)}
              >
                <BsCheckCircle />
              </button>
              <button
                className="trashTP"
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

export default TareasPendientes;
