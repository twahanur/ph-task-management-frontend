export const calculatePercentage = (part: number, total: number) => {
  return total > 0 ? ((part / total) * 100).toFixed(2) : "0.0";
};
