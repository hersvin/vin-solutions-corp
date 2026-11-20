import { useMemo, useState, type FormEvent } from "react";
import "./TimekeepingWorkspace.css";

export type TimekeepingPageId = "EmployeeTimeRecord" | "LeaveAdjustments" | "TimekeepingProcessing" | "WorkSchedule";

const timeRecords = [
  { id: "TR-2026-1120-0248", employee: "Vin Santos", employeeId: "EMP-0248", department: "Human Resources", date: "Nov 20, 2026", schedule: "8:00 AM–5:00 PM", in: "8:04 AM", breakOut: "12:03 PM", breakIn: "1:00 PM", out: "5:02 PM", hours: "8h 00m", status: "Present", issue: "—" },
  { id: "TR-2026-1119-0182", employee: "Ana Reyes", employeeId: "EMP-0182", department: "Finance", date: "Nov 19, 2026", schedule: "8:00 AM–5:00 PM", in: "8:19 AM", breakOut: "12:00 PM", breakIn: "1:00 PM", out: "5:11 PM", hours: "7h 52m", status: "Late", issue: "19 min late" },
  { id: "TR-2026-1118-0139", employee: "Luis Cruz", employeeId: "EMP-0139", department: "Operations", date: "Nov 18, 2026", schedule: "8:00 AM–5:00 PM", in: "—", breakOut: "—", breakIn: "—", out: "—", hours: "—", status: "Absent", issue: "Leave filing pending" },
  { id: "TR-2026-1117-0306", employee: "Bea Navarro", employeeId: "EMP-0306", department: "Human Resources", date: "Nov 17, 2026", schedule: "9:00 AM–6:00 PM", in: "8:56 AM", breakOut: "12:10 PM", breakIn: "1:00 PM", out: "6:22 PM", hours: "8h 36m", status: "Overtime", issue: "22 min overtime" },
  { id: "TR-2026-1116-0248", employee: "Vin Santos", employeeId: "EMP-0248", department: "Human Resources", date: "Nov 16, 2026", schedule: "8:00 AM–5:00 PM", in: "8:01 AM", breakOut: "12:00 PM", breakIn: "1:00 PM", out: "—", hours: "—", status: "Needs review", issue: "Missing clock-out" },
];

const startingAdjustments = [
  { id: "LA-2026-031", date: "Nov 18, 2026", employee: "Vin Santos", employeeId: "EMP-0248", type: "Vacation leave", delta: "+1.00", before: "7.50", after: "8.50", reason: "Monthly accrual", status: "Posted" },
  { id: "LA-2026-030", date: "Nov 17, 2026", employee: "Ana Reyes", employeeId: "EMP-0182", type: "Sick leave", delta: "−1.00", before: "7.00", after: "6.00", reason: "Approved leave · LV-2026-118", status: "Posted" },
  { id: "LA-2026-029", date: "Nov 15, 2026", employee: "Luis Cruz", employeeId: "EMP-0139", type: "Vacation leave", delta: "+0.50", before: "5.50", after: "6.00", reason: "Balance correction · HR verified", status: "Posted" },
  { id: "LA-2026-028", date: "Nov 14, 2026", employee: "Bea Navarro", employeeId: "EMP-0306", type: "Sick leave", delta: "+1.00", before: "4.00", after: "5.00", reason: "Monthly accrual", status: "Posted" },
];

const processingSteps = ["Review records", "Resolve exceptions", "Preview totals", "Process cutoff"] as const;
const processExceptions = [
  { id: "EX-011", employee: "Ana Reyes", detail: "Late arrival · Nov 19 · 19 minutes", type: "Late" },
  { id: "EX-012", employee: "Luis Cruz", detail: "No time entries · Nov 18", type: "Absent" },
  { id: "EX-013", employee: "Vin Santos", detail: "Missing clock-out · Nov 16", type: "Incomplete" },
];

const scheduleEmployees = [
  { id: "EMP-0248", name: "Vin Santos", team: "People Operations", shifts: ["Day", "Day", "Day", "Day", "Day"] },
  { id: "EMP-0182", name: "Ana Reyes", team: "Finance", shifts: ["Early", "Early", "Early", "Early", "Early"] },
  { id: "EMP-0139", name: "Luis Cruz", team: "Operations", shifts: ["Day", "Day", "Off", "Day", "Day"] },
  { id: "EMP-0306", name: "Bea Navarro", team: "People Operations", shifts: ["Late", "Late", "Late", "Late", "Late"] },
];
const shiftTimes: Record<string, string> = { Day: "8:00 AM–5:00 PM", Early: "7:00 AM–4:00 PM", Late: "9:00 AM–6:00 PM", Off: "Day off" };

function PageHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <header className="tk-heading"><div><p className="tk-eyebrow">{eyebrow}</p><h2>{title}</h2><p>{description}</p></div><span className="tk-sample-tag">Sample data</span></header>;
}

function TimeRecordView() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All statuses");
  const [selected, setSelected] = useState<(typeof timeRecords)[number] | null>(null);
  const records = useMemo(() => timeRecords.filter((record) => `${record.employee} ${record.employeeId} ${record.date} ${record.issue}`.toLowerCase().includes(query.toLowerCase()) && (status === "All statuses" || record.status === status)), [query, status]);
  return <section className="tk-page">
    <PageHeading eyebrow="TIMEKEEPING / EMPLOYEE TIME RECORD" title="Employee time record" description="Review employee punches, daily totals, and attendance exceptions."/>
    <div className="tk-summary"><article><span>Records in view</span><strong>5</strong><small>Nov 16–20 cutoff</small></article><article><span>Needs attention</span><strong>3</strong><small>Late, absent, or incomplete</small></article><article><span>Hours recorded</span><strong>24h 28m</strong><small>Visible sample records</small></article></div>
    <div className="tk-card"><div className="tk-toolbar"><div><h3>Daily punches</h3><p>Nov 16–20, 2026 · Sample cutoff</p></div><div className="tk-filters"><label><span className="tk-sr-only">Search employee time records</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search employee or issue"/></label><label><span className="tk-sr-only">Filter record status</span><select value={status} onChange={(event) => setStatus(event.target.value)}><option>All statuses</option><option>Present</option><option>Late</option><option>Absent</option><option>Overtime</option><option>Needs review</option></select></label></div></div>
      <div className="tk-table-wrap"><table className="tk-table"><thead><tr><th>Employee</th><th>Date</th><th>Schedule</th><th>Clock in</th><th>Clock out</th><th>Hours</th><th>Status</th><th></th></tr></thead><tbody>{records.map((record) => <tr key={record.id}><td><strong>{record.employee}</strong><small>{record.employeeId} · {record.department}</small></td><td>{record.date}</td><td>{record.schedule}</td><td>{record.in}</td><td>{record.out}</td><td>{record.hours}</td><td><span className={`tk-status tk-status--${record.status.toLowerCase().replaceAll(" ", "-")}`}>{record.status}</span></td><td><button className="tk-link" type="button" onClick={() => setSelected(record)}>Details</button></td></tr>)}</tbody></table>{records.length === 0 && <p className="tk-empty">No time records match.</p>}</div>
    </div>
    {selected && <div className="tk-inline-detail"><div><p className="tk-eyebrow">RECORD DETAIL · {selected.id}</p><h3>{selected.employee} · {selected.date}</h3><p>{selected.issue === "—" ? "No recorded exception." : selected.issue}</p></div><dl><div><dt>Clock in</dt><dd>{selected.in}</dd></div><div><dt>Break out</dt><dd>{selected.breakOut}</dd></div><div><dt>Break in</dt><dd>{selected.breakIn}</dd></div><div><dt>Clock out</dt><dd>{selected.out}</dd></div><div><dt>Daily hours</dt><dd>{selected.hours}</dd></div><div><dt>Scheduled shift</dt><dd>{selected.schedule}</dd></div></dl><button type="button" className="tk-secondary" onClick={() => setSelected(null)}>Close details</button></div>}
  </section>;
}

