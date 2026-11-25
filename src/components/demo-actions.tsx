"use client";
import { useState } from "react";
import { localDemo } from "@/lib/local-demo";
import { nextStock } from "@/domain";
import type { MovementType, Wine } from "@/domain";
import { firebaseConfigured } from "@/lib/firebase";
import { applyMovementTransaction, createOrderTransaction } from "@/lib/firestore-repository";

export function CreateOrderButton({ wine, quantity }: { wine: Wine; quantity: number }) {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  async function create() { const order = { id: `order-${Date.now()}`, wineId: wine.id, quantity, unitPriceExVatCents: wine.purchasePriceExVatCents, estimatedCostCents: quantity * wine.purchasePriceExVatCents, supplier: wine.supplier || wine.winery, status: "pending_reception" as const, createdAt: new Date().toISOString() }; setBusy(true); try { if (firebaseConfigured()) await createOrderTransaction(order); localDemo.saveOrders([...localDemo.orders(), order]); setMessage("Pedido creado"); } catch (error) { setMessage(error instanceof Error ? error.message : "No se pudo crear"); } finally { setBusy(false); } }
  return <span><button disabled={busy} onClick={create}>{busy ? "Guardando…" : message || "Crear pedido"}</button></span>;
}

export function MovementActions({ wine }: { wine: Wine }) {
  const [message, setMessage] = useState("");
  async function apply(type: MovementType, quantity = 1) { try { const current = localDemo.wines().find(item => item.id === wine.id) || wine; const stock = nextStock(current.stock, quantity, type); const movement = { id: `movement-${Date.now()}`, wineId: wine.id, quantity, type, reason: type === "breakage" ? "Rotura" : "Movimiento manual" }; if (firebaseConfigured()) await applyMovementTransaction(movement); const updated = localDemo.wines().map(item => item.id === wine.id ? { ...item, stock } : item); localDemo.saveWines(updated); localDemo.saveMovements([...localDemo.movements(), { ...movement, date: new Date().toISOString(), resultingStock: stock }]); setMessage("Movimiento guardado"); } catch (error) { setMessage(error instanceof Error ? error.message : "No se pudo guardar"); } }
  return <div><div className="actions"><button onClick={() => apply("purchase")}>+ Entrada</button><button className="secondary" onClick={() => apply("sale_takeaway")}>Venta para llevar</button><button className="secondary" onClick={() => apply("sale_on_premise")}>Consumo en local</button><button className="secondary" onClick={() => apply("breakage")}>Rotura</button><button className="secondary" onClick={() => apply("adjustment_out")}>Ajuste</button></div>{message && <p className="muted" style={{marginTop:16}}>{message}</p>}</div>;
}
