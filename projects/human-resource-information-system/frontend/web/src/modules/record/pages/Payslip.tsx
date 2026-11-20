import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { downloadPayslipExcel, downloadPayslipPdf, downloadPayslipWord, type PayslipExportData } from "../utils/payslipExport";
import "./RecordPages.css";

type Payslip = PayslipExportData & { id: string; status: "Available" | "Processing" };
const payslips: Payslip[] = [
  { id: "NOV-2026-B", employee: "Vin Santos", employeeId: "EMP-0248", period: "November 16–30, 2026", payDate: "November 30, 2026", status: "Available", earnings: [{ label: "Basic pay", amount: 18000 }, { label: "Allowance", amount: 2500 }, { label: "Overtime", amount: 860 }], deductions: [{ label: "SSS", amount: 900 }, { label: "PhilHealth", amount: 450 }, { label: "Pag-IBIG", amount: 200 }, { label: "Withholding tax", amount: 820 }] },
  { id: "NOV-2026-A", employee: "Vin Santos", employeeId: "EMP-0248", period: "November 1–15, 2026", payDate: "November 15, 2026", status: "Available", earnings: [{ label: "Basic pay", amount: 18000 }, { label: "Allowance", amount: 2500 }], deductions: [{ label: "SSS", amount: 900 }, { label: "PhilHealth", amount: 450 }, { label: "Pag-IBIG", amount: 200 }, { label: "Withholding tax", amount: 640 }] },
  { id: "OCT-2026-B", employee: "Vin Santos", employeeId: "EMP-0248", period: "October 16–31, 2026", payDate: "October 31, 2026", status: "Available", earnings: [{ label: "Basic pay", amount: 18000 }, { label: "Allowance", amount: 2500 }, { label: "Overtime", amount: 420 }], deductions: [{ label: "SSS", amount: 900 }, { label: "PhilHealth", amount: 450 }, { label: "Pag-IBIG", amount: 200 }, { label: "Withholding tax", amount: 770 }] },
];
const netPay = (payslip: Payslip) => payslip.earnings.reduce((sum, row) => sum + row.amount, 0) - payslip.deductions.reduce((sum, row) => sum + row.amount, 0);

export default function Payslip() {
  const [selected, setSelected] = useState(payslips[0]);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [error, setError] = useState("");
  async function download(format: "PDF" | "Excel" | "Word") {
    setDownloading(format); setError("");
    try {
      if (format === "PDF") await downloadPayslipPdf(selected);
      else if (format === "Excel") await downloadPayslipExcel(selected);
      else await downloadPayslipWord(selected);
    } catch { setError(`Could not create the ${format} file. Please try again.`); }
    finally { setDownloading(null); }
  }
  const selectedNet = netPay(selected);

  return <section className="record-page">
    <header className="record-page__header"><div><p className="record-eyebrow">RECORD / PAYSLIP</p><h1>Payslips</h1><p className="record-page__description">View pay statements and download a copy in your preferred format.</p></div><span className="record-demo-label">Sample data</span></header>
    <div className="payslip-layout">
      <div className="record-table-card payslip-list"><div className="record-table-card__toolbar"><div><h2>Pay history</h2><p>Choose a statement to view</p></div></div>{payslips.map((payslip) => <button key={payslip.id} type="button" className={`payslip-item ${selected.id === payslip.id ? "payslip-item--selected" : ""}`} onClick={() => setSelected(payslip)}><span className="payslip-item__icon">₱</span><span className="payslip-item__text"><strong>{payslip.period}</strong><small>Paid {payslip.payDate}</small></span><span className="record-status record-status--present">{payslip.status}</span></button>)}</div>
      <AnimatePresence mode="wait"><motion.article key={selected.id} className="payslip-preview" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
        <div className="payslip-preview__header"><div><p className="record-eyebrow">PAY STATEMENT</p><h2>{selected.period}</h2><p>{selected.employee} · {selected.employeeId}</p></div><span className="record-status record-status--present">{selected.status}</span></div>
        <div className="payslip-net"><span>Net pay</span><strong>₱{selectedNet.toLocaleString("en-PH", { minimumFractionDigits: 2 })}</strong><small>Pay date: {selected.payDate}</small></div>
        <div className="payslip-breakdown"><div><h3>Earnings</h3>{selected.earnings.map((line) => <p key={line.label}><span>{line.label}</span><strong>₱{line.amount.toLocaleString("en-PH", { minimumFractionDigits: 2 })}</strong></p>)}<p className="payslip-breakdown__total"><span>Total earnings</span><strong>₱{selected.earnings.reduce((sum, row) => sum + row.amount, 0).toLocaleString("en-PH", { minimumFractionDigits: 2 })}</strong></p></div><div><h3>Deductions</h3>{selected.deductions.map((line) => <p key={line.label}><span>{line.label}</span><strong>₱{line.amount.toLocaleString("en-PH", { minimumFractionDigits: 2 })}</strong></p>)}<p className="payslip-breakdown__total"><span>Total deductions</span><strong>₱{selected.deductions.reduce((sum, row) => sum + row.amount, 0).toLocaleString("en-PH", { minimumFractionDigits: 2 })}</strong></p></div></div>
        <div className="payslip-actions"><span>Download statement</span><div><button type="button" onClick={() => void download("PDF")} disabled={!!downloading}>{downloading === "PDF" ? "Preparing…" : "PDF"}</button><button type="button" onClick={() => void download("Excel")} disabled={!!downloading}>{downloading === "Excel" ? "Preparing…" : "Excel"}</button><button type="button" onClick={() => void download("Word")} disabled={!!downloading}>{downloading === "Word" ? "Preparing…" : "Word"}</button></div></div>
        {error && <p className="record-error" role="alert">{error}</p>}
      </motion.article></AnimatePresence>
    </div>
  </section>;
}
