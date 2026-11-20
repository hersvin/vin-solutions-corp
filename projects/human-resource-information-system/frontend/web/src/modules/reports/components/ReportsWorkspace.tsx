import { useMemo, useState } from "react";
import { useCompanyManagementStore } from "@/modules/cms/store";
import { createReportSnapshot, REPORT_CATALOG, type ReportCategory, type ReportSnapshot } from "../data";
import { downloadAllReportFormats, downloadReport, type ReportFormat } from "../utils/reportExports";
import "./ReportsWorkspace.css";

type ReportsPageId = "HumanResources" | "Timekeeping" | "Payroll" | "Government" | "BankExport";
const categoryByPage: Record<ReportsPageId, ReportCategory> = { HumanResources: "Human Resources", Timekeeping: "Timekeeping", Payroll: "Payroll", Government: "Government", BankExport: "Bank Export" };
const initialFrom = "2026-11-01";
const initialTo = "2026-11-30";

export function ReportsWorkspace({ pageId }: { pageId: ReportsPageId }) {
  const category = categoryByPage[pageId];
  const reports = REPORT_CATALOG[category];
  const companies = useCompanyManagementStore((state) => state.companies);
  const activeCompanyId = useCompanyManagementStore((state) => state.activeCompanyId);
  const setActiveCompany = useCompanyManagementStore((state) => state.setActiveCompany);
  const activeCompany = companies.find((company) => company.id === activeCompanyId);
  const [query, setQuery] = useState("");
  const [from, setFrom] = useState(initialFrom);
  const [to, setTo] = useState(initialTo);
  const [selected, setSelected] = useState<ReportSnapshot | null>(null);
  const [generated, setGenerated] = useState<ReportSnapshot[]>([]);
  const [busy, setBusy] = useState<ReportFormat | "all" | null>(null);
  const [error, setError] = useState("");
  const filteredReports = useMemo(() => reports.filter((report) => `${report.name} ${report.description}`.toLowerCase().includes(query.trim().toLowerCase())), [reports, query]);

  function generate(reportName: string) {
    const snapshot = createReportSnapshot(category, reportName, activeCompany?.company.displayName ?? "Selected company", `${from} to ${to}`);
    setSelected(snapshot);
    setGenerated((current) => [snapshot, ...current.filter((item) => item.reportName !== reportName || item.period !== snapshot.period)]);
    setError("");
  }

  async function exportFormat(format: ReportFormat | "all") {
    if (!selected) return;
    setBusy(format);
    setError("");
    try {
      if (format === "all") await downloadAllReportFormats(selected);
      else await downloadReport(selected, format);
    } catch {
      setError("Export failed. Try again, or download one format at a time.");
    } finally {
      setBusy(null);
    }
  }

  return <section className="reports-workspace">
    <header className="reports-heading"><div><p className="reports-eyebrow">REPORTS / {category.toUpperCase()}</p><h2>{category} reports</h2><p>Choose a report, set its scope, preview sample rows, then export.</p></div><span className="reports-demo-tag">Sample data</span></header>
    <section className="reports-filter-card"><label>Company<select value={activeCompanyId} onChange={(event) => setActiveCompany(event.target.value)}>{companies.map((company) => <option key={company.id} value={company.id}>{company.company.displayName}</option>)}</select></label><label>From<input type="date" value={from} max={to} onChange={(event) => setFrom(event.target.value)}/></label><label>To<input type="date" value={to} min={from} onChange={(event) => setTo(event.target.value)}/></label><label className="reports-search">Search reports<input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Report name or description"/></label></section>
    <div className="reports-body"><section className="reports-catalog"><header><div><h3>Report catalog</h3><p>{filteredReports.length} reports in this category</p></div></header><div className="reports-catalog__list">{filteredReports.map((report) => <article key={report.name} className={selected?.reportName === report.name ? "is-selected" : ""}><div><strong>{report.name}</strong><p>{report.description}</p></div><button type="button" onClick={() => generate(report.name)}>Generate</button></article>)}</div>{filteredReports.length === 0 && <p className="reports-empty">No reports match that search.</p>}</section>
      <section className="reports-preview"><header><div><h3>{selected?.reportName ?? "Report preview"}</h3><p>{selected ? `${selected.company} · ${selected.period}` : "Generate a report to review sample output."}</p></div></header>{selected ? <><div className="reports-preview__table-wrap"><table className="reports-preview__table"><thead><tr>{selected.columns.map((column) => <th key={column}>{column}</th>)}</tr></thead><tbody>{selected.rows.map((row, index) => <tr key={`${selected.reportName}-${index}`}>{row.map((value, cellIndex) => <td key={`${cellIndex}-${value}`}>{value}</td>)}</tr>)}</tbody></table></div><div className="reports-export"><div><strong>Export formats</strong><span>Download one format or all three together.</span></div><div><button type="button" disabled={busy !== null} onClick={() => void exportFormat("PDF")}>{busy === "PDF" ? "Preparing…" : "PDF"}</button><button type="button" disabled={busy !== null} onClick={() => void exportFormat("Excel")}>{busy === "Excel" ? "Preparing…" : "Excel"}</button><button type="button" disabled={busy !== null} onClick={() => void exportFormat("Word")}>{busy === "Word" ? "Preparing…" : "Word"}</button><button className="reports-export__all" type="button" disabled={busy !== null} onClick={() => void exportFormat("all")}>{busy === "all" ? "Preparing ZIP…" : "Download all formats"}</button></div></div>{error && <p className="reports-error" role="alert">{error}</p>}</> : <div className="reports-preview__empty"><span aria-hidden="true">—</span><p>Pick a report from the catalog to generate a preview.</p></div>}</section></div>
    <section className="reports-generated"><header><div><h3>Generated reports</h3><p>Recent previews in this browser session</p></div><span>{generated.length}</span></header>{generated.length ? <ul>{generated.map((report, index) => <li key={`${report.reportName}-${report.period}-${index}`}><div><strong>{report.reportName}</strong><small>{report.company} · {report.period}</small></div><button type="button" onClick={() => setSelected(report)}>Open preview</button></li>)}</ul> : <p>No reports generated yet.</p>}</section>
    <p className="reports-footnote">Demo rows only. Government and bank files require validated official formats and authorized payroll data before production use.</p>
  </section>;
}
