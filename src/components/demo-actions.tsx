"use client";
import { useState } from "react";
import type { MovementType, Wine } from "@/domain";
import { useAppStore } from "@/lib/app-store";

type ModalAction = { type: MovementType; title: string; description: string; adjustment?: boolean };

export function CreateOrderButton({ wine, quantity }: { wine: Wine; quantity: number }) {
  const { createOrder } = useAppStore();
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  async function create() { setBusy(true); try { await createOrder(wine.id, quantity); setMessage("Pedido creado"); } catch (error) { setMessage(error instanceof Error ? error.message : "No se pudo crear el pedido"); } finally { setBusy(false); } }
  return <button disabled={busy || quantity <= 0} onClick={create}>{busy ? "Guardando…" : message || "Crear pedido"}</button>;
}

export function MovementActions({ wine }: { wine: Wine }) {
  const { applyMovement } = useAppStore();
  const [modal, setModal] = useState<ModalAction | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [adjustmentDirection, setAdjustmentDirection] = useState<"in" | "out">("in");
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<{ kind: "success" | "error"; text: string } | null>(null);

  function open(action: ModalAction) {
    setFeedback(null);
    setQuantity(1);
    setAdjustmentDirection("in");
    setModal(action);
  }

  async function confirm() {
    if (!modal || quantity <= 0) return;
    const type = modal.adjustment ? (adjustmentDirection === "in" ? "adjustment_in" : "adjustment_out") : modal.type;
    setBusy(true);
    try {
      await applyMovement(wine.id, type, quantity);
      setFeedback({ kind: "success", text: `${modal.title}: ${quantity} ${quantity === 1 ? "unidad registrada" : "unidades registradas"}.` });
      setModal(null);
    } catch (error) {
      setFeedback({ kind: "error", text: error instanceof Error ? error.message : "No se pudo registrar la operación." });
    } finally { setBusy(false); }
  }

  return <div>
    <div className="actions">
      <button disabled={busy} onClick={() => open({ type: "purchase", title: "Registrar entrada", description: "Indica cuántas botellas entran al inventario." })}>+ Entrada</button>
      <button disabled={busy} className="secondary" onClick={() => open({ type: "sale_takeaway", title: "Venta para llevar", description: "Indica cuántas botellas se venden para llevar." })}>Venta para llevar</button>
      <button disabled={busy} className="secondary" onClick={() => open({ type: "sale_on_premise", title: "Consumo en local", description: "Indica cuántas botellas se consumen en el local." })}>Consumo en local</button>
      <button disabled={busy} className="secondary" onClick={() => open({ type: "breakage", title: "Registrar rotura", description: "Indica cuántas botellas se han roto." })}>Rotura</button>
      <button disabled={busy} className="secondary" onClick={() => open({ type: "adjustment_out", title: "Ajustar stock", description: "Corrige manualmente las existencias indicando si hay que sumar o restar botellas.", adjustment: true })}>Ajustar stock</button>
    </div>
    {feedback && <p className={`action-feedback ${feedback.kind}`} role="status">{feedback.text}</p>}
    {modal && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && !busy) setModal(null); }}><div className="modal" role="dialog" aria-modal="true" aria-labelledby="movement-title"><p className="eyebrow">Inventario</p><h2 id="movement-title">{modal.title}</h2><p className="muted">{modal.description}</p>{modal.adjustment && <label style={{marginTop:18}}>Tipo de ajuste<select value={adjustmentDirection} onChange={(event) => setAdjustmentDirection(event.target.value as "in" | "out")}><option value="in">Añadir unidades</option><option value="out">Quitar unidades</option></select></label>}<label style={{marginTop:18}}>Cantidad<input autoFocus type="number" min="1" step="1" value={quantity} onChange={(event) => setQuantity(Number(event.target.value))}/></label><div className="form-actions"><button className="secondary" disabled={busy} onClick={() => setModal(null)}>Cancelar</button><button disabled={busy || quantity <= 0} onClick={confirm}>{busy ? "Guardando…" : "Confirmar"}</button></div></div></div>}
  </div>;
}
