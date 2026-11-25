import { demoMovements, demoOrders, demoWines } from "./demo-data";
import type { Movement, Order, Wine } from "@/domain";

const keys = { wines: "barrika:wines", orders: "barrika:orders", movements: "barrika:movements" };
function read<T>(key: string, fallback: T): T { if (typeof window === "undefined") return fallback; const value = window.localStorage.getItem(key); return value ? JSON.parse(value) as T : fallback; }
function write<T>(key: string, value: T) { window.localStorage.setItem(key, JSON.stringify(value)); window.dispatchEvent(new Event("barrika:update")); }
export const localDemo = {
  wines: () => read<Wine[]>(keys.wines, demoWines),
  orders: () => read<Order[]>(keys.orders, demoOrders),
  movements: () => read<Movement[]>(keys.movements, demoMovements),
  saveWines: (value: Wine[]) => write(keys.wines, value),
  saveOrders: (value: Order[]) => write(keys.orders, value),
  saveMovements: (value: Movement[]) => write(keys.movements, value),
};
