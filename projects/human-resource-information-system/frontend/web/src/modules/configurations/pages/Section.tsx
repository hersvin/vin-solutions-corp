import { OrganizationRecordsTable } from "@/modules/configurations/components/OrganizationRecordsTable";
import { selectActiveCompany, useCompanyManagementStore } from "@/modules/cms/store";

export default function Section() {
  const workspace = useCompanyManagementStore((state) => selectActiveCompany(state));
  return <OrganizationRecordsTable title="Section" description="Sections and their assigned leads for the selected company." companyName={workspace.company.displayName} columns={["Section", "Section lead", "Status"]} rows={workspace.sections.map((item) => ({ id: item.id, values: [item.name, item.head, item.status] }))} />;
}
