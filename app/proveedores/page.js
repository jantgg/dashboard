import Image from "next/image";
import "./page.css";

export default function Proveedores() {
  return (
    <main className="home">
    <div class="parent">
      <div class="div1">Lista de proveedores </div>
      <div class="div2">Gasto en proveedores por mes </div>
      <div class="div3">
        {" "}
        Vista detallada del proveedor con Historial de compra del proveedor
      </div>
      <div class="div4"> Añadir Proveedor</div>
    </div>
  </main>
  );
}
