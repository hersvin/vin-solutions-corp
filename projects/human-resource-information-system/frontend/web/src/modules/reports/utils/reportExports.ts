import type { ReportSnapshot } from "../data";

export type ReportFormat = "PDF" | "Excel" | "Word";

function filename(value: string) {
  return value.normalize("NFKD").replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase();
}

function saveBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = name;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function createReportFile(snapshot: ReportSnapshot, format: ReportFormat): Promise<Blob> {
  if (format === "PDF") {
    const [{ jsPDF }, autoTable] = await Promise.all([import("jspdf"), import("jspdf-autotable")]);
    const pdf = new jsPDF({ orientation: snapshot.columns.length > 4 ? "landscape" : "portrait" });
    pdf.setFontSize(15);
    pdf.text(snapshot.reportName, 14, 18);
    pdf.setFontSize(9);
    pdf.text(`${snapshot.company} · ${snapshot.period}`, 14, 25);
    pdf.text(`Generated ${snapshot.generatedAt}`, 14, 31);
    autoTable.default(pdf, { startY: 38, head: [snapshot.columns], body: snapshot.rows, theme: "grid", styles: { fontSize: 8 }, headStyles: { fillColor: [49, 94, 121] } });
    return pdf.output("blob");
  }
  if (format === "Excel") {
    const ExcelJS = await import("exceljs");
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Report");
    worksheet.addRows([[snapshot.reportName], ["Company", snapshot.company], ["Period", snapshot.period], ["Generated", snapshot.generatedAt], [], snapshot.columns, ...snapshot.rows]);
    worksheet.getRow(1).font = { bold: true, size: 16, color: { argb: "FF315E79" } };
    worksheet.getRow(6).font = { bold: true, color: { argb: "FFFFFFFF" } };
    worksheet.getRow(6).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF315E79" } };
    snapshot.columns.forEach((column, index) => { worksheet.getColumn(index + 1).width = Math.max(18, Math.min(32, column.length + 6)); });
    const bytes = await workbook.xlsx.writeBuffer();
    return new Blob([bytes], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  }
  const { Document, HeadingLevel, Packer, Paragraph, Table, TableCell, TableRow, TextRun, WidthType } = await import("docx");
  const rows = [snapshot.columns, ...snapshot.rows];
  const table = new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: rows.map((row, rowIndex) => new TableRow({ children: row.map((text) => new TableCell({ children: [new Paragraph({ children: [new TextRun({ text, bold: rowIndex === 0 })] })] })) })) });
  const document = new Document({ sections: [{ children: [new Paragraph({ text: snapshot.reportName, heading: HeadingLevel.HEADING_1 }), new Paragraph(`Company: ${snapshot.company}`), new Paragraph(`Period: ${snapshot.period}`), new Paragraph(`Generated: ${snapshot.generatedAt}`), table] }] });
  return Packer.toBlob(document);
}

export async function downloadReport(snapshot: ReportSnapshot, format: ReportFormat) {
  const blob = await createReportFile(snapshot, format);
  const extension = format === "Excel" ? "xlsx" : format === "Word" ? "docx" : "pdf";
  saveBlob(blob, `${filename(snapshot.reportName)}-${filename(snapshot.period)}.${extension}`);
}

export async function downloadAllReportFormats(snapshot: ReportSnapshot) {
  const base = `${filename(snapshot.reportName)}-${filename(snapshot.period)}`;
  const [pdf, excel, word, { zipSync }] = await Promise.all([
    createReportFile(snapshot, "PDF"), createReportFile(snapshot, "Excel"), createReportFile(snapshot, "Word"), import("fflate"),
  ]);
  const entries = {
    [`${base}.pdf`]: new Uint8Array(await pdf.arrayBuffer()),
    [`${base}.xlsx`]: new Uint8Array(await excel.arrayBuffer()),
    [`${base}.docx`]: new Uint8Array(await word.arrayBuffer()),
  };
  const archive = zipSync(entries, { level: 6 });
  saveBlob(new Blob([archive], { type: "application/zip" }), `${base}-all-formats.zip`);
}
