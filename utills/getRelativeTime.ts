export const getRelativeTime = (past: Date) => {
  const now = new Date();
  const diff = (now.getTime() - past.getTime()) / 1000; // difference in seconds

  if (diff < 60) return `${Math.floor(diff)} seconds `;
  const minutes = diff / 60;
  if (minutes < 60)
    return `${Math.floor(minutes)} minute${
      Math.floor(minutes) > 1 ? "s" : ""
    } `;
  const hours = minutes / 60;
  if (hours < 24)
    return `${Math.floor(hours)} hour${Math.floor(hours) > 1 ? "s" : ""} `;
  const days = hours / 24;
  if (days < 30)
    return `${Math.floor(days)} day${Math.floor(days) > 1 ? "s" : ""} `;
  const months = days / 30;
  if (months < 12)
    return `${Math.floor(months)} month${
      Math.floor(months) > 1 ? "s" : ""
    } `;
  const years = days / 365;
  return `${Math.floor(years)} year${Math.floor(years) > 1 ? "s" : ""}`;
}
