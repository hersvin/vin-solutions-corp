import { useMemo, useState, type FormEvent } from "react";
import { Field, PageActions, SearchField, SectionCard, StatusBadge } from "@/modules/cms/components/CompanyManagementUI";
import { useCompanyToast } from "@/modules/cms/hooks/useCompanyToast";
import { selectActiveCompany, useCompanyManagementStore } from "@/modules/cms/store";
import { useCompanyManagementActions } from "@/modules/cms/hooks/useCompanyManagement";

export default function OrganizationStructure() {
  const departments = useCompanyManagementStore((state) => selectActiveCompany(state).departments);
  const { createDepartment } = useCompanyManagementActions();
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState("dept-executive");
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [head, setHead] = useState("");
  const [parent, setParent] = useState("Executive");
  const { message, showToast } = useCompanyToast();
  const filteredDepartments = useMemo(() => departments.filter((department) => `${department.name} ${department.head}`.toLowerCase().includes(query.toLowerCase())), [departments, query]);
  const selected = departments.find((department) => department.id === selectedId) ?? filteredDepartments[0];

  function handleDepartmentSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const department = createDepartment({ name: name.trim(), head: head.trim(), parent, employees: 0, status: "Draft" });
    setSelectedId(department.id);
    setName(""); setHead(""); setShowForm(false);
    showToast(`${department.name} added to the organization.`);
  }

  return <>
    <PageActions title="Organization structure" description="Browse departments, see their reporting lines, and maintain ownership." actionLabel={showForm ? "Close form" : "Add department"} onAction={() => setShowForm((open) => !open)} />
    {message && <p className="cms-toast" role="status">{message}</p>}
    {showForm && <SectionCard title="New department" description="Add a department and assign its lead and parent team."><form onSubmit={handleDepartmentSubmit} className="cms-field-grid"><Field label="Department name" value={name} required onChange={setName} /><Field label="Department lead" value={head} required onChange={setHead} /><label className="cms-field"><span>Reports to</span><select value={parent} onChange={(event) => setParent(event.target.value)}>{departments.map((department) => <option key={department.id}>{department.name}</option>)}</select></label><div className="cms-form-actions"><button className="cms-button cms-button--primary" type="submit">Create department</button></div></form></SectionCard>}
    <div className="cms-structure">
      <SectionCard title="Departments" description={`${departments.length} departments in this company`}>
        <div className="cms-toolbar"><SearchField value={query} onChange={setQuery} placeholder="Search departments" /></div>
        <div className="cms-department-list" role="list" aria-label="Departments">
          {filteredDepartments.map((department) => <button className="cms-department-button" type="button" key={department.id} aria-pressed={selected?.id === department.id} onClick={() => setSelectedId(department.id)}><span><strong>{department.name}</strong><small>{department.head} · {department.employees} employees</small></span><StatusBadge>{department.status}</StatusBadge></button>)}
          {filteredDepartments.length === 0 && <p className="cms-inline-note">No departments match this search.</p>}
        </div>
      </SectionCard>
      <SectionCard title={selected?.name ?? "Department details"} description="Department ownership and reporting context">
        {selected ? <><dl className="cms-detail-list"><div><dt>Department lead</dt><dd>{selected.head}</dd></div><div><dt>Reports to</dt><dd>{selected.parent}</dd></div><div><dt>Team size</dt><dd>{selected.employees} employees</dd></div><div><dt>Status</dt><dd><StatusBadge>{selected.status}</StatusBadge></dd></div></dl><p className="cms-inline-note">Reporting relationships are shown as text as well as in the organization chart.</p></> : <p>Select a department to view its details.</p>}
      </SectionCard>
    </div>
  </>;
}
