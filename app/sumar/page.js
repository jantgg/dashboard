import Image from "next/image";
import "./page.css";
import VentaNueva from "../components/crearVenta";
import GastoNuevo from "../components/crearGasto";

export default function Sumar() {
  return (
    <main className="home">
      <div class="parent">
        <div class="div1Sumar">
          <GastoNuevo />
        </div>
        <div class="div2Sumar">
          <VentaNueva />
        </div>
      </div>
    </main>
  );
}
