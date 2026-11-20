import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { APPLICATIONS, type ApplicationId, type ApplicationQueue, type ApplicationRecord } from "../data";
import "./ApplicationWorkspace.css";

const queues: ApplicationQueue[] = ["My Requests", "For Review", "For Approve", "Filings"];
const statusClass: Record<string, string> = {
  "Pending Review": "pending-review", "Pending Approval": "pending-approval", Reviewed: "reviewed",
  Approved: "approved", Filed: "filed", Cancelled: "cancelled",
};

export function ApplicationWorkspace({ applicationId }: { applicationId: ApplicationId }) {
  const config = APPLICATIONS[applicationId];
  const [queue, setQueue] = useState<ApplicationQueue>("My Requests");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<ApplicationRecord | null>(null);
  const filtered = useMemo(() => {
    const queueRecords = config.records.filter((row) => {
      if (queue === "My Requests") return row.employeeId === "EMP-0248";
      if (queue === "For Review") return row.status === "Pending Review";
      if (queue === "For Approve") return row.status === "Pending Approval" || row.status === "Reviewed";
      return true;
    });
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return queueRecords;
    return queueRecords.filter((row) => [row.documentNo, row.employee, row.employeeId, row.transactionDate, row.status, row.attachment, ...Object.values(row.fields)].join(" ").toLowerCase().includes(normalizedQuery));
  }, [config.records, queue, query]);

  return <section className="application-workspace" aria-label={`${config.title} requests`}>
    <header className="application-workspace__heading"><div><p className="application-eyebrow">APPLICATIONS / {config.title.toUpperCase()}</p><h2>{config.title}</h2><p>{config.description}</p></div><span className="application-demo-tag">Sample records</span></header>
    <div className="application-queue-tabs" role="group" aria-label={`${config.title} request lists`}>
      {queues.map((item) => <button key={item} type="button" aria-pressed={queue === item} className={queue === item ? "application-queue-tabs__tab is-active" : "application-queue-tabs__tab"} onClick={() => { setQueue(item); setSelected(null); }}>{item}<span>{item === "My Requests" ? config.records.filter((row) => row.employeeId === "EMP-0248").length : item === "For Review" ? config.records.filter((row) => row.status === "Pending Review").length : item === "For Approve" ? config.records.filter((row) => row.status === "Pending Approval" || row.status === "Reviewed").length : config.records.length}</span></button>)}
    </div>
    <div className="application-table-card">
      <div className="application-table-toolbar"><div><h3>{queue}</h3><p>{queue === "Filings" ? "All employee filings in this application type" : queue === "My Requests" ? "Requests submitted by you" : queue === "For Review" ? "Requests waiting for reviewer action" : "Requests reviewed and waiting for approval"}</p></div><label className="application-search"><span className="application-sr-only">Search {config.title} requests</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search requests" /></label></div>
      <div className="application-table-scroll"><table className="application-table"><thead><tr><th>Document No</th><th>Transaction Date</th><th>Employee</th>{config.columns.map((column) => <th key={column.key}>{column.label}</th>)}<th>Status</th><th>File Attachment</th><th><span className="application-sr-only">Request details</span></th></tr></thead><tbody>
        {filtered.map((row) => <tr key={row.documentNo}><td><button className="application-document-link" type="button" onClick={() => setSelected(row)}>{row.documentNo}</button></td><td>{row.transactionDate}</td><td><strong>{row.employee}</strong><small>{row.employeeId}</small></td>{config.columns.map((column) => <td key={column.key}>{row.fields[column.key] ?? "—"}</td>)}<td><span className={`application-status application-status--${statusClass[row.status]}`}>{row.status}</span></td><td>{row.attachment === "—" ? <span className="application-no-attachment">—</span> : <span className="application-attachment" title={row.attachment}>▧ {row.attachment}</span>}</td><td><button className="application-view-button" type="button" onClick={() => setSelected(row)}>View details</button></td></tr>)}
      </tbody></table>{filtered.length === 0 && <p className="application-empty">No requests found in this view.</p>}</div>
      <footer className="application-table-footer">Showing {filtered.length} of {config.records.length} sample requests</footer>
    </div>

    <AnimatePresence>
      {selected && <><motion.button className="application-drawer-scrim" aria-label="Close request details" type="button" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelected(null)} /><motion.aside className="application-detail-drawer" role="dialog" aria-modal="true" aria-labelledby="application-detail-title" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 280 }}>
        <div className="application-detail-drawer__top"><div><p className="application-eyebrow">REQUEST DETAILS</p><h2 id="application-detail-title">{selected.documentNo}</h2></div><button type="button" className="application-detail-close" aria-label="Close details" onClick={() => setSelected(null)}>×</button></div>
        <div className="application-detail-drawer__scroll"><div className="application-detail-summary"><div><span>Application</span><strong>{config.title}</strong></div><div><span>Status</span><strong><span className={`application-status application-status--${statusClass[selected.status]}`}>{selected.status}</span></strong></div><div><span>Transaction date</span><strong>{selected.transactionDate}</strong></div><div><span>Employee</span><strong>{selected.employee}<small>{selected.employeeId}</small></strong></div></div>
          <section className="application-detail-section"><h3>Request information</h3><dl className="application-detail-fields">{Object.entries(selected.fields).map(([label, value]) => <div key={label}><dt>{label.replace(/([A-Z])/g, " $1").replace(/^./, (letter) => letter.toUpperCase())}</dt><dd>{value}</dd></div>)}</dl></section>
          <section className="application-detail-section"><h3>Reason and notes</h3><p className="application-detail-copy">{selected.reason}</p><p className="application-detail-note">{selected.employeeNote}</p></section>
          <section className="application-detail-section"><h3>Attachments</h3>{selected.attachment === "—" ? <p className="application-no-attachment">No files attached to this request.</p> : <div className="application-file-card"><span aria-hidden="true">▧</span><div><strong>{selected.attachment}</strong><small>Attachment listed in sample record</small></div></div>}</section>
          <section className="application-detail-section"><h3>Review route</h3><div className="application-route"><div><span>Reviewer</span><strong>{selected.reviewer}</strong><small>{selected.history.some((item) => item.action === "Reviewed") ? "Review completed" : "Waiting for review"}</small></div><div><span>Approver</span><strong>{selected.approver}</strong><small>{selected.history.some((item) => item.action === "Approved" || item.action === "Filed") ? "Decision recorded" : "Waiting for approval"}</small></div></div></section>
          <section className="application-detail-section"><h3>Activity</h3><ol className="application-history">{selected.history.map((entry, index) => <li key={`${entry.date}-${entry.action}-${index}`}><span className="application-history__dot"/><div><strong>{entry.action}</strong><small>{entry.actor} · {entry.date}</small><p>{entry.note}</p></div></li>)}</ol></section>
        </div>
      </motion.aside></>}
    </AnimatePresence>
  </section>;
}
