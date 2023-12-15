"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import "./page.css";
import useTareas from "../hooks/useTareas";
import CrearTarea from "../components/tareasComponents/nuevaTarea";
import TareasUrgentes from "../components/tareasComponents/tareasUrgentes.js";
import TareasHoy from "../components/tareasComponents/tareasHoy.js";
import TareasPendientes from "../components/tareasComponents/tareasPendientes.js";
import TareasRealizadas from "../components/tareasComponents/tareasRealizadas.js";
import { Toaster, toast } from "sonner";

export default function Tareas() {
  const { tareas, loading, error, getTareas } = useTareas();

  return (
    <main className="home">
      <Toaster />
      <div className="parent">
        <div className="div1T">
       <TareasPendientes/>
        </div>

        <div className="div4T">
          <CrearTarea />
        </div>

        <div className="div3T">
       <TareasHoy/>
        </div>
        <div className="div2T">
         <TareasUrgentes/>
        </div>
        <div className="div5T">
        <TareasRealizadas/>
        </div>
      </div>
    </main>
  );
}
