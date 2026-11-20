import { useMemo, useState, type FormEvent } from "react";
import { useCompanyManagementStore } from "@/modules/cms/store";
import { CONFIGURATION_PAGES, type ConfigurationPageId, type ConfigurationRecord } from "../data";
import "./ConfigurationWorkspace.css";

const NO_CONFIGURATION_RECORDS: ConfigurationRecord[] = [];

export function ConfigurationWorkspace({ pageId }: { pageId: ConfigurationPageId }) {
  const config = CONFIGURATION_PAGES[pageId];
  const companies = useCompanyManagementStore((state) => state.companies);
  const activeCompanyId = useCompanyManagementStore((state) => state.activeCompanyId);
  const setActiveCompany = useCompanyManagementStore((state) => state.setActiveCompany);
  const activeCompany = companies.find((company) => company.id === activeCompanyId);
  const [recordsByCompany, setRecordsByCompany] = useState<Record<string, ConfigurationRecord[]>>(() => ({ [companies[0]?.id ?? activeCompanyId]: config.records }));
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState<ConfigurationRecord | null>(null);
  const [notice, setNotice] = useState("");
  const [formError, setFormError] = useState("");
  const records = recordsByCompany[activeCompanyId] ?? NO_CONFIGURATION_RECORDS;
  const filtered = useMemo(() => records.filter((record) => [record.id, record.status, ...Object.values(record.fields)].join(" ").toLowerCase().includes(query.trim().toLowerCase())), [records, query]);

  function addConfiguration(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const fields = Object.fromEntries(config.columns.map((column) => [column.key, String(form.get(column.key) ?? "").trim()]));
    if (Object.values(fields).some((value) => !value)) return;
    if (pageId === "CutoffPeriod") {
      const start = Date.parse(fields.start);
      const end = Date.parse(fields.end);
      if (!Number.isFinite(start) || !Number.isFinite(end) || start > end) {
        setFormError("Enter a valid date range. Period start must be on or before period end.");
        return;
      }
      const overlaps = records.some((record) => record.fields.payGroup === fields.payGroup && record.status !== "Closed" && start <= Date.parse(record.fields.end) && end >= Date.parse(record.fields.start));
      if (overlaps) {
        setFormError("This period overlaps an open period for the same pay group.");
        return;
      }
    }
    if (pageId === "Holiday" && records.some((record) => record.fields.date === fields.date && record.fields.scope === fields.scope)) {
      setFormError("A holiday already exists for that date and scope.");
      return;
    }
    if (pageId === "ApprovalSetup" && records.some((record) => record.fields.requestType.toLowerCase() === fields.requestType.toLowerCase())) {
      setFormError("An approval route already exists for that request type.");
      return;
    }
    const record: ConfigurationRecord = { id: `${pageId.toUpperCase()}-${String(records.length + 1).padStart(3, "0")}`, status: String(form.get("status") ?? "Active"), fields };
    setRecordsByCompany((current) => ({ ...current, [activeCompanyId]: [record, ...(current[activeCompanyId] ?? [])] }));
    setNotice(`${config.title} record added for ${activeCompany?.company.displayName ?? "this company"}.`);
    setFormError("");
    setShowForm(false);
    event.currentTarget.reset();
  }

  return <section className="configuration-workspace">
    <header className="configuration-heading"><div><p className="configuration-eyebrow">CONFIGURATION / {config.title.toUpperCase()}</p><h2>{config.title}</h2><p>{config.description}</p></div><span className="configuration-demo-tag">Company scoped</span></header>
    <div className="configuration-company-scope"><label htmlFor={`configuration-company-${pageId}`}>Active company</label><select id={`configuration-company-${pageId}`} value={activeCompanyId} onChange={(event) => { setActiveCompany(event.target.value); setNotice(""); }} aria-label="Select active company">{companies.map((company) => <option key={company.id} value={company.id}>{company.company.displayName}</option>)}</select><span>{activeCompany?.company.legalName}</span></div>
    <div className="configuration-stats">{(records.length ? config.stats : [{ label: "Company records", value: "0", note: "No sample entries for this company" }, { label: "Active scope", value: activeCompany?.company.displayName ?? "Selected company", note: "Changes stay scoped" }, { label: "Status", value: "Ready", note: "Add the first record" }]).map((item) => <article key={item.label}><span>{item.label}</span><strong>{item.value}</strong><small>{item.note}</small></article>)}</div>
    <section className="configuration-table-card"><div className="configuration-toolbar"><div><h3>{config.title} records</h3><p>{activeCompany?.company.displayName} · {filtered.length} records</p></div><div><label><span className="configuration-sr-only">Search configuration records</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search records"/></label><button className="configuration-primary" type="button" onClick={() => setShowForm((value) => !value)}>{showForm ? "Cancel" : `Add ${config.title}`}</button></div></div>
      {notice && <p className="configuration-notice" role="status">{notice}</p>}
      {showForm && <form className="configuration-form" onSubmit={addConfiguration}><h4>New {config.title.toLowerCase()} record</h4>{config.columns.map((column) => <label key={column.key}>{column.label}<input name={column.key} type={(pageId === "CutoffPeriod" && ["start", "end", "payDate"].includes(column.key)) || (pageId === "Holiday" && column.key === "date") ? "date" : "text"} maxLength={100} required placeholder={column.label}/></label>)}<label>Status<select name="status">{(pageId === "CutoffPeriod" ? ["Open", "Closed", "Draft"] : pageId === "Holiday" ? ["Published", "Draft"] : pageId === "SchedulerSetup" ? ["Enabled", "Paused"] : ["Active", "Draft"]).map((status) => <option key={status}>{status}</option>)}</select></label><button className="configuration-primary" type="submit">Save record</button>{formError && <p className="configuration-form-error" role="alert">{formError}</p>}</form>}
      <div className="configuration-table-scroll"><table className="configuration-table"><thead><tr><th>Reference</th>{config.columns.map((column) => <th key={column.key}>{column.label}</th>)}<th>Status</th><th></th></tr></thead><tbody>{filtered.map((record) => <tr key={record.id}><td><button className="configuration-link" type="button" onClick={() => setSelected(record)}>{record.id}</button></td>{config.columns.map((column) => <td key={column.key}>{record.fields[column.key]}</td>)}<td><span className={`configuration-status configuration-status--${record.status.toLowerCase().replaceAll(" ", "-")}`}>{record.status}</span></td><td><button className="configuration-link" type="button" onClick={() => setSelected(record)}>Details</button></td></tr>)}</tbody></table>{filtered.length === 0 && <div className="configuration-empty"><strong>No {config.title.toLowerCase()} records for {activeCompany?.company.displayName}.</strong><span>Add a company-scoped record to populate this view.</span></div>}</div></section>
    {selected && <div className="configuration-detail-layer"><button type="button" className="configuration-detail-scrim" aria-label="Close configuration details" onClick={() => setSelected(null)}/><aside className="configuration-detail" role="dialog" aria-modal="true" aria-labelledby="configuration-detail-title"><header><div><p className="configuration-eyebrow">{activeCompany?.company.displayName}</p><h3 id="configuration-detail-title">{selected.id}</h3></div><button className="configuration-primary" type="button" onClick={() => setSelected(null)}>Close</button></header><dl>{Object.entries(selected.fields).map(([key, value]) => <div key={key}><dt>{config.columns.find((column) => column.key === key)?.label ?? key}</dt><dd>{value}</dd></div>)}<div><dt>Status</dt><dd>{selected.status}</dd></div></dl><p>Demo configuration record; no scheduler, approval flow, or payroll period is changed on a server.</p></aside></div>}
  </section>;
}
