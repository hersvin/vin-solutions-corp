import { useCompanyManagementStore } from "@/modules/cms/store";
import type { CompanyLocation, CompanyPosition, CostCenter, Department } from "@/modules/cms/store";

export function useCompanyManagementActions() {
  const setCompanyField = useCompanyManagementStore((state) => state.setCompanyField);
  const addDepartment = useCompanyManagementStore((state) => state.addDepartment);
  const addLocation = useCompanyManagementStore((state) => state.addLocation);
  const addPosition = useCompanyManagementStore((state) => state.addPosition);
  const addCostCenter = useCompanyManagementStore((state) => state.addCostCenter);

  return {
    updateCompanyField: setCompanyField,
    createDepartment: (department: Omit<Department, "id">) => {
      const record = { ...department, id: `dept-${crypto.randomUUID()}` };
      addDepartment(record);
      return record;
    },
    createLocation: (location: Omit<CompanyLocation, "id">) => {
      const record = { ...location, id: `loc-${crypto.randomUUID()}` };
      addLocation(record);
      return record;
    },
    createPosition: (position: Omit<CompanyPosition, "id">) => {
      const record = { ...position, id: `pos-${crypto.randomUUID()}` };
      addPosition(record);
      return record;
    },
    createCostCenter: (center: Omit<CostCenter, "id">) => {
      const record = { ...center, id: center.code };
      addCostCenter(record);
      return record;
    },
  };
}
