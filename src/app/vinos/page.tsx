import Link from "next/link";
import { demoWines } from "@/lib/demo-data";
import { WineCard } from "@/components/wine-card";
export default function WinesPage(){return <><div className="page-header"><div><p className="eyebrow">Catálogo</p><h1>Vinos</h1><p className="page-subtitle">Cada referencia con su precio, rentabilidad y estado de inventario.</p></div><Link className="button" href="/vinos/nuevo">+ Añadir vino</Link></div><div className="grid grid-3">{demoWines.map(wine=><WineCard key={wine.id} wine={wine}/>)}</div></>}
