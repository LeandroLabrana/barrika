import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/nav";
import { StoreProvider } from "@/lib/app-store";

export const metadata: Metadata = { title: "Barrika · Vinoteca", description: "Gestión sencilla de stock y rentabilidad para Barrika", icons: { icon: "/barrika-logo.svg" } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="es"><body><StoreProvider><Nav /><main className="main">{children}</main></StoreProvider></body></html>; }
