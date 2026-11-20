import { useMemo, useState } from "react";
import { DepartmentTreeNode } from "@/modules/cms/components/DepartmentTreeNode";
import { PageActions, SearchField, SectionCard } from "@/modules/cms/components/CompanyManagementUI";
import { selectActiveCompany, useCompanyManagementStore } from "@/modules/cms/store";

export default function OrganizationChart() {
  const company = useCompanyManagementStore((state) => selectActiveCompany(state).company);
  const departments = useCompanyManagementStore((state) => selectActiveCompany(state).departments);
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"chart" | "list">("chart");

  const visibleDepartments = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return departments;

    const visibleIds = new Set(departments
      .filter((department) => `${department.name} ${department.head} ${department.parent}`.toLowerCase().includes(normalizedQuery))
      .map((department) => department.id));

    let addedParent = true;
    while (addedParent) {
      addedParent = false;
      for (const department of departments) {
        if (!visibleIds.has(department.id)) continue;
        const parent = departments.find((item) => item.name === department.parent);
        if (parent && !visibleIds.has(parent.id)) {
          visibleIds.add(parent.id);
          addedParent = true;
        }
      }
    }
    return departments.filter((department) => visibleIds.has(department.id));
  }, [departments, query]);

  const rootDepartments = visibleDepartments.filter((department) =>
    department.parent === "Company" || department.parent === company.displayName,
  );

  return <>
    <PageActions title="Organization chart" description="Follow each department’s reporting line, or switch to the table for a direct list." />
    <SectionCard title="Company hierarchy" description="Search a department or lead. Matching teams stay connected to their parent departments." action={<div className="cms-chart-toolbar" role="group" aria-label="Organization chart view"><button className={`cms-button${view === "chart" ? " cms-button--primary" : ""}`} type="button" aria-pressed={view === "chart"} onClick={() => setView("chart")}>Chart</button><button className={`cms-button${view === "list" ? " cms-button--primary" : ""}`} type="button" aria-pressed={view === "list"} onClick={() => setView("list")}>List</button></div>}>
      <div className="cms-toolbar"><SearchField value={query} onChange={setQuery} placeholder="Search department or lead" /><span className="cms-metric__detail">{visibleDepartments.length} departments</span></div>
      {view === "chart" ? <div className="cms-chart" role="region" aria-label="Organization hierarchy chart" tabIndex={0}>
        <article className="cms-org-node cms-org-node--root"><strong>{company.displayName}</strong><small>{company.legalName}</small></article>
        {rootDepartments.length > 0
          ? <ul className="cms-org-tree">{rootDepartments.map((department) => <DepartmentTreeNode key={department.id} department={department} departments={visibleDepartments} />)}</ul>
          : <p className="cms-inline-note">No departments match this search.</p>}
      </div> : <div className="cms-table-wrap"><table className="cms-table"><caption className="sr-only">Company departments and reporting relationships</caption><thead><tr><th>Department</th><th>Lead</th><th>Reports to</th><th>Team size</th></tr></thead><tbody>{visibleDepartments.map((department) => <tr key={department.id}><td className="cms-table__primary">{department.name}</td><td>{department.head}</td><td>{department.parent}</td><td>{department.employees} employees</td></tr>)}{visibleDepartments.length === 0 && <tr><td colSpan={4}>No departments match this search.</td></tr>}</tbody></table></div>}
    </SectionCard>
  </>;
}
