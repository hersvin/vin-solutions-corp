import type { Department } from "@/modules/cms/store";

type DepartmentTreeNodeProps = {
  department: Department;
  departments: Department[];
};

export function DepartmentTreeNode({ department, departments }: DepartmentTreeNodeProps) {
  const children = departments.filter((item) => item.parent === department.name);

  return (
    <li className="cms-tree-node">
      <article className="cms-org-node">
        <strong>{department.name}</strong>
        <small>{department.head} · {department.employees} employees</small>
      </article>
      {children.length > 0 && (
        <ul className="cms-org-tree__children">
          {children.map((child) => <DepartmentTreeNode key={child.id} department={child} departments={departments} />)}
        </ul>
      )}
    </li>
  );
}
