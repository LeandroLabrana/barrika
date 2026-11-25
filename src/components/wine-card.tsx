import Link from "next/link";
import type { Wine } from "@/domain";
import { replenishment } from "@/domain";
import { Money, StockBadge } from "./ui";
export function WineCard({ wine }: { wine: Wine }) { const suggestion = replenishment(wine); return <Link href={`/vinos/${wine.id}`} className="wine-card"><div className="wine-card-top"><div><p className="eyebrow">{wine.appellation} · {wine.vintage}</p><h3>{wine.name}</h3><p className="muted">{wine.winery}</p></div><StockBadge wine={wine} /></div><div className="wine-card-bottom"><span>{wine.stock} uds. · {wine.location}</span>{suggestion.quantity > 0 && <span className="wine-cost">Reponer {suggestion.quantity} · <Money cents={suggestion.estimatedCostCents} /></span>}</div></Link>; }
