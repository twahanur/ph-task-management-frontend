/* eslint-disable @typescript-eslint/no-explicit-any */
export const exportToCSV = <T extends Record<string, any>>(
  data: T[],
  fileName: string,
) => {
  if (!data || data.length === 0) return;

  const headers = Object.keys(data[0]) as (keyof T)[];

  const csvRows = [
    headers.join(","), // header row
    ...data.map((row) =>
      headers
        .map((field) => {
          const value = row[field];

          // handle objects & arrays safely
          if (typeof value === "object" && value !== null) {
            return `"${JSON.stringify(value)}"`;
          }

          return `"${value ?? ""}"`;
        })
        .join(","),
    ),
  ];

  const csvString = csvRows.join("\n");

  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `${fileName}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
