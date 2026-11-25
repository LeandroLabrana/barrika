import { collection, doc, runTransaction, serverTimestamp, setDoc } from "firebase/firestore";
import { getDatabase } from "./firebase";
import { nextStock } from "@/domain";
import type { Movement, MovementType } from "@/domain";

export async function applyMovementTransaction(movement: Omit<Movement, "resultingStock" | "date"> & { type: MovementType }) {
  const db = getDatabase();
  if (!db) throw new Error("Firebase no está configurado.");
  const wineRef = doc(db, "wines", movement.wineId);
  const movementRef = doc(db, "movements", movement.id);
  await runTransaction(db, async (transaction) => {
    const [wineSnapshot, movementSnapshot] = await Promise.all([transaction.get(wineRef), transaction.get(movementRef)]);
    if (movementSnapshot.exists()) return;
    if (!wineSnapshot.exists()) throw new Error("Vino no encontrado.");
    const wine = wineSnapshot.data();
    const stock = nextStock(wine.stock, movement.quantity, movement.type);
    transaction.update(wineRef, { stock, ...(movement.type.includes("in") || movement.type === "reception" || movement.type === "purchase" ? { lastStockInAt: serverTimestamp() } : { lastStockOutAt: serverTimestamp() }) });
    transaction.set(movementRef, { ...movement, resultingStock: stock, date: serverTimestamp() });
  });
}

export async function saveSettings(settings: object) {
  const db = getDatabase();
  if (!db) throw new Error("Firebase no está configurado.");
  await setDoc(doc(collection(db, "settings"), "general"), settings, { merge: true });
}

export async function createOrderTransaction(order: { id: string; wineId: string; quantity: number; unitPriceExVatCents: number; estimatedCostCents: number; supplier: string }) {
  const db = getDatabase();
  if (!db) throw new Error("Firebase no está configurado.");
  await runTransaction(db, async (transaction) => {
    const orderRef = doc(db, "orders", order.id);
    const existing = await transaction.get(orderRef);
    if (existing.exists()) return;
    transaction.set(orderRef, { ...order, status: "pending_reception", createdAt: serverTimestamp() });
  });
}

export async function receiveOrderTransaction(order: { id: string; wineId: string; quantity: number }, movementId: string) {
  const db = getDatabase();
  if (!db) throw new Error("Firebase no está configurado.");
  await runTransaction(db, async (transaction) => {
    const orderRef = doc(db, "orders", order.id);
    const wineRef = doc(db, "wines", order.wineId);
    const movementRef = doc(db, "movements", movementId);
    const [orderSnapshot, wineSnapshot, movementSnapshot] = await Promise.all([transaction.get(orderRef), transaction.get(wineRef), transaction.get(movementRef)]);
    if (movementSnapshot.exists() || (orderSnapshot.exists() && orderSnapshot.data().status === "received")) return;
    if (!orderSnapshot.exists() || !wineSnapshot.exists()) throw new Error("Pedido o vino no encontrado.");
    const stock = nextStock(wineSnapshot.data().stock, order.quantity, "reception");
    transaction.update(wineRef, { stock, lastStockInAt: serverTimestamp() });
    transaction.update(orderRef, { status: "received", receivedAt: serverTimestamp() });
    transaction.set(movementRef, { id: movementId, wineId: order.wineId, quantity: order.quantity, type: "reception", reason: `Recepción ${order.id}`, date: serverTimestamp(), resultingStock: stock, orderId: order.id });
  });
}
