export function assertPositiveMoney(cents: number): void {
  if (!Number.isInteger(cents) || cents <= 0) throw new Error("El coste debe ser mayor que cero.");
}

export function roundHalfUp(value: number): number {
  return Math.round(value);
}

export function formatCents(cents: number): string {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(cents / 100);
}

export function formatPercent(value: number): string {
  return `${value.toFixed(2).replace(".", ",")} %`;
}