function LeaveAdjustmentView() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("All leave types");
  const adjustments = useMemo(() => startingAdjustments.filter((row) => `${row.id} ${row.employee} ${row.reason}`.toLowerCase().includes(query.toLowerCase()) && (type === "All leave types" || row.type === type)), [query, type]);
  return <section className="tk-page">
    <PageHeading eyebrow="TIMEKEEPING / LEAVE ADJUSTMENTS" title="Leave adjustments" description="Review posted leave balance changes and the reason behind each entry."/>
    <div className="tk-summary"><article><span>Vacation balances</span><strong>25.0 days</strong><small>Across sample employees</small></article><article><span>Sick leave balances</span><strong>17.5 days</strong><small>Across sample employees</small></article><article><span>Posted this period</span><strong>{startingAdjustments.length}</strong><small>Adjustment entries</small></article></div>
    <div className="tk-card"><div className="tk-toolbar"><div><h3>Adjustment ledger</h3><p>Each entry records the balance before and after the change.</p></div><div className="tk-filters"><label><span className="tk-sr-only">Search adjustment ledger</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search employee or reason"/></label><label><span className="tk-sr-only">Filter leave type</span><select value={type} onChange={(event) => setType(event.target.value)}><option>All leave types</option><option>Vacation leave</option><option>Sick leave</option></select></label></div></div>
      <div className="tk-table-wrap"><table className="tk-table"><thead><tr><th>Transaction</th><th>Date</th><th>Employee</th><th>Leave type</th><th>Change</th><th>Before</th><th>After</th><th>Reason</th><th>Status</th></tr></thead><tbody>{adjustments.map((row) => <tr key={row.id}><td><strong>{row.id}</strong></td><td>{row.date}</td><td><strong>{row.employee}</strong><small>{row.employeeId}</small></td><td>{row.type}</td><td className={row.delta.startsWith("+") ? "tk-positive" : "tk-negative"}>{row.delta} day</td><td>{row.before}</td><td><strong>{row.after}</strong></td><td>{row.reason}</td><td><span className="tk-status tk-status--present">{row.status}</span></td></tr>)}</tbody></table>{adjustments.length === 0 && <p className="tk-empty">No adjustments match.</p>}</div>
    </div><p className="tk-footnote">Balance adjustments require an authorized HR action. This view shows sample posted records only.</p>
  </section>;
}

function ProcessingView() {
  const [step, setStep] = useState(0);
  const [resolved, setResolved] = useState<string[]>([]);
  const [processed, setProcessed] = useState(false);
  const unresolved = processExceptions.filter((item) => !resolved.includes(item.id));
  const canContinue = step !== 1 || unresolved.length === 0;
  function advance() {
    if (step < processingSteps.length - 1) setStep((current) => current + 1);
    else setProcessed(true);
  }
  return <section className="tk-page">
    <PageHeading eyebrow="TIMEKEEPING / TIMEKEEPING PROCESSING" title="Timekeeping processing" description="Validate a cutoff, resolve exceptions, preview totals, and process the period."/>
    <div className="tk-process-card"><div className="tk-process-head"><div><span>Selected cutoff</span><h3>November 16–30, 2026</h3><small>Company · Hersvin Philippines · 84 employees</small></div><span className={`tk-status ${processed ? "tk-status--present" : "tk-status--pending"}`}>{processed ? "Processed" : "Draft"}</span></div>
      <ol className="tk-stepper">{processingSteps.map((label, index) => <li key={label} className={index === step ? "is-current" : index < step || processed ? "is-complete" : ""}><span>{index < step || processed ? "✓" : index + 1}</span><small>{label}</small></li>)}</ol>
      {step === 0 && <div className="tk-process-body"><h4>Record validation</h4><p>Timesheets received for <strong>84 of 84 employees</strong>. Review the exceptions before moving to the next step.</p><div className="tk-process-metrics"><article><strong>79</strong><span>Ready to process</span></article><article><strong>3</strong><span>Exceptions to review</span></article><article><strong>2</strong><span>Approved leave days</span></article></div><button className="tk-secondary" type="button" onClick={() => setStep(1)}>Review exceptions</button></div>}
      {step === 1 && <div className="tk-process-body"><h4>Resolve timekeeping exceptions</h4><p>Mark each item resolved after reviewing its supporting record.</p><div className="tk-exception-list">{processExceptions.map((item) => <label key={item.id} className={resolved.includes(item.id) ? "is-resolved" : ""}><input type="checkbox" checked={resolved.includes(item.id)} onChange={(event) => setResolved((current) => event.target.checked ? [...current, item.id] : current.filter((id) => id !== item.id))}/><span><strong>{item.employee}</strong><small>{item.detail}</small></span><span className="tk-exception-type">{item.type}</span></label>)}</div><div className="tk-process-actions"><button className="tk-secondary" type="button" onClick={() => setStep(0)}>Back</button><button className="tk-primary" type="button" disabled={!canContinue} onClick={advance}>{unresolved.length ? `${unresolved.length} unresolved` : "Continue to preview"}</button></div></div>}
      {step === 2 && <div className="tk-process-body"><h4>Preview cutoff totals</h4><p>Confirm these sample totals before processing.</p><div className="tk-process-metrics"><article><strong>84</strong><span>Employees included</span></article><article><strong>6,720h</strong><span>Regular hours</span></article><article><strong>34h</strong><span>Approved overtime</span></article><article><strong>16</strong><span>Leave days</span></article></div><div className="tk-process-actions"><button className="tk-secondary" type="button" onClick={() => setStep(1)}>Back</button><button className="tk-primary" type="button" onClick={advance}>Confirm and process</button></div></div>}
      {step === 3 && <div className="tk-process-body"><h4>{processed ? "Cutoff processed" : "Ready to process"}</h4><p>{processed ? "The sample cutoff is marked processed in this session." : "Processing locks the reviewed time entries for this cutoff."}</p><div className="tk-process-actions"><button className="tk-secondary" type="button" onClick={() => setStep(2)}>Back to preview</button><button className="tk-primary" type="button" disabled={processed} onClick={advance}>{processed ? "Processed" : "Process cutoff"}</button></div></div>}
    </div><p className="tk-footnote">Demo workflow only. No payroll records are changed or submitted.</p>
  </section>;
}

