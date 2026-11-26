"use client";
import { useAppStore } from "@/lib/app-store";
import { OrdersClient } from "@/components/orders-client";

export default function OrdersPage(){const { orders }=useAppStore();return <><div className="page-header"><div><p className="eyebrow">Compras</p><h1>Pedidos</h1><p className="page-subtitle">Recibe cada pedido para actualizar las existencias de forma segura.</p></div></div><div className="notice">Los pedidos pendientes aparecen aquí hasta que confirmes su recepción.</div><div className="section"><OrdersClient/></div><p className="muted" style={{marginTop:16}}>{orders.filter(order=>order.status==="received").length} pedidos recibidos en total.</p></>}
