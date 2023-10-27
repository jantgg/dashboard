import Image from "next/image";
import "./page.css";
import VentasGastosResumen from "../components/resumenComponents/ventasGastosResumen.js";
import TareasUrgentesResumen from "../components/resumenComponents/tareasUrgentesResumen.js";
import ComparacionVentas from "../components/ventaComponents/comparacionVentas.js";
import MasVendido from "../components/ventaComponents/masVendido.js";
import ComparacionGastos from "../components/gastoComponents/comparacionGastos.js";
import MasVendidoS from "../components/ventaComponents/masVendidoS.js";



export default function Resumen() {
  return (
    <main className="home">
      <div className="parent">
        <div className="div1"> <VentasGastosResumen/></div>
        <div className="div2"> <TareasUrgentesResumen/></div>
        <div className="div3"><ComparacionVentas/> </div>
        <div className="div4"> <ComparacionGastos/></div>
        <div className="div5"> <MasVendido/></div>
        <div className="div6"> <MasVendidoS/></div>
      </div>
    </main>
  );
}
