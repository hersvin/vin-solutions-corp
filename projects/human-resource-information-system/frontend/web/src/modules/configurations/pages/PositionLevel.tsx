import { OrganizationRecordsTable } from "@/modules/configurations/components/OrganizationRecordsTable";
import { selectActiveCompany, useCompanyManagementStore } from "@/modules/cms/store";

export default function PositionLevel() {
  const workspace = useCompanyManagementStore((state) => selectActiveCompany(state));
  const rows = workspace.jobLevels.map((level) => ({
    id: level,
    values: [level, String(workspace.positions.filter((position) => position.level === level).length)],
  }));
  return <OrganizationRecordsTable title="Position Level" description="Position levels used by the selected company." companyName={workspace.company.displayName} columns={["Position level", "Positions using level"]} rows={rows} />;
}
