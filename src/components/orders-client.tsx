"use client";
import { useState } from "react";
import { useAppStore } from "@/lib/app-store";
import { Money } from "./ui";

export function OrdersClient() {
  const { orders, wines, receiveOrder } = useAppStore();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ kind: "success" | "error"; text: string } | null>(null);
  const pending = orders.filter((order) => order.status === "pending_reception");
  async function receive(orderId: string) { setBusyId(orderId); setFeedback(null); try { await receiveOrder(orderId); setFeedback({ kind: "success", text: "Recepción registrada y stock actualizado." }); } catch (error) { setFeedback({ kind: "error", text: error instanceof Error ? error.message : "No se pudo recepcionar el pedido." }); } finally { setBusyId(null); } }
  return <div>{feedback && <p className={`action-feedback ${feedback.kind}`} role="status">{feedback.text}</p>}<div className="panel"><div className="table-wrap"><table><thead><tr><th>Vino</th><th>Proveedor</th><th>Unidades</th><th>Coste</th><th>Estado</th><th></th></tr></thead><tbody>{pending.length===0?<tr><td colSpan={6} className="muted">No hay pedidos pendientes de recepción.</td></tr>:pending.map(order=>{const wine=wines.find(item=>item.id===order.wineId);return <tr key={order.id}><td><strong>{wine?.name || order.wineId}</strong></td><td>{order.supplier}</td><td>{order.quantity}</td><td><Money cents={order.estimatedCostCents}/></td><td><span className="badge low">Pendiente</span></td><td><button disabled={busyId===order.id} onClick={()=>receive(order.id)}>{busyId===order.id?"Guardando…":"Recepcionar"}</button></td></tr>})}</tbody></table></div></div></div>;
}
