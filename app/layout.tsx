import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Diagnóstico de idea",
  description: "Shell mínimo — M0-01 (esqueleto desplegado).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
