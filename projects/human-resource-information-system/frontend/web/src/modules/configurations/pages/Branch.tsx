import { OrganizationRecordsTable } from "@/modules/configurations/components/OrganizationRecordsTable";
import { selectActiveCompany, useCompanyManagementStore } from "@/modules/cms/store";

export default function Branch() {
  const workspace = useCompanyManagementStore((state) => selectActiveCompany(state));
  return <OrganizationRecordsTable title="Branch" description="Branches and work locations for the selected company." companyName={workspace.company.displayName} columns={["Branch", "Address", "Manager", "Cost center", "Status"]} rows={workspace.locations.map((item) => ({ id: item.id, values: [item.name, item.address, item.manager, item.costCenterId, item.status] }))} />;
}
