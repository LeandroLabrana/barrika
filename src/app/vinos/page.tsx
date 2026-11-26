"use client";
import Link from "next/link";
import { WineCard } from "@/components/wine-card";
import { useAppStore } from "@/lib/app-store";

export default function WinesPage(){const { wines } = useAppStore();return <><div className="page-header"><div><p className="eyebrow">Catálogo</p><h1>Vinos</h1><p className="page-subtitle">Cada referencia con su precio, rentabilidad y estado de inventario.</p></div><Link className="button" href="/vinos/nuevo">+ Añadir vino</Link></div><div className="grid grid-3">{wines.map(wine=><WineCard key={wine.id} wine={wine}/>)}</div></>}
