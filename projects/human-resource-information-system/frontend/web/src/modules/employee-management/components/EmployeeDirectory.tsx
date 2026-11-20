import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { EMPLOYEES, employeeAvatar, type Employee } from "../data";
import "./EmployeeDirectory.css";

const initials = (name: string) => name.split(" ").map((part) => part[0]).slice(0, 2).join("");

function Avatar({ employee, size = "normal" }: { employee: Employee; size?: "normal" | "large" }) {
  return <span className={`employee-avatar employee-avatar--${size}`} aria-hidden="true"><span>{initials(employee.name)}</span><img loading="lazy" decoding="async" src={employeeAvatar(employee)} alt="" onError={(event) => { event.currentTarget.style.display = "none"; }} /></span>;
}

function ProfileDetails({ employee, onClose }: { employee: Employee; onClose: () => void }) {
  return <><motion.button className="employee-profile-scrim" aria-label="Close employee profile" type="button" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} /><motion.aside className="employee-profile-drawer" role="dialog" aria-modal="true" aria-labelledby="employee-profile-title" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 280 }}>
    <div className="employee-profile-drawer__header"><div><p className="employee-eyebrow">201 FILE / EMPLOYEE PROFILE</p><button className="employee-profile-close" type="button" onClick={onClose} aria-label="Close profile">×</button></div><div className="employee-profile-identity"><Avatar employee={employee} size="large"/><div><h2 id="employee-profile-title">{employee.name}</h2><p>{employee.title}</p><span>{employee.id} · {employee.department}</span></div></div><span className={`employee-status employee-status--${employee.status.toLowerCase().replace(" ", "-")}`}>{employee.status}</span></div>
    <div className="employee-profile-drawer__scroll">
      <section className="employee-profile-section"><h3>Personal information</h3><dl className="employee-profile-grid"><div><dt>Preferred name</dt><dd>{employee.preferredName}</dd></div><div><dt>Birth date</dt><dd>{employee.birthDate}</dd></div><div><dt>Email</dt><dd>{employee.email}</dd></div><div><dt>Phone</dt><dd>{employee.phone}</dd></div><div><dt>Home address</dt><dd>{employee.address}</dd></div><div><dt>Emergency contact</dt><dd>{employee.emergencyContact}</dd></div></dl></section>
      <section className="employee-profile-section"><h3>Education</h3><div className="employee-record-list">{employee.education.map((item) => <article key={`${item.school}-${item.degree}`}><strong>{item.degree}</strong><span>{item.school}</span><small>{item.years}</small></article>)}</div></section>
      <section className="employee-profile-section"><h3>Employment history</h3><div className="employee-record-list">{employee.employmentHistory.map((item) => <article key={`${item.company}-${item.role}`}><strong>{item.role}</strong><span>{item.company}</span><small>{item.dates}</small></article>)}</div></section>
      <section className="employee-profile-section"><h3>Employment record</h3><dl className="employee-profile-grid">{employee.employmentRecord.map((item) => <div key={item.label}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}<div><dt>Employment type</dt><dd>{employee.employmentType}</dd></div><div><dt>Branch</dt><dd>{employee.branch}</dd></div></dl></section>
      <section className="employee-profile-section"><h3>Employee benefits</h3><div className="employee-benefits-list">{employee.benefits.map((benefit) => <article key={benefit.name}><div><strong>{benefit.name}</strong><span>{benefit.detail}</span></div><span className={`employee-benefit-status employee-benefit-status--${benefit.status.toLowerCase()}`}>{benefit.status}</span></article>)}</div></section>
    </div>
  </motion.aside></>;
}

export function EmployeeDirectory() {
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState("All departments");
  const [status, setStatus] = useState("All statuses");
  const [selected, setSelected] = useState<Employee | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 12;
  const departments = [...new Set(EMPLOYEES.map((employee) => employee.department))];
  const filtered = useMemo(() => EMPLOYEES.filter((employee) => {
    const matchesQuery = `${employee.name} ${employee.id} ${employee.title} ${employee.department} ${employee.branch}`.toLowerCase().includes(query.trim().toLowerCase());
    return matchesQuery && (department === "All departments" || employee.department === department) && (status === "All statuses" || employee.status === status);
  }), [query, department, status]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const pageEmployees = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return <section className="employee-directory">
    <header className="employee-directory__heading"><div><p className="employee-eyebrow">EMPLOYEE MANAGEMENT / 201 FILES</p><h2>Employee directory</h2><p>Find an employee and open their profile record.</p></div><span className="employee-sample-tag">Sample data</span></header>
    <div className="employee-directory__filters"><label className="employee-search"><span className="employee-sr-only">Search employees</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, ID, role" /></label><label><span className="employee-sr-only">Filter department</span><select value={department} onChange={(event) => setDepartment(event.target.value)}><option>All departments</option>{departments.map((item) => <option key={item}>{item}</option>)}</select></label><label><span className="employee-sr-only">Filter employment status</span><select value={status} onChange={(event) => setStatus(event.target.value)}><option>All statuses</option><option>Active</option><option>On leave</option><option>Separated</option></select></label><span className="employee-result-count">{filtered.length} employees</span></div>
    <div className="employee-card-grid">{pageEmployees.map((employee) => <button key={employee.id} className="employee-card" type="button" onClick={() => setSelected(employee)}><span className="employee-card__top"><Avatar employee={employee}/><span className={`employee-status employee-status--${employee.status.toLowerCase().replace(" ", "-")}`}>{employee.status}</span></span><strong className="employee-card__name">{employee.name}</strong><span className="employee-card__title">{employee.title}</span><span className="employee-card__meta">{employee.id} <i aria-hidden="true">·</i> {employee.department}</span><span className="employee-card__branch">{employee.branch} <b aria-hidden="true">→</b></span></button>)}</div>
    {filtered.length === 0 && <div className="employee-empty">No employees match these filters.</div>}
    {pageCount > 1 && <nav className="employee-pagination" aria-label="Employee directory pages"><span>Showing {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, filtered.length)} of {filtered.length}</span><div><button type="button" disabled={currentPage === 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>Previous</button><span>Page {currentPage} of {pageCount}</span><button type="button" disabled={currentPage === pageCount} onClick={() => setPage((value) => Math.min(pageCount, value + 1))}>Next</button></div></nav>}
    <AnimatePresence>{selected && <ProfileDetails employee={selected} onClose={() => setSelected(null)}/>}</AnimatePresence>
  </section>;
}
