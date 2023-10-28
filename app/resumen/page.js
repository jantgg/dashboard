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
        <div className="div1R"> <VentasGastosResumen/></div>
        <div className="div2R"> <TareasUrgentesResumen/></div>
        <div className="div3R"><ComparacionVentas/> </div>
        <div className="div4R"> <ComparacionGastos/></div>
        <div className="div5R"> <MasVendido/></div>
        <div className="div6R"> <MasVendidoS/></div>
      </div>
    </main>
  );
}
