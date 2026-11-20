export type PayslipExportData = {
  employee: string;
  employeeId: string;
  period: string;
  payDate: string;
  earnings: { label: string; amount: number }[];
  deductions: { label: string; amount: number }[];
};

const money = (amount: number) => `PHP ${amount.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`;
const total = (rows: PayslipExportData["earnings"]) => rows.reduce((sum, row) => sum + row.amount, 0);

function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export async function downloadPayslipPdf(data: PayslipExportData) {
  const [{ jsPDF }, autoTableModule] = await Promise.all([import("jspdf"), import("jspdf-autotable")]);
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text("Hersvin · Payslip", 14, 20);
  doc.setFontSize(10);
  doc.text(`Employee: ${data.employee} (${data.employeeId})`, 14, 30);
  doc.text(`Pay period: ${data.period}    Pay date: ${data.payDate}`, 14, 37);
  autoTableModule.default(doc, { startY: 45, head: [["Earnings", "Amount"]], body: [...data.earnings.map((row) => [row.label, money(row.amount)]), ["Total earnings", money(total(data.earnings))], ...data.deductions.map((row) => [row.label, `(${money(row.amount)})`]), ["Total deductions", `(${money(total(data.deductions))})`], ["Net pay", money(total(data.earnings) - total(data.deductions))]], theme: "grid", headStyles: { fillColor: [49, 94, 121] } });
  doc.save(`payslip-${data.period.replaceAll(" ", "-")}.pdf`);
}

export async function downloadPayslipExcel(data: PayslipExportData) {
  const ExcelJS = await import("exceljs");
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Payslip");
  sheet.addRows([["Hersvin · Payslip"], ["Employee", data.employee], ["Employee ID", data.employeeId], ["Pay period", data.period], ["Pay date", data.payDate], [], ["Description", "Amount (PHP)"]]);
  data.earnings.forEach((row) => sheet.addRow([row.label, row.amount]));
  sheet.addRow(["Total earnings", total(data.earnings)]);
  data.deductions.forEach((row) => sheet.addRow([row.label, -row.amount]));
  sheet.addRow(["Total deductions", -total(data.deductions)]);
  sheet.addRow(["Net pay", total(data.earnings) - total(data.deductions)]);
  sheet.getColumn(1).width = 28;
  sheet.getColumn(2).width = 20;
  sheet.getColumn(2).numFmt = '"₱"#,##0.00;[Red]("₱"#,##0.00)';
  const bytes = await workbook.xlsx.writeBuffer();
  saveBlob(new Blob([bytes], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }), `payslip-${data.period.replaceAll(" ", "-")}.xlsx`);
}

export async function downloadPayslipWord(data: PayslipExportData) {
  const { Document, HeadingLevel, Packer, Paragraph, Table, TableCell, TableRow, WidthType } = await import("docx");
  const rows = [["Description", "Amount (PHP)"], ...data.earnings.map((row) => [row.label, money(row.amount)]), ["Total earnings", money(total(data.earnings))], ...data.deductions.map((row) => [row.label, `(${money(row.amount)})`]), ["Total deductions", `(${money(total(data.deductions))})`], ["Net pay", money(total(data.earnings) - total(data.deductions))]];
  const table = new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: rows.map((row) => new TableRow({ children: row.map((text) => new TableCell({ children: [new Paragraph(text)] })) })) });
  const document = new Document({ sections: [{ children: [new Paragraph({ text: "Hersvin · Payslip", heading: HeadingLevel.HEADING_1 }), new Paragraph(`Employee: ${data.employee} (${data.employeeId})`), new Paragraph(`Pay period: ${data.period} · Pay date: ${data.payDate}`), table] }] });
  saveBlob(await Packer.toBlob(document), `payslip-${data.period.replaceAll(" ", "-")}.docx`);
}
