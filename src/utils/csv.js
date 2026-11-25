export function toCsv(rows) {
  const csvRows = rows.map((row) =>
    row.map((cell) => {
      const value = cell === null || cell === undefined ? "" : cell;
      const safeValue = typeof value === "string" && /^[=+\-@]/.test(value)
        ? `'${value}`
        : value;
      return `"${String(safeValue).replace(/"/g, '""')}"`;
    }).join(",")
  );

  return `\uFEFF${csvRows.join("\r\n")}`;
}

export function downloadCsv(filename, text) {
  const blob = new Blob([text], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
