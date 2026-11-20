import { OrganizationRecordsTable } from "@/modules/configurations/components/OrganizationRecordsTable";
import { selectActiveCompany, useCompanyManagementStore } from "@/modules/cms/store";

export default function Division() {
  const workspace = useCompanyManagementStore((state) => selectActiveCompany(state));
  return <OrganizationRecordsTable title="Division" description="Major operating divisions for the selected company." companyName={workspace.company.displayName} columns={["Division", "Division head", "Status"]} rows={workspace.divisions.map((item) => ({ id: item.id, values: [item.name, item.head, item.status] }))} />;
}
