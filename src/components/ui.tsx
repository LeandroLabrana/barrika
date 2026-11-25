import type { ReactNode } from "react";
import { formatCents, formatPercent, stockStatus } from "@/domain";
import type { Wine } from "@/domain";

export function Money({ cents }: { cents: number }) { return <span>{formatCents(cents)}</span>; }
export function KpiCard({ label, value, detail }: { label: string; value: ReactNode; detail?: string }) { return <div className="card"><p className="eyebrow">{label}</p><p className="kpi-value">{value}</p>{detail && <p className="muted">{detail}</p>}</div>; }
export function StockBadge({ wine }: { wine: Pick<Wine, "stock" | "minStock"> }) { const status = stockStatus(wine); return <span className={`badge ${status}`}>{status === "out" ? "Agotado" : status === "low" ? "Stock bajo" : "Correcto"}</span>; }
export function Metric({ label, cents, percent }: { label: string; cents?: number; percent?: number }) { return <div><p className="muted">{label}</p><strong>{cents !== undefined ? <Money cents={cents} /> : formatPercent(percent ?? 0)}</strong></div>; }
