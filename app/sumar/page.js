import Image from "next/image";
import "./page.css";
import VentaNueva from "../components/crearVenta";
import GastoNuevo from "../components/crearGasto";
import CrearTarea from "../components/crearTarea";
import CrearCliente from "../components/clienteComponents/crearCliente";
import CrearProveedor from "../components/proveedorComponents/crearProveedor";


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
        <div class="div3">Añadir Tarea
        <CrearTarea/>
         </div>
        <div class="div4"> Añadir Cliente
        <CrearCliente/>
        </div>
        <div class="div5"> Añadir Proveedor
        <CrearProveedor/>
        </div>

      </div>
    </main>
  );
}
