"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [["/", "Resumen"], ["/vinos", "Vinos"], ["/reponer", "Reponer"], ["/pedidos", "Pedidos"], ["/movimientos", "Movimientos"], ["/configuracion", "Configuración"]];
export function Nav() { const pathname = usePathname(); return <aside className="sidebar"><Link href="/" className="brand"><img src="/barrika-logo.svg" alt="Barrika" /></Link><p className="sidebar-label">Gestión de vinoteca</p><nav>{links.map(([href, label]) => <Link key={href} href={href} className={pathname === href || (href !== "/" && pathname.startsWith(href)) ? "active" : ""}>{label}</Link>)}</nav><div className="sidebar-foot"><span className="dot" />Sistema operativo</div></aside>; }
