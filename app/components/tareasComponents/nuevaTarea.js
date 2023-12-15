"use client";
import React, { useState } from "react";
import { Toaster, toast } from "sonner";
import useTareas from "app/hooks/useTareas.js";
import { BsFillPersonFill } from "react-icons/bs";
import "./nuevaTarea.css";
import { MdOutlineDescription } from "react-icons/md";


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
    <section className="sectionCTA">
      {" "}
      <h2 className="green-bg">Añadir tareas</h2>


      <div className="inputgroupCTA">
            <span className="iconCTA">
              <BsFillPersonFill />
            </span>
            <input
              className="inputCTA"
              placeholder="Nombre"
              autoComplete="nope"
              type="text"
              value={tareaData.titulo}
              onChange={(e) =>
                setTareaData((prev) => ({ ...prev, titulo: e.target.value }))
              }
            />
          </div>

          <div className="inputgroupCTA">
            <span className="iconCTA">
            <MdOutlineDescription />
            </span>
            <textarea
               className="inputCTA"
               placeholder="Descripción"
               autoComplete="nope"
               value={tareaData.descripcion}
               onChange={(e) =>
                 setTareaData((prev) => ({
                   ...prev,
                   descripcion: e.target.value,
                 }))
               }
            />
          </div>

       

        <div className="inputgroupCTA-f">
            <span className="iconCTA-f">Fecha objetivo</span>
          <input
              className="inputCTA-f"
              placeholder="Fecha objetivo"
              autoComplete="nope"
              type="date"
            value={tareaData.fechaVencimiento.toISOString().split("T")[0]}
            onChange={(e) =>
              setTareaData((prev) => ({
                ...prev,
                fechaVencimiento: new Date(e.target.value),
              }))
            }
          />
        </div>

        <div className="inputgroupCTA-h">
          <span className=" inputcheckCTA">  ¿Es urgente?</span>
          <input
            className="checkboxCTA"
            type="checkbox"
            checked={tareaData.urgente}
            onChange={(e) =>
              setTareaData((prev) => ({
                ...prev,
                urgente: e.target.checked,
              }))
            }
          />{" "}
        </div>{" "}


        <div className="inputgroupCTA-h">
          <span className=" inputcheckCTA">    ¿Está completada?</span>
          <input
            className="checkboxCTA"
            type="checkbox"
            checked={tareaData.completada}
            onChange={(e) =>
              setTareaData((prev) => ({
                ...prev,
                completada: e.target.checked,
              }))
            }
          />{" "}
        </div>{" "}

        <button className="buttonCTA green-bg" onClick={() => addTarea(tareaData)}>Añadir</button>

    </section>
  );
}
export default CrearTarea;
