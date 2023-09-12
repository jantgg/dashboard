import "./globals.css";
import Sidebar from "./components/sidebar.js";
import fondo from "./images/fondo.jpg";
import Image from "next/image";
import { Toaster } from "sonner";


export default function RootLayout({ children }) {

  return (
    <html lang="es">
      <body>
        <Toaster />
        <Image
          src={fondo}
          alt="Background Image sand"
          fill
          quality={70}
          className="image-background"
        />
        <Sidebar />
        {children}
      </body>
    </html>
  );
}
