import "./globals.css";
import Sidebar from "./components/sidebar.js";
import fondo from "./images/fondo.jpg";
import Image from "next/image";

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <Image
          src={fondo}
          alt="Background Image"
          fill
          quality={70}
          className="image-background"
        />
        <Sidebar />
        <main> {children}</main>
      </body>
    </html>
  );
}
