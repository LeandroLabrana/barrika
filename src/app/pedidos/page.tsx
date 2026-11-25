import { demoWines } from "@/lib/demo-data";
import { OrdersClient } from "@/components/orders-client";
export default function OrdersPage(){return <><div className="page-header"><div><p className="eyebrow">Compras</p><h1>Pedidos</h1><p className="page-subtitle">Recibe explícitamente cada pedido para sumar stock una sola vez.</p></div></div><div className="notice">Crear un pedido no mueve stock. La recepción incrementa stock una sola vez mediante una clave idempotente.</div><div className="section"><OrdersClient wines={demoWines}/></div></>}
