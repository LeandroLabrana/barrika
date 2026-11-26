"use client";
import { useState } from "react";
import type { MovementType, Wine } from "@/domain";
import { useAppStore } from "@/lib/app-store";

export function CreateOrderButton({ wine, quantity }: { wine: Wine; quantity: number }) {
  const { createOrder } = useAppStore();
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  async function create() { setBusy(true); try { await createOrder(wine.id, quantity); setMessage("Pedido creado"); } catch (error) { setMessage(error instanceof Error ? error.message : "No se pudo crear el pedido"); } finally { setBusy(false); } }
  return <button disabled={busy || quantity <= 0} onClick={create}>{busy ? "Guardando…" : message || "Crear pedido"}</button>;
}

export function MovementActions({ wine }: { wine: Wine }) {
  const { applyMovement } = useAppStore();
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  async function apply(type: MovementType, quantity = 1) { setBusy(true); try { await applyMovement(wine.id, type, quantity); setMessage("Movimiento guardado"); } catch (error) { setMessage(error instanceof Error ? error.message : "No se pudo guardar"); } finally { setBusy(false); } }
  return <div><div className="actions"><button disabled={busy} onClick={() => apply("purchase")}>+ Entrada</button><button disabled={busy} className="secondary" onClick={() => apply("sale_takeaway")}>Venta para llevar</button><button disabled={busy} className="secondary" onClick={() => apply("sale_on_premise")}>Consumo en local</button><button disabled={busy} className="secondary" onClick={() => apply("breakage")}>Rotura</button><button disabled={busy} className="secondary" onClick={() => apply("adjustment_out")}>Ajuste</button></div>{message && <p className="muted" style={{marginTop:16}}>{message}</p>}</div>;
}
