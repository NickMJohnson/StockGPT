// Financial number formatting utilities

export function formatNumber(
  value: number | null,
  unit?: "USD" | "USDm" | "USDb"
): string {
  if (value === null || value === undefined) {
    return "—";
  }

  const isNegative = value < 0;
  const absValue = Math.abs(value);
  
  // Format with commas
  const formatted = absValue.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  // Wrap negatives in parentheses
  return isNegative ? `(${formatted})` : formatted;
}

export function formatPercent(value: number | null): string {
  if (value === null || value === undefined) {
    return "—";
  }
  
  const isNegative = value < 0;
  const formatted = Math.abs(value).toFixed(2) + "%";
  
  return isNegative ? `(${formatted})` : formatted;
}

export function formatCurrency(
  value: number | null,
  unit?: "USD" | "USDm" | "USDb"
): string {
  if (value === null || value === undefined) {
    return "—";
  }

  const prefix = "$";
  const suffix = unit === "USDm" ? "M" : unit === "USDb" ? "B" : "";
  
  return `${prefix}${formatNumber(value)}${suffix}`;
}

export function getUnitLabel(unit?: "USD" | "USDm" | "USDb"): string {
  switch (unit) {
    case "USDm":
      return "in millions USD";
    case "USDb":
      return "in billions USD";
    case "USD":
    default:
      return "in USD";
  }
}

export function formatDate(isoDate?: string): string {
  if (!isoDate) return "—";
  
  try {
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return isoDate;
  }
}
