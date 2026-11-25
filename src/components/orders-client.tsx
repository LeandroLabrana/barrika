"use client";
import { useEffect, useState } from "react";
import { localDemo } from "@/lib/local-demo";
import type { Order, Wine } from "@/domain";
import { Money } from "./ui";
import { firebaseConfigured } from "@/lib/firebase";
import { receiveOrderTransaction } from "@/lib/firestore-repository";

export function OrdersClient({ wines }: { wines: Wine[] }) {
  const [orders, setOrders] = useState<Order[]>([]);
  useEffect(() => { const sync = () => setOrders(localDemo.orders()); sync(); window.addEventListener("barrika:update", sync); return () => window.removeEventListener("barrika:update", sync); }, []);
  async function receive(order: Order) { const wine = localDemo.wines().find(item => item.id === order.wineId); if (!wine) return; const movementId = `reception-${order.id}`; if (localDemo.movements().some(item => item.id === movementId)) return; if (firebaseConfigured()) await receiveOrderTransaction(order, movementId); localDemo.saveWines(localDemo.wines().map(item => item.id === wine.id ? { ...item, stock: item.stock + order.quantity, lastStockInAt: new Date().toISOString() } : item)); localDemo.saveMovements([...localDemo.movements(), { id: movementId, wineId: order.wineId, quantity: order.quantity, type: "reception", reason: `Recepción ${order.id}`, date: new Date().toISOString(), resultingStock: wine.stock + order.quantity, orderId: order.id }]); const updated = localDemo.orders().map(item => item.id === order.id ? { ...item, status: "received" as const } : item); localDemo.saveOrders(updated); setOrders(updated); }
  const pending = orders.filter(order => order.status === "pending_reception");
  return <div className="panel"><div className="table-wrap"><table><thead><tr><th>Vino</th><th>Proveedor</th><th>Unidades</th><th>Coste</th><th>Estado</th><th></th></tr></thead><tbody>{pending.length===0?<tr><td colSpan={6} className="muted">No hay pedidos pendientes de recepción.</td></tr>:pending.map(order=>{const wine=wines.find(item=>item.id===order.wineId);return <tr key={order.id}><td><strong>{wine?.name || order.wineId}</strong></td><td>{order.supplier}</td><td>{order.quantity}</td><td><Money cents={order.estimatedCostCents}/></td><td><span className="badge low">Pendiente</span></td><td><button onClick={()=>receive(order)}>Recepcionar</button></td></tr>})}</tbody></table></div></div>;
}
