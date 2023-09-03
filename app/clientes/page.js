import Image from "next/image";
import "./page.css";

export default function Clientes() {
  return (
    <main className="home">
      <div class="parent">
        <div class="div1">Lista de clientes </div>
        <div class="div2">Incremento de clientes por mes </div>
        <div class="div3">
          {" "}
          Vista detallada del cliente con Historial de compra del cliente
        </div>
        <div class="div4"> Añadir Cliente</div>
      </div>
    </main>
  );
}
