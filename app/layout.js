import "./globals.css";
import Sidebar from "./components/sidebar.js";
import fondo from "./images/fondo.jpg";
import Image from "next/image";
import { Toaster } from "sonner";


export default function RootLayout({ children }) {

  return (
    <html lang="es">
       <head>
        <title>Mi negocio</title>
        <meta name="theme-color" content="white"></meta>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Dancing+Script&display=swap"
          rel="stylesheet"
        />

        <link
          href="https://fonts.googleapis.com/css2?family=Allura&family=Gabarito&family=Merriweather:wght@300;400;700;900&family=New+Rocker&family=Poppins:wght@100;200;300;400;500;600;700;900&family=UnifrakturCook:wght@700&display=swap"
          rel="stylesheet"
        ></link>
        <link rel="stylesheet" as="style" href="https://unpkg.com/flickity@2/dist/flickity.min.css"></link>
        <script src="https://unpkg.com/flickity@2/dist/flickity.pkgd.min.js"></script>
      </head>
      <body className="poppins">
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
