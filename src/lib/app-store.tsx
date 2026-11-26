"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { collection, doc, onSnapshot, setDoc } from "firebase/firestore";
import type { Movement, MovementType, Order, Settings, Wine } from "@/domain";
import { DEFAULT_SETTINGS, nextStock, validateQuantity } from "@/domain";
import { demoMovements, demoOrders, demoSettings, demoWines } from "./demo-data";
import { firebaseConfigured, getDatabase } from "./firebase";
import { applyMovementTransaction, createOrderTransaction, receiveOrderTransaction, saveSettings } from "./firestore-repository";

type AppStore = {
  wines: Wine[];
  orders: Order[];
  movements: Movement[];
  settings: Settings;
  ready: boolean;
  createWine: (wine: Wine) => Promise<void>;
  createOrder: (wineId: string, quantity: number) => Promise<void>;
  receiveOrder: (orderId: string) => Promise<void>;
  applyMovement: (wineId: string, type: MovementType, quantity: number) => Promise<void>;
  updateSettings: (settings: Settings) => Promise<void>;
};

const StoreContext = createContext<AppStore | null>(null);

function dateValue(value: unknown): string {
  if (value && typeof value === "object" && "toDate" in value && typeof (value as { toDate?: () => Date }).toDate === "function") return (value as { toDate: () => Date }).toDate().toISOString();
  return typeof value === "string" ? value : new Date().toISOString();
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [wines, setWines] = useState<Wine[]>(demoWines);
  const [orders, setOrders] = useState<Order[]>(demoOrders);
  const [movements, setMovements] = useState<Movement[]>(demoMovements);
  const [settings, setSettings] = useState<Settings>(demoSettings);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const db = getDatabase();
    if (!firebaseConfigured() || !db) {
      setReady(true);
      return;
    }
    const unsubWines = onSnapshot(collection(db, "wines"), (snapshot) => setWines(snapshot.docs.map((item) => ({ id: item.id, ...item.data() } as Wine))));
    const unsubOrders = onSnapshot(collection(db, "orders"), (snapshot) => setOrders(snapshot.docs.map((item) => ({ id: item.id, ...item.data(), createdAt: dateValue(item.data().createdAt) } as Order))));
    const unsubMovements = onSnapshot(collection(db, "movements"), (snapshot) => setMovements(snapshot.docs.map((item) => ({ id: item.id, ...item.data(), date: dateValue(item.data().date) } as Movement))));
    const unsubSettings = onSnapshot(doc(db, "settings", "general"), (snapshot) => setSettings(snapshot.exists() ? { ...DEFAULT_SETTINGS, ...snapshot.data() } as Settings : DEFAULT_SETTINGS));
    setReady(true);
    return () => { unsubWines(); unsubOrders(); unsubMovements(); unsubSettings(); };
  }, []);

  const createWine = useCallback(async (wine: Wine) => {
    const db = getDatabase();
    if (firebaseConfigured() && db) await setDoc(doc(db, "wines", wine.id), wine);
    setWines((current) => [...current.filter((item) => item.id !== wine.id), wine]);
  }, []);

  const createOrder = useCallback(async (wineId: string, quantity: number) => {
    validateQuantity(quantity);
    const wine = wines.find((item) => item.id === wineId);
    if (!wine) throw new Error("Vino no encontrado.");
    const order: Order = { id: `order-${Date.now()}`, wineId, quantity, unitPriceExVatCents: wine.purchasePriceExVatCents, estimatedCostCents: quantity * wine.purchasePriceExVatCents, supplier: wine.supplier || wine.winery, status: "pending_reception", createdAt: new Date().toISOString() };
    const db = getDatabase();
    if (firebaseConfigured() && db) await createOrderTransaction(order);
    setOrders((current) => current.some((item) => item.id === order.id) ? current : [...current, order]);
  }, [wines]);

  const receiveOrder = useCallback(async (orderId: string) => {
    const order = orders.find((item) => item.id === orderId);
    if (!order || order.status !== "pending_reception") return;
    const wine = wines.find((item) => item.id === order.wineId);
    if (!wine) throw new Error("Vino no encontrado.");
    const movementId = `reception-${order.id}`;
    const db = getDatabase();
    if (firebaseConfigured() && db) await receiveOrderTransaction(order, movementId);
    const stock = nextStock(wine.stock, order.quantity, "reception");
    setWines((current) => current.map((item) => item.id === wine.id ? { ...item, stock, lastStockInAt: new Date().toISOString() } : item));
    setOrders((current) => current.map((item) => item.id === order.id ? { ...item, status: "received" } : item));
    setMovements((current) => current.some((item) => item.id === movementId) ? current : [...current, { id: movementId, wineId: order.wineId, quantity: order.quantity, type: "reception", reason: `Recepción ${order.id}`, date: new Date().toISOString(), resultingStock: stock, orderId: order.id }]);
  }, [orders, wines]);

  const applyMovement = useCallback(async (wineId: string, type: MovementType, quantity: number) => {
    validateQuantity(quantity);
    const wine = wines.find((item) => item.id === wineId);
    if (!wine) throw new Error("Vino no encontrado.");
    const stock = nextStock(wine.stock, quantity, type);
    const movement = { id: `movement-${Date.now()}`, wineId, quantity, type, reason: type === "breakage" ? "Rotura" : "Movimiento manual" };
    const db = getDatabase();
    if (firebaseConfigured() && db) await applyMovementTransaction(movement);
    setWines((current) => current.map((item) => item.id === wineId ? { ...item, stock, ...(type === "purchase" || type === "reception" || type === "adjustment_in" ? { lastStockInAt: new Date().toISOString() } : { lastStockOutAt: new Date().toISOString() }) } : item));
    setMovements((current) => current.some((item) => item.id === movement.id) ? current : [...current, { ...movement, date: new Date().toISOString(), resultingStock: stock }]);
  }, [wines]);

  const updateSettings = useCallback(async (next: Settings) => {
    const db = getDatabase();
    if (firebaseConfigured() && db) await saveSettings(next);
    setSettings(next);
  }, []);

  return <StoreContext.Provider value={{ wines, orders, movements, settings, ready, createWine, createOrder, receiveOrder, applyMovement, updateSettings }}>{children}</StoreContext.Provider>;
}

export function useAppStore() {
  const value = useContext(StoreContext);
  if (!value) throw new Error("useAppStore debe utilizarse dentro de StoreProvider");
  return value;
}
