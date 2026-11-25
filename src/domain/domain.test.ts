import { describe, expect, it } from "vitest";
import { DEFAULT_SETTINGS, calculatePrices, formatCents, replenishment, nextStock, stockStatus } from "./index";
import type { Wine } from "./types";

const wine: Wine = {
  id: "rioja-1", name: "Barrika Crianza", winery: "Bodega Barrika", appellation: "Rioja", vintage: 2021, supplier: "Bodega Barrika",
  purchasePriceExVatCents: 1000, purchaseVatRate: 0.21, vatDeductible: true, takeawayMultiplierOverride: null, onPremiseMultiplierOverride: null,
  stock: 8, minStock: 10, targetStock: 24, unitsPerOrder: 6, location: "Sala principal",
};

describe("pricing domain", () => {
  it("fixes the 10/1.5 takeaway case", () => {
    const result = calculatePrices(wine, "takeaway", DEFAULT_SETTINGS);
    expect(result.purchaseWithVatCents).toBe(1210);
    expect(result.netCostCents).toBe(1000);
    expect(result.saleExVatCents).toBe(1500);
    expect(result.outputVatCents).toBe(315);
    expect(result.finalPriceCents).toBe(1815);
    expect(result.grossProfitCents).toBe(500);
    expect(result.markupPercent).toBe(50);
    expect(result.marginPercent).toBeCloseTo(33.33, 2);
  });

  it("fixes the 10/2 on-premise case", () => {
    const result = calculatePrices(wine, "onPremise", DEFAULT_SETTINGS);
    expect(result.saleExVatCents).toBe(2000);
    expect(result.outputVatCents).toBe(200);
    expect(result.finalPriceCents).toBe(2200);
    expect(result.grossProfitCents).toBe(1000);
    expect(result.markupPercent).toBe(100);
    expect(result.marginPercent).toBe(50);
  });

  it("calculates the replenishment case", () => {
    expect(stockStatus(wine)).toBe("low");
    expect(replenishment(wine)).toEqual({ quantity: 16, estimatedCostCents: 16000 });
    expect(formatCents(16000)).toBe("160,00 €");
    expect(nextStock(8, 16, "reception")).toBe(24);
    expect(nextStock(24, 16, "reception")).toBe(40);
  });

  it("rejects negative outputs", () => {
    expect(() => nextStock(2, 3, "breakage")).toThrow();
  });
});
