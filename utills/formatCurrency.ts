export const formatamount = (
  n: number | string | undefined | null
) => {
  const num = typeof n === "string" ? parseFloat(n) : n;

  if (num === null || num === undefined || isNaN(num)) {
    return "৳0.00";
  }

  return `৳${num.toLocaleString("en-BD", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};


export const formatCurrency = (
  n: number | string | undefined | null
) => {
  const num = typeof n === "string" ? parseFloat(n) : n;

  if (num === null || num === undefined || isNaN(num)) {
    return "৳0.00";
  }

  const absNum = Math.abs(num);

  let formatted = "";

  if (absNum >= 1_000_000_000) {
    formatted = `${(num / 1_000_000_000).toFixed(2)}B`;
  } else if (absNum >= 1_000_000) {
    formatted = `${(num / 1_000_000).toFixed(2)}M`;
  } else if (absNum >= 1_000) {
    formatted = `${(num / 1_000).toFixed(2)}K`;
  } else {
    formatted = num.toFixed(2);
  }

  // remove unnecessary trailing zeros
  formatted = formatted.replace(/\.00$/, "").replace(/(\.\d)0$/, "$1");

  return `৳${formatted}`;
};

export const formatNumber = (value: number | string | undefined | null) => {
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (num === null || num === undefined || isNaN(num)) return "0";
  return num.toLocaleString();
};

export const formatRate = (rate: string | number | undefined | null) => {
  if (rate === null || rate === undefined) return "0%";
  const rateStr = typeof rate === "number" ? `${rate.toFixed(1)}%` : rate;
  if (rateStr.toLowerCase().includes("nan")) return "0%";
  return rateStr;
};