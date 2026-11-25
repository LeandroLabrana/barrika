export type Channel = "takeaway" | "onPremise";
export type MovementType = "purchase" | "reception" | "adjustment_in" | "sale_takeaway" | "sale_on_premise" | "breakage" | "adjustment_out";
export type OrderStatus = "pending_reception" | "received" | "cancelled";

export type Settings = {
  takeawayMultiplier: number;
  onPremiseMultiplier: number;
  takeawayVatRate: number;
  onPremiseVatRate: number;
  purchaseVatRate: number;
};

export type Wine = {
  id: string;
  name: string;
  winery: string;
  appellation: string;
  vintage: number;
  supplier: string;
  purchasePriceExVatCents: number;
  purchaseVatRate: number;
  vatDeductible: boolean;
  takeawayMultiplierOverride: number | null;
  onPremiseMultiplierOverride: number | null;
  stock: number;
  minStock: number;
  targetStock: number;
  unitsPerOrder: number;
  location: string;
  lastStockInAt?: string;
  lastStockOutAt?: string;
};

export type Movement = {
  id: string;
  wineId: string;
  quantity: number;
  type: MovementType;
  reason: string;
  date: string;
  resultingStock: number;
  orderId?: string;
};

export type Order = {
  id: string;
  wineId: string;
  quantity: number;
  unitPriceExVatCents: number;
  estimatedCostCents: number;
  supplier: string;
  status: OrderStatus;
  createdAt: string;
};
