import { OrganizationRecordsTable } from "@/modules/configurations/components/OrganizationRecordsTable";
import { selectActiveCompany, useCompanyManagementStore } from "@/modules/cms/store";

export default function Department() {
  const workspace = useCompanyManagementStore((state) => selectActiveCompany(state));
  return <OrganizationRecordsTable title="Department" description="Departments and reporting owners for the selected company." companyName={workspace.company.displayName} columns={["Department", "Head", "Parent", "Employees", "Status"]} rows={workspace.departments.map((item) => ({ id: item.id, values: [item.name, item.head, item.parent, String(item.employees), item.status] }))} />;
}
