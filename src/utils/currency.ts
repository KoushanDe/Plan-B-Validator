/**
 * Translates numerical values into standard spoken Indian currency denominations
 * (e.g., 100000 -> "1 Lakh", 150000 -> "1.5 Lakh", 10000000 -> "1 Crore").
 */
export function sayMoneyInIndianWay(val: number): string {
  if (!val || isNaN(val) || val <= 0) return "";
  
  if (val >= 10000000) {
    const cr = val / 10000000;
    // Format to 2 decimal places and strip trailing .00
    const formatted = Number(cr.toFixed(2));
    return `${formatted} ${formatted === 1 ? "Crore" : "Crores"}`;
  }
  if (val >= 100000) {
    const lakh = val / 100000;
    const formatted = Number(lakh.toFixed(2));
    return `${formatted} ${formatted === 1 ? "Lakh" : "Lakhs"}`;
  }
  if (val >= 1000) {
    const thousand = val / 1000;
    const formatted = Number(thousand.toFixed(2));
    return `${formatted} ${formatted === 1 ? "Thousand" : "Thousands"}`;
  }
  return `${val}`;
}
