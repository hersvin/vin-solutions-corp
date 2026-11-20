import { useMemo, useState, type FormEvent } from "react";
import { PAYROLL_PAGES, type PayrollPageId, type PayrollRecord } from "../data";
import "./PayrollWorkspace.css";

function PayrollRun() {
  const [step, setStep] = useState(0);
  const [checked, setChecked] = useState<string[]>([]);
  const [locked, setLocked] = useState(false);
  const steps = ["Validate inputs", "Resolve exceptions", "Preview payroll", "Approve and lock"];
  const exceptions = [{ id: "EX-412", label: "Ana Reyes · Overtime input missing approval" }, { id: "EX-413", label: "Luis Cruz · Leave entry requires confirmation" }, { id: "EX-414", label: "Employee 0441 · Bank account verification needed" }];
  const open = exceptions.filter((item) => !checked.includes(item.id));
  return <section className="payroll-run"><header><div><p className="payroll-eyebrow">CURRENT RUN</p><h3>November 16–30, 2026</h3><p>Hersvin Asia Pacific · 84 employees · Semi-monthly</p></div><span className={`payroll-state ${locked ? "payroll-state--complete" : "payroll-state--review"}`}>{locked ? "Locked" : "Draft"}</span></header><ol className="payroll-steps">{steps.map((name, index) => <li key={name} className={index === step ? "is-current" : index < step || locked ? "is-done" : ""}><span>{index < step || locked ? "✓" : index + 1}</span><small>{name}</small></li>)}</ol>
    {step === 0 && <div className="payroll-run__body"><h4>Input validation</h4><p>84 employees matched. Review 3 exceptions before calculating payroll.</p><div className="payroll-run__metrics"><div><strong>81</strong><span>Ready</span></div><div><strong>3</strong><span>Exceptions</span></div><div><strong>₱3.42M</strong><span>Estimated net</span></div></div><button type="button" className="payroll-primary" onClick={() => setStep(1)}>Review exceptions</button></div>}
    {step === 1 && <div className="payroll-run__body"><h4>Resolve payroll exceptions</h4><div className="payroll-exceptions">{exceptions.map((item) => <label key={item.id}><input type="checkbox" checked={checked.includes(item.id)} onChange={(event) => setChecked((current) => event.target.checked ? [...current, item.id] : current.filter((id) => id !== item.id))}/><span>{item.label}</span></label>)}</div><div className="payroll-run__actions"><button type="button" className="payroll-secondary" onClick={() => setStep(0)}>Back</button><button type="button" className="payroll-primary" disabled={open.length > 0} onClick={() => setStep(2)}>{open.length ? `${open.length} unresolved` : "Preview payroll"}</button></div></div>}
    {step === 2 && <div className="payroll-run__body"><h4>Payroll preview</h4><p>Sample totals only. Verify totals against approved time and payroll inputs.</p><div className="payroll-run__metrics"><div><strong>₱4.08M</strong><span>Gross pay</span></div><div><strong>₱660K</strong><span>Deductions</span></div><div><strong>₱3.42M</strong><span>Net pay</span></div></div><div className="payroll-run__actions"><button type="button" className="payroll-secondary" onClick={() => setStep(1)}>Back</button><button type="button" className="payroll-primary" onClick={() => setStep(3)}>Send for approval</button></div></div>}
    {step === 3 && <div className="payroll-run__body"><h4>{locked ? "Run locked" : "Approval ready"}</h4><p>{locked ? "This sample run is locked in the current session." : "Approval and locking are simulated for this prototype."}</p><div className="payroll-run__actions"><button type="button" className="payroll-secondary" onClick={() => setStep(2)}>Back to preview</button><button type="button" className="payroll-primary" disabled={locked} onClick={() => setLocked(true)}>{locked ? "Locked" : "Approve and lock run"}</button></div></div>}</section>;
}

