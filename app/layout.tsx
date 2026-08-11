import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "¿Tu idea es una AI App viable?",
  description:
    "Contá tu idea en 4 pasos y recibí un diagnóstico con IA: encaje como AI App, primer módulo a construir y tu riesgo principal.",
};

export const viewport: Viewport = {
  themeColor: "#0b0b12",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
