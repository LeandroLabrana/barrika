import type { Movement, Order, Settings, Wine } from "@/domain";
import { DEFAULT_SETTINGS } from "@/domain";

export const demoSettings: Settings = DEFAULT_SETTINGS;
export const demoWines: Wine[] = [
  { id: "barrika-crianza", name: "Barrika Crianza", winery: "Bodega Barrika", appellation: "Rioja Alavesa", vintage: 2021, supplier: "Bodega Barrika", purchasePriceExVatCents: 1000, purchaseVatRate: .21, vatDeductible: true, takeawayMultiplierOverride: null, onPremiseMultiplierOverride: null, stock: 8, minStock: 10, targetStock: 24, unitsPerOrder: 6, location: "Sala principal" },
  { id: "txakoli-itsas", name: "Itsas Txakoli", winery: "Etxeondo", appellation: "Getariako Txakolina", vintage: 2023, supplier: "Distribuciones Norte", purchasePriceExVatCents: 780, purchaseVatRate: .21, vatDeductible: true, takeawayMultiplierOverride: null, onPremiseMultiplierOverride: 2.1, stock: 18, minStock: 8, targetStock: 18, unitsPerOrder: 6, location: "Nevera 1" },
  { id: "garnacha-larga", name: "Garnacha Larga", winery: "Viñas del Sur", appellation: "Calatayud", vintage: 2022, supplier: "", purchasePriceExVatCents: 650, purchaseVatRate: .21, vatDeductible: true, takeawayMultiplierOverride: 1.6, onPremiseMultiplierOverride: null, stock: 0, minStock: 5, targetStock: 12, unitsPerOrder: 6, location: "Almacén" },
];
export const demoOrders: Order[] = [];
export const demoMovements: Movement[] = [];
