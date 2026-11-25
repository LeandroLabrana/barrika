import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/nav";

export const metadata: Metadata = { title: "Barrika · Vinoteca", description: "Gestión sencilla de stock y rentabilidad para Barrika", icons: { icon: "/barrika-logo.svg" } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="es"><body><Nav /><main className="main">{children}</main></body></html>; }
