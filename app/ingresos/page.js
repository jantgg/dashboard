import Image from "next/image";
import "./page.css";

export default function Ingresos() {
  return (
    <main className="home">
      <div className="parent">
        <div className="div1"> Resumen</div>
        <div className="div2"> Comparacion ingresos con meses anteriores</div>
        <div className="div3"> Producto mas vendido</div>
        <div className="div4"> Servicio mas vendido</div>
        <div className="div5"> Historial de ingresos a lo largo del tiempo con facturas y clientes</div>
      </div>
    </main>
  );
}
