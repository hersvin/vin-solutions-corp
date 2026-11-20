import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import "./RecordPages.css";

type AttendanceRecord = { date: string; day: string; clockIn: string; clockOut: string; hours: string; status: "Present" | "Late" | "On leave" };

const records: AttendanceRecord[] = [
  { date: "2026-11-20", day: "Friday", clockIn: "8:04 AM", clockOut: "5:02 PM", hours: "8h 00m", status: "Present" },
  { date: "2026-11-19", day: "Thursday", clockIn: "8:19 AM", clockOut: "5:11 PM", hours: "7h 52m", status: "Late" },
  { date: "2026-11-18", day: "Wednesday", clockIn: "7:56 AM", clockOut: "5:06 PM", hours: "8h 10m", status: "Present" },
  { date: "2026-11-17", day: "Tuesday", clockIn: "—", clockOut: "—", hours: "—", status: "On leave" },
  { date: "2026-11-16", day: "Monday", clockIn: "8:01 AM", clockOut: "5:03 PM", hours: "8h 02m", status: "Present" },
  { date: "2026-11-13", day: "Friday", clockIn: "8:11 AM", clockOut: "5:00 PM", hours: "7h 49m", status: "Present" },
];

export default function Attendance() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<AttendanceRecord | null>(null);
  const visibleRecords = useMemo(() => records.filter((row) => `${row.date} ${row.day} ${row.status}`.toLowerCase().includes(query.toLowerCase())), [query]);

  return <section className="record-page">
    <header className="record-page__header"><div><p className="record-eyebrow">RECORD / ATTENDANCE</p><h1>Attendance</h1><p className="record-page__description">Review your daily time entries and attendance status.</p></div><span className="record-demo-label">Sample data</span></header>
    <div className="record-stats"><article><span>Days recorded</span><strong>21</strong><small>This month</small></article><article><span>On time</span><strong>18</strong><small>Scheduled workdays</small></article><article><span>Late arrivals</span><strong>2</strong><small>Review if incorrect</small></article><article><span>Hours logged</span><strong>166h</strong><small>Current month</small></article></div>
    <div className="record-table-card">
      <div className="record-table-card__toolbar"><div><h2>Recent entries</h2><p>Latest attendance activity</p></div><label className="record-search"><span className="sr-only">Filter attendance</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search date or status" /></label></div>
      <div className="record-table-wrap"><table className="record-table"><thead><tr><th>Date</th><th>Clock in</th><th>Clock out</th><th>Hours</th><th>Status</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>{visibleRecords.map((row) => <tr key={row.date}><td><strong>{row.day}</strong><small>{row.date}</small></td><td>{row.clockIn}</td><td>{row.clockOut}</td><td>{row.hours}</td><td><span className={`record-status record-status--${row.status.toLowerCase().replace(" ", "-")}`}>{row.status}</span></td><td><button className="record-link-button" type="button" onClick={() => setSelected(row)}>View</button></td></tr>)}</tbody></table></div>
      {visibleRecords.length === 0 && <p className="record-empty">No entries match that search.</p>}
    </div>
    <AnimatePresence>{selected && <motion.aside className="record-detail" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }} aria-label="Attendance details"><button className="record-detail__close" type="button" onClick={() => setSelected(null)}>Close</button><p className="record-eyebrow">ENTRY DETAIL</p><h2>{selected.day}, {selected.date}</h2><dl><div><dt>Clock in</dt><dd>{selected.clockIn}</dd></div><div><dt>Clock out</dt><dd>{selected.clockOut}</dd></div><div><dt>Total hours</dt><dd>{selected.hours}</dd></div><div><dt>Status</dt><dd>{selected.status}</dd></div></dl><p className="record-note">If an entry is incorrect, submit a Missed Log or Leave application for review.</p></motion.aside>}</AnimatePresence>
  </section>;
}
