import { useMemo, useState, type FormEvent } from "react";
import { Field, PageActions, SearchField, SectionCard, SelectField, StatusBadge } from "@/modules/cms/components/CompanyManagementUI";
import { useCompanyToast } from "@/modules/cms/hooks/useCompanyToast";
import { selectActiveCompany, useCompanyManagementStore } from "@/modules/cms/store";
import { useCompanyManagementActions } from "@/modules/cms/hooks/useCompanyManagement";

export default function PositionsAndJobLevels() {
  const positions = useCompanyManagementStore((state) => selectActiveCompany(state).positions);
  const departments = useCompanyManagementStore((state) => selectActiveCompany(state).departments);
  const jobLevels = useCompanyManagementStore((state) => selectActiveCompany(state).jobLevels);
  const { createPosition } = useCompanyManagementActions();
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState(departments[0]?.name ?? "");
  const [level, setLevel] = useState(jobLevels[0] ?? "");
  const [reportsTo, setReportsTo] = useState("");
  const { message, showToast } = useCompanyToast();
  const visiblePositions = useMemo(() => positions.filter((position) => `${position.title} ${position.department} ${position.level} ${position.reportsTo} ${position.status}`.toLowerCase().includes(query.toLowerCase())), [positions, query]);

  function handlePositionSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    createPosition({ title: title.trim(), department, level, reportsTo: reportsTo.trim() || "Department lead", status: "Open" });
    showToast(`${title.trim()} position created as open.`);
    setTitle(""); setReportsTo(""); setShowForm(false);
  }

  return <>
    <PageActions title="Positions & job levels" description="Review approved roles and make the career level framework clear." actionLabel={showForm ? "Close form" : "Add position"} onAction={() => setShowForm((open) => !open)} />
    {message && <p className="cms-toast" role="status">{message}</p>}
    {showForm && <SectionCard title="New position" description="Create an open position in a department."><form onSubmit={handlePositionSubmit} className="cms-field-grid"><Field label="Position title" value={title} required onChange={setTitle} /><SelectField label="Department" value={department} options={departments.map((item) => item.name)} onChange={setDepartment} /><SelectField label="Job level" value={level} options={jobLevels} onChange={setLevel} /><Field label="Reports to" value={reportsTo} onChange={setReportsTo} hint="Leave blank to assign to the department lead." /><div className="cms-form-actions"><button className="cms-button cms-button--primary" type="submit">Create position</button></div></form></SectionCard>}
    <SectionCard title="Position register" description="Each row represents an approved role, whether filled or open.">
      <div className="cms-toolbar"><SearchField value={query} onChange={setQuery} placeholder="Search positions" /><span className="cms-metric__detail">{visiblePositions.length} positions</span></div>
      <div className="cms-table-wrap"><table className="cms-table"><thead><tr><th>Position</th><th>Department</th><th>Job level</th><th>Reports to</th><th>Status</th></tr></thead><tbody>{visiblePositions.map((position) => <tr key={position.id}><td><span className="cms-table__primary">{position.title}</span><span className="cms-table__secondary">{position.id}</span></td><td>{position.department}</td><td>{position.level}</td><td>{position.reportsTo}</td><td><StatusBadge>{position.status}</StatusBadge></td></tr>)}{visiblePositions.length === 0 && <tr><td colSpan={5}>No positions match this search.</td></tr>}</tbody></table></div>
    </SectionCard>
    <section className="cms-level-framework" aria-labelledby="cms-level-framework-title">
      <h2 id="cms-level-framework-title">Job levels</h2>
      <p>Career levels run from entry roles through executive leadership.</p>
      <ol className="cms-levels">{jobLevels.map((item) => { const [code, ...label] = item.split(" · "); return <li className="cms-level" key={item}><strong>{code}</strong><span>{label.join(" · ")}</span></li>; })}</ol>
    </section>
  </>;
}
