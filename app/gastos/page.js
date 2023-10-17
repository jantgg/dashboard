import Image from "next/image";
import "./page.css";


export default function Gastos() {
  return (
    <main className="home">
    <div className="parent">
      <div className="div1"> Resumen</div>
      <div className="div2"> Comparacion Gastos con meses anteriores</div>
      <div className="div3"> Productos adquiridos</div>
      <div className="div4"> Gastos fijos</div>
      <div className="div5"> Historial de gastos a lo largo del tiempo con facturas y clientes</div>
    </div>
  </main>
  );
}
