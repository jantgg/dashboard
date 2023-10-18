// fetchInvoice.js

import { Toaster, toast } from "sonner";

const generarPdf = async (invoiceId) => {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_DATABASE_URL}/generatePDF/${invoiceId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/pdf",
        },
      }
    );

    if (response.status !== 200) {
      const errorMessage = await response.text();
      throw new Error(errorMessage);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = `invoice-${invoiceId}.pdf`;

    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("Factura descargada con éxito!");
  } catch (error) {
    console.error("Error fetching the invoice:", error);
    // Handle the error accordingly, maybe show a notification to the user.
    toast.error(`Error al descargar la factura: ${error.message}`);
  }
};

export default generarPdf;
