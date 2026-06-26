"use client";

import jsPDF from "jspdf";
import { toPng } from "html-to-image";

export async function downloadApplicationPdf(applicationId: string) {
  const element = document.getElementById(`application-pdf-${applicationId}`);

  if (!element) return;

  const dataUrl = await toPng(element, {
    cacheBust: true,
    pixelRatio: 2,
    backgroundColor: "#07111f",
  });

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "px",
    format: "a4",
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  const image = new Image();
  image.src = dataUrl;

  await new Promise((resolve) => {
    image.onload = resolve;
  });

  const imgWidth = pdfWidth;
  const imgHeight = (image.height * imgWidth) / image.width;

  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(dataUrl, "PNG", 0, position, imgWidth, imgHeight);
  heightLeft -= pdfHeight;

  while (heightLeft > 0) {
    position -= pdfHeight;
    pdf.addPage();
    pdf.addImage(dataUrl, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;
  }

  pdf.save(`uninexa-application-${applicationId}.pdf`);
}