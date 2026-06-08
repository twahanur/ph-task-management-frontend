export const formatDate = (date: string) => {
  if (!date) return "";
  const [day, month, year] = date.split("-");
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const monthIndex = parseInt(month, 10) - 1;
  return `${day} ${monthNames[monthIndex]} ${year}`;
};

export function formatDateTime(local: string) {
  if (!local) return { date: "", time: "" };
  const sep = local.includes("T") ? "T" : " ";
  const [datePart, timePart = ""] = local.split(sep);
  if (!timePart) return { date: datePart, time: "" };
  const [h, m] = timePart.split(":");
  const hour = parseInt(h);
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return { date: datePart, time: `${hour12}:${m} ${ampm}` };
}