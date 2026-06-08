export const handleExportCSV = <T extends object>(
  data: T[],
  fileName = "export.csv",
) => {
  if (!data.length) return;
  const headers = Object.keys(data[0]);
  const rows = data.map((customer) =>
    headers.map((key) => {
      const value = customer[key as keyof typeof customer];
      if (typeof value === "boolean") {
        return value ? "Yes" : "No";
      }
      return value ?? "";
    }),
  );
  const csvContent = [headers, ...rows]
    .map((row) =>
      row.map((field) => `"${String(field).replace(/"/g, '""')}"`).join(","),
    )
    .join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
