import Image from "next/image";
import "./page.css";
import VentaNueva from "../components/crearVenta";
import GastoNuevo from "../components/crearGasto";


export default function Sumar() {
  return (
    <main className="home">
      <div class="parent">
        <div class="div1">Añadir Gasto y producto
        <GastoNuevo/>
        </div>
        <div class="div2">Añadir Venta
        <VentaNueva/>
        
        </div>
        <div class="div3">Añadir Tarea </div>
        <div class="div4"> Añadir Cliente</div>
        <div class="div5"> Añadir Proveedor</div>

      </div>
    </main>
  );
}
