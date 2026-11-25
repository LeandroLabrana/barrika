import type { MovementType, Wine } from "./types";

export function validateQuantity(quantity: number) {
  if (!Number.isInteger(quantity) || quantity <= 0) throw new Error("La cantidad debe ser un entero positivo.");
}

export function stockStatus(wine: Pick<Wine, "stock" | "minStock">): "ok" | "low" | "out" {
  if (wine.stock === 0) return "out";
  if (wine.stock <= wine.minStock) return "low";
  return "ok";
}

export function replenishment(wine: Pick<Wine, "stock" | "minStock" | "targetStock" | "purchasePriceExVatCents">) {
  const quantity = stockStatus(wine) === "ok" ? 0 : Math.max(0, wine.targetStock - wine.stock);
  return { quantity, estimatedCostCents: quantity * wine.purchasePriceExVatCents };
}

export function nextStock(currentStock: number, quantity: number, type: MovementType): number {
  validateQuantity(quantity);
  const isOutput = ["sale_takeaway", "sale_on_premise", "breakage", "adjustment_out"].includes(type);
  const next = isOutput ? currentStock - quantity : currentStock + quantity;
  if (next < 0) throw new Error("La operación no puede dejar el stock por debajo de cero.");
  return next;
}
