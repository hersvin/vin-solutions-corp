import { useHRMSStore } from "@/modules/hrms/store";
import type { ContractRecord, EmployeeRecord } from "@/modules/hrms/store";

export function useHRMSActions() {
  const addEmployee = useHRMSStore((state) => state.addEmployee);
  const addContract = useHRMSStore((state) => state.addContract);
  return {
    createEmployee: (employee: Omit<EmployeeRecord, "id">) => {
      const nextId = `EMP-${Math.max(1040, ...useHRMSStore.getState().employees.map((item) => Number(item.id.replace("EMP-", "")))) + 1}`;
      const record = { ...employee, id: nextId };
      addEmployee(record);
      return record;
    },
    createContract: (contract: Omit<ContractRecord, "id">) => {
      const record = { ...contract, id: `CTR-${crypto.randomUUID().slice(0, 8).toUpperCase()}` };
      addContract(record);
      return record;
    },
  };
}
