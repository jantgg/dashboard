import Image from "next/image";
import "./page.css";

export default function Tareas() {
  return (
    <main className="home">
    <div className="parent">
      <div className="div1"> Tareas pendientes</div>
      <div className="div2"> Añadir tareas</div>
      <div className="div3"> Tareas para hoy</div>
      <div className="div4"> Tareas urgentes</div>
      <div className="div5"> Tareas realizadas</div>
    </div>
  </main>
  );
}
