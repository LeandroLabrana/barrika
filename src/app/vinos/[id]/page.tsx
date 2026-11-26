import Link from "next/link";
import { notFound } from "next/navigation";
import { demoSettings, demoWines } from "@/lib/demo-data";
import { calculatePrices, replenishment } from "@/domain";
import { Money, Metric, StockBadge } from "@/components/ui";
import { MovementActions } from "@/components/demo-actions";

export default async function WineDetail({params}:{params:Promise<{id:string}>}){
  const {id}=await params;
  const wine=demoWines.find(item=>item.id===id);
  if(!wine) notFound();
  const take=calculatePrices(wine,"takeaway",demoSettings);
  const local=calculatePrices(wine,"onPremise",demoSettings);
  const suggestion=replenishment(wine);
  return <>
    <div className="page-header"><div><p className="eyebrow">Ficha de producto · {wine.appellation}</p><h1>{wine.name}</h1><p className="page-subtitle">{wine.winery} · Añada {wine.vintage} · {wine.location}</p></div><div className="actions"><StockBadge wine={wine}/><Link className="button secondary" href="/vinos">← Catálogo</Link></div></div>
    <div className="grid grid-3"><div className="card"><p className="eyebrow">Producto</p><h3>{wine.winery}</h3><p className="muted">{wine.appellation}</p><div className="metrics"><Metric label="Proveedor"/><strong>{wine.supplier || wine.winery}</strong></div></div><div className="card"><p className="eyebrow">Inventario</p><p className="kpi-value">{wine.stock} uds.</p><p className="muted">Mínimo {wine.minStock} · Objetivo {wine.targetStock}</p><p className="muted">{wine.location}</p></div><div className="card"><p className="eyebrow">Reposición sugerida</p><p className="kpi-value">{suggestion.quantity} uds.</p><p className="muted">Coste estimado <Money cents={suggestion.estimatedCostCents}/></p></div></div>
    <section className="section panel"><p className="eyebrow">Precios y rentabilidad</p><h2>Dos maneras de disfrutarlo</h2><div className="price-grid"><div className="price-block"><h3>Para llevar</h3><div className="metrics"><Metric label="Venta sin IVA" cents={take.saleExVatCents}/><Metric label="Precio final" cents={take.finalPriceCents}/><Metric label="IVA" cents={take.outputVatCents}/></div><div className="metrics"><Metric label="Ganancia" cents={take.grossProfitCents}/><Metric label="Markup" percent={take.markupPercent}/><Metric label="Margen" percent={take.marginPercent}/></div></div><div className="price-block"><h3>En local</h3><div className="metrics"><Metric label="Venta sin IVA" cents={local.saleExVatCents}/><Metric label="Precio final" cents={local.finalPriceCents}/><Metric label="IVA" cents={local.outputVatCents}/></div><div className="metrics"><Metric label="Ganancia" cents={local.grossProfitCents}/><Metric label="Markup" percent={local.markupPercent}/><Metric label="Margen" percent={local.marginPercent}/></div></div></div></section>
    <section className="section panel"><p className="eyebrow">Inventario</p><h2>Registrar movimiento</h2><p className="muted" style={{marginBottom:16}}>Cada operación actualiza el stock y queda registrada en el historial.</p><MovementActions wine={wine}/></section>
  </>;
}
