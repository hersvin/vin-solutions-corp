import { OrganizationRecordsTable } from "@/modules/configurations/components/OrganizationRecordsTable";
import { selectActiveCompany, useCompanyManagementStore } from "@/modules/cms/store";

export default function Designation() {
  const workspace = useCompanyManagementStore((state) => selectActiveCompany(state));
  return <OrganizationRecordsTable title="Designation" description="Designations and their organization assignments for the selected company." companyName={workspace.company.displayName} columns={["Designation", "Department", "Position level", "Status"]} rows={workspace.positions.map((item) => ({ id: item.id, values: [item.title, item.department, item.level, item.status] }))} />;
}
