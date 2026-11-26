"use client";
import { useAppStore } from "@/lib/app-store";
import { Money } from "./ui";

export function OrdersClient() {
  const { orders, wines, receiveOrder } = useAppStore();
  const pending = orders.filter((order) => order.status === "pending_reception");
  return <div className="panel"><div className="table-wrap"><table><thead><tr><th>Vino</th><th>Proveedor</th><th>Unidades</th><th>Coste</th><th>Estado</th><th></th></tr></thead><tbody>{pending.length===0?<tr><td colSpan={6} className="muted">No hay pedidos pendientes de recepción.</td></tr>:pending.map(order=>{const wine=wines.find(item=>item.id===order.wineId);return <tr key={order.id}><td><strong>{wine?.name || order.wineId}</strong></td><td>{order.supplier}</td><td>{order.quantity}</td><td><Money cents={order.estimatedCostCents}/></td><td><span className="badge low">Pendiente</span></td><td><button onClick={()=>receiveOrder(order.id)}>Recepcionar</button></td></tr>})}</tbody></table></div></div>;
}