export function PayrollWorkspace({ pageId }: { pageId: PayrollPageId }) {
  const config = PAYROLL_PAGES[pageId];
  const [records, setRecords] = useState(config.records);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<PayrollRecord | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [notice, setNotice] = useState("");
  const filtered = useMemo(() => records.filter((record) => [record.id, record.employee, record.status, ...Object.values(record.fields)].join(" ").toLowerCase().includes(query.trim().toLowerCase())), [records, query]);

  function addRecord(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const employee = String(form.get("employee") ?? "").trim();
    if (!employee) return;
    const fields = Object.fromEntries(config.columns.map((column) => [column.key, String(form.get(column.key) ?? "").trim() || "—"]));
    const record: PayrollRecord = { id: `PAY-${String(records.length + 1).padStart(3, "0")}`, employee, status: "For Review", fields };
    setRecords((current) => [record, ...current]);
    setShowForm(false);
    setNotice(`${config.title} entry added for review in this session.`);
    event.currentTarget.reset();
  }

  return <section className="payroll-workspace">
    <header className="payroll-heading"><div><p className="payroll-eyebrow">PAYROLL / {config.title.toUpperCase()}</p><h2>{config.title}</h2><p>{config.description}</p></div><span className="payroll-demo-tag">Sample data</span></header>
    <div className="payroll-stats">{config.stats.map((item) => <article key={item.label}><span>{item.label}</span><strong>{item.value}</strong><small>{item.note}</small></article>)}</div>
    {pageId === "PayrollProcessing" && <PayrollRun/>}
    <section className="payroll-table-card"><div className="payroll-toolbar"><div><h3>{pageId === "PayrollProcessing" ? "Employee preview" : `${config.title} records`}</h3><p>{filtered.length} sample records · Select a row for the full detail</p></div><div className="payroll-toolbar__actions"><label><span className="payroll-sr-only">Search {config.title} records</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search records"/></label>{pageId !== "PayrollProcessing" && <button className="payroll-secondary" type="button" onClick={() => setShowForm((value) => !value)}>{showForm ? "Cancel" : "Add entry"}</button>}</div></div>
      {notice && <p className="payroll-notice" role="status">{notice}</p>}
      {showForm && <form className="payroll-entry-form" onSubmit={addRecord}><h4>New {config.title.toLowerCase()} entry</h4><label>Employee<input name="employee" required maxLength={80} placeholder="Employee name"/></label>{config.columns.map((column) => <label key={column.key}>{column.label}<input name={column.key} required maxLength={120} placeholder={column.label}/></label>)}<button className="payroll-primary" type="submit">Save for review</button></form>}
      <div className="payroll-table-scroll"><table className="payroll-table"><thead><tr><th>Reference</th><th>Employee</th>{config.columns.map((column) => <th key={column.key}>{column.label}</th>)}<th>Status</th><th></th></tr></thead><tbody>{filtered.map((record) => <tr key={record.id}><td><button type="button" className="payroll-record-link" onClick={() => setSelected(record)}>{record.id}</button></td><td><strong>{record.employee}</strong></td>{config.columns.map((column) => <td key={column.key}>{record.fields[column.key] ?? "—"}</td>)}<td><span className={`payroll-state payroll-state--${record.status.toLowerCase().replaceAll(" ", "-")}`}>{record.status}</span></td><td><button className="payroll-record-link" type="button" onClick={() => setSelected(record)}>Details</button></td></tr>)}</tbody></table>{filtered.length === 0 && <p className="payroll-empty">No records match this search.</p>}</div></section>
    {selected && <div className="payroll-detail-layer"><button type="button" className="payroll-detail-scrim" aria-label="Close record details" onClick={() => setSelected(null)}/><aside className="payroll-detail" role="dialog" aria-modal="true" aria-labelledby="payroll-detail-title"><header><div><p className="payroll-eyebrow">PAYROLL RECORD</p><h3 id="payroll-detail-title">{selected.id}</h3></div><button type="button" className="payroll-secondary" onClick={() => setSelected(null)}>Close</button></header><div className="payroll-detail__body"><p className="payroll-detail__employee">{selected.employee} <span className={`payroll-state payroll-state--${selected.status.toLowerCase().replaceAll(" ", "-")}`}>{selected.status}</span></p><dl>{Object.entries(selected.fields).map(([key, value]) => <div key={key}><dt>{config.columns.find((column) => column.key === key)?.label ?? key}</dt><dd>{value}</dd></div>)}</dl><p className="payroll-detail__note">Payroll amounts shown are sample values and require validation against approved company records.</p></div></aside></div>}
  </section>;
}
