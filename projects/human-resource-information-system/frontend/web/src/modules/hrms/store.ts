import { create } from "zustand";

export type EmployeeStatus = "Active" | "On leave" | "Probation";
export type EmployeeRecord = {
  id: string;
  name: string;
  title: string;
  department: string;
  location: string;
  status: EmployeeStatus;
  startDate: string;
  manager: string;
  workEmail: string;
  employmentType: "Full-time" | "Part-time" | "Fixed-term";
  workPhone: string;
};

export type EmploymentEvent = {
  id: string;
  employeeId: string;
  date: string;
  type: "Hire" | "Promotion" | "Transfer" | "Status change";
  title: string;
  detail: string;
  recordedBy: string;
};

export type ContractRecord = {
  id: string;
  employeeId: string;
  type: string;
  effectiveDate: string;
  endDate: string;
  reviewDate: string;
  status: "Current" | "Review due" | "Ended";
};

export type DuplicatePerson = {
  name: string;
  recordId: string;
  email: string;
  department: string;
  startDate: string;
};

export type DuplicateCase = {
  id: string;
  left: DuplicatePerson;
  right: DuplicatePerson;
  reasons: string[];
  status: "Needs review" | "Marked distinct" | "Confirmed duplicate";
};

type HRMSState = {
  employees: EmployeeRecord[];
  events: EmploymentEvent[];
  contracts: ContractRecord[];
  duplicateCases: DuplicateCase[];
  selectedEmployeeId: string;
  setSelectedEmployeeId: (id: string) => void;
  addEmployee: (employee: EmployeeRecord) => void;
  addContract: (contract: ContractRecord) => void;
  updateDuplicateCase: (id: string, status: DuplicateCase["status"]) => void;
};

export const useHRMSStore = create<HRMSState>((set) => ({
  employees: [
    { id: "EMP-1042", name: "Avery Johnson", title: "Senior Engineer", department: "Engineering", location: "Austin", status: "Active", startDate: "2024-03-12", manager: "Alex Morgan", workEmail: "avery.johnson@hersvin.example", employmentType: "Full-time", workPhone: "+1 (555) 014-2208" },
    { id: "EMP-1043", name: "Morgan Patel", title: "Product Designer", department: "Product", location: "San Francisco", status: "Active", startDate: "2023-06-03", manager: "Jordan Lee", workEmail: "morgan.patel@hersvin.example", employmentType: "Full-time", workPhone: "+1 (555) 014-2216" },
    { id: "EMP-1044", name: "Riley Chen", title: "People Operations Coordinator", department: "People & Culture", location: "Remote · US", status: "Active", startDate: "2025-05-19", manager: "Jordan Lee", workEmail: "riley.chen@hersvin.example", employmentType: "Full-time", workPhone: "+1 (555) 014-2231" },
    { id: "EMP-1045", name: "Jamie Alvarez", title: "Customer Success Lead", department: "Customer Success", location: "Austin", status: "On leave", startDate: "2022-11-07", manager: "Sam Rivera", workEmail: "jamie.alvarez@hersvin.example", employmentType: "Full-time", workPhone: "+1 (555) 014-2282" },
    { id: "EMP-1046", name: "Taylor Brooks", title: "Software Engineer", department: "Engineering", location: "Remote · US", status: "Probation", startDate: "2025-10-20", manager: "Alex Morgan", workEmail: "taylor.brooks@hersvin.example", employmentType: "Fixed-term", workPhone: "+1 (555) 014-2294" },
  ],
  events: [
    { id: "EV-01", employeeId: "EMP-1042", date: "2025-01-08", type: "Promotion", title: "Promoted to Senior Engineer", detail: "Engineering · Austin", recordedBy: "Jordan Lee" },
    { id: "EV-02", employeeId: "EMP-1042", date: "2024-03-12", type: "Hire", title: "Joined as Software Engineer", detail: "Engineering · Austin", recordedBy: "Jordan Lee" },
    { id: "EV-03", employeeId: "EMP-1043", date: "2024-08-05", type: "Transfer", title: "Transferred to Product", detail: "Design team alignment", recordedBy: "Jordan Lee" },
    { id: "EV-04", employeeId: "EMP-1043", date: "2023-06-03", type: "Hire", title: "Joined as Product Designer", detail: "Product · San Francisco", recordedBy: "Jordan Lee" },
    { id: "EV-05", employeeId: "EMP-1045", date: "2025-02-10", type: "Status change", title: "Started approved leave", detail: "People team record", recordedBy: "Riley Chen" },
    { id: "EV-06", employeeId: "EMP-1045", date: "2022-11-07", type: "Hire", title: "Joined as Customer Success Associate", detail: "Customer Success · Austin", recordedBy: "Jordan Lee" },
  ],
  contracts: [
    { id: "CTR-208", employeeId: "EMP-1042", type: "Employment agreement", effectiveDate: "2024-03-12", endDate: "Ongoing", reviewDate: "2026-03-12", status: "Current" },
    { id: "CTR-193", employeeId: "EMP-1043", type: "Employment agreement", effectiveDate: "2023-06-03", endDate: "Ongoing", reviewDate: "2026-01-15", status: "Review due" },
    { id: "CTR-226", employeeId: "EMP-1044", type: "Employment agreement", effectiveDate: "2025-05-19", endDate: "Ongoing", reviewDate: "2026-05-19", status: "Current" },
    { id: "CTR-231", employeeId: "EMP-1046", type: "Fixed-term agreement", effectiveDate: "2025-10-20", endDate: "2026-10-19", reviewDate: "2026-08-20", status: "Current" },
  ],
  duplicateCases: [
    { id: "DUP-017", left: { name: "Avery Johnson", recordId: "EMP-1042", email: "avery.johnson@hersvin.example", department: "Engineering", startDate: "2024-03-12" }, right: { name: "Avery J. Johnson", recordId: "IMP-882", email: "avery.johnson@hersvin.example", department: "Engineering", startDate: "2024-03-12" }, reasons: ["Work email matches", "Name and start date are similar"], status: "Needs review" },
    { id: "DUP-021", left: { name: "Taylor Brooks", recordId: "EMP-1046", email: "taylor.brooks@hersvin.example", department: "Engineering", startDate: "2025-10-20" }, right: { name: "T. Brooks", recordId: "IMP-914", email: "tbrooks@hersvin.example", department: "Engineering", startDate: "2025-10-20" }, reasons: ["Start date matches", "Name is similar"], status: "Needs review" },
  ],
  selectedEmployeeId: "EMP-1042",
  setSelectedEmployeeId: (id) => set({ selectedEmployeeId: id }),
  addEmployee: (employee) => set((state) => ({ employees: [employee, ...state.employees] })),
  addContract: (contract) => set((state) => ({ contracts: [contract, ...state.contracts] })),
  updateDuplicateCase: (id, status) => set((state) => ({ duplicateCases: state.duplicateCases.map((item) => item.id === id ? { ...item, status } : item) })),
}));