function WorkScheduleView() {
  const [shifts, setShifts] = useState(scheduleEmployees.map((employee) => ({ ...employee, shifts: [...employee.shifts] })));
  const [notice, setNotice] = useState("");
  const [weekOffset, setWeekOffset] = useState(0);
  const weekStart = new Date(2026, 10, 23 + weekOffset * 7);
  const weekdays = Array.from({ length: 5 }, (_, index) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + index);
    return date.toLocaleDateString("en", { weekday: "short", month: "short", day: "numeric" });
  });
  const weekLabel = `${weekStart.toLocaleDateString("en", { month: "short", day: "numeric" })}–${new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() + 4).toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" })}`;
  const updateShift = (employeeId: string, dayIndex: number, value: string) => setShifts((current) => current.map((employee) => employee.id === employeeId ? { ...employee, shifts: employee.shifts.map((shift, index) => index === dayIndex ? value : shift) } : employee));
  const coverageConflicts = weekdays.filter((_, index) => shifts.filter((employee) => employee.shifts[index] === "Late").length > 2);
  function copySchedule(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setWeekOffset((current) => current + 1); setNotice("Copied this shift pattern to the next week in the sample view."); }
  return <section className="tk-page">
    <PageHeading eyebrow="TIMEKEEPING / WORK SCHEDULE" title="Work schedule" description="Review weekly shifts, assign a shift pattern, and check coverage."/>
    <div className="tk-schedule-toolbar"><div className="tk-week-picker"><button type="button" aria-label="Previous week" onClick={() => { setWeekOffset((current) => current - 1); setNotice(""); }}>‹</button><strong>{weekLabel}</strong><button type="button" aria-label="Next week" onClick={() => { setWeekOffset((current) => current + 1); setNotice(""); }}>›</button></div><form onSubmit={copySchedule}><button className="tk-secondary" type="submit">Copy week</button></form></div>
    {notice && <p className="tk-notice" role="status">{notice}</p>}
    {coverageConflicts.length > 0 && <div className="tk-alert"><strong>Coverage check:</strong> {coverageConflicts.length} day has more than two employees assigned to the late shift.</div>}
    <div className="tk-card"><div className="tk-toolbar"><div><h3>Team schedule</h3><p>Change a shift from its day cell. Edits remain local to this sample view.</p></div><span className="tk-shift-legend"><i className="tk-shift-dot tk-shift-dot--early"/>Early <i className="tk-shift-dot tk-shift-dot--day"/>Day <i className="tk-shift-dot tk-shift-dot--late"/>Late</span></div><div className="tk-table-wrap"><table className="tk-schedule-table"><thead><tr><th>Employee</th>{weekdays.map((day) => <th key={day}>{day}</th>)}</tr></thead><tbody>{shifts.map((employee) => <tr key={employee.id}><th scope="row"><strong>{employee.name}</strong><small>{employee.id} · {employee.team}</small></th>{employee.shifts.map((shift, index) => <td key={`${employee.id}-${index}`}><label className={`tk-shift-cell tk-shift-cell--${shift.toLowerCase()}`}><span className="tk-sr-only">{employee.name}, {weekdays[index]} shift</span><select value={shift} onChange={(event) => updateShift(employee.id, index, event.target.value)}><option>Early</option><option>Day</option><option>Late</option><option>Off</option></select><small>{shiftTimes[shift]}</small></label></td>)}</tr>)}</tbody></table></div></div>
    <p className="tk-footnote">{coverageConflicts.length ? "Review late-shift coverage before publishing." : "No shift coverage conflicts detected in this sample schedule."}</p>
  </section>;
}

export function TimekeepingWorkspace({ pageId }: { pageId: TimekeepingPageId }) {
  if (pageId === "EmployeeTimeRecord") return <TimeRecordView/>;
  if (pageId === "LeaveAdjustments") return <LeaveAdjustmentView/>;
  if (pageId === "TimekeepingProcessing") return <ProcessingView/>;
  return <WorkScheduleView/>;
}
