import type { Channel, Settings, Wine } from "./types";
import { assertPositiveMoney, roundHalfUp } from "./money";

export const DEFAULT_SETTINGS: Settings = {
  takeawayMultiplier: 1.5,
  onPremiseMultiplier: 2,
  takeawayVatRate: 0.21,
  onPremiseVatRate: 0.1,
  purchaseVatRate: 0.21,
};

function assertRate(rate: number) {
  if (rate < 0 || rate > 1) throw new Error("El IVA debe estar entre 0 y 1.");
}

function assertMultiplier(multiplier: number) {
  if (multiplier <= 0) throw new Error("El multiplicador debe ser mayor que cero.");
}

export function effectiveMultiplier(wine: Wine, channel: Channel, settings: Settings): number {
  const override = channel === "takeaway" ? wine.takeawayMultiplierOverride : wine.onPremiseMultiplierOverride;
  const global = channel === "takeaway" ? settings.takeawayMultiplier : settings.onPremiseMultiplier;
  const multiplier = override ?? global;
  assertMultiplier(multiplier);
  return multiplier;
}

export function calculatePrices(wine: Wine, channel: Channel, settings: Settings) {
  assertPositiveMoney(wine.purchasePriceExVatCents);
  assertRate(wine.purchaseVatRate);
  const vatRate = channel === "takeaway" ? settings.takeawayVatRate : settings.onPremiseVatRate;
  assertRate(vatRate);
  const purchaseWithVatCents = roundHalfUp(wine.purchasePriceExVatCents * (1 + wine.purchaseVatRate));
  const netCostCents = wine.vatDeductible ? wine.purchasePriceExVatCents : purchaseWithVatCents;
  const saleExVatCents = roundHalfUp(netCostCents * effectiveMultiplier(wine, channel, settings));
  const outputVatCents = roundHalfUp(saleExVatCents * vatRate);
  const finalPriceCents = saleExVatCents + outputVatCents;
  const grossProfitCents = saleExVatCents - netCostCents;
  return {
    purchaseWithVatCents,
    netCostCents,
    saleExVatCents,
    outputVatCents,
    finalPriceCents,
    grossProfitCents,
    markupPercent: (grossProfitCents / netCostCents) * 100,
    marginPercent: (grossProfitCents / saleExVatCents) * 100,
  };
}
