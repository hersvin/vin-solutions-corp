import { create } from "zustand";

export type Department = { id: string; name: string; head: string; parent: string; employees: number; status: "Active" | "Draft" };
export type CompanyLocation = { id: string; name: string; address: string; manager: string; costCenterId: string; status: "Active" | "Inactive" };
export type CostCenter = { id: string; code: string; name: string; owner: string; status: "Active" | "Inactive" };
export type CompanyPosition = { id: string; title: string; department: string; level: string; reportsTo: string; status: "Filled" | "Open" };
export type OrganizationUnit = { id: string; name: string; head: string; status: "Active" | "Draft" };
export type CompanyProfile = { legalName: string; displayName: string; registrationNumber: string; taxId: string; industry: string; email: string; phone: string; website: string; defaultCurrency: string; timezone: string };

export type CompanyWorkspace = {
  id: string;
  company: CompanyProfile;
  departments: Department[];
  divisions: OrganizationUnit[];
  sections: OrganizationUnit[];
  locations: CompanyLocation[];
  costCenters: CostCenter[];
  positions: CompanyPosition[];
  jobLevels: string[];
};

export type CompanyManagementState = {
  companies: CompanyWorkspace[];
  activeCompanyId: string;
  setActiveCompany: (companyId: string) => void;
  addCompany: (company: CompanyProfile) => string;
  setCompanyField: <K extends keyof CompanyProfile>(field: K, value: CompanyProfile[K]) => void;
  addDepartment: (department: Department) => void;
  addLocation: (location: CompanyLocation) => void;
  addCostCenter: (center: CostCenter) => void;
  addPosition: (position: CompanyPosition) => void;
};

const northAmerica: CompanyWorkspace = {
  id: "hersvin-north-america",
  company: {
    legalName: "Hersvin Technologies, Inc.", displayName: "Hersvin Technologies", registrationNumber: "SEC-2024-01842", taxId: "TIN-••••-4821",
    industry: "Technology & Services", email: "people@hersvin.example", phone: "+1 (555) 018-2040", website: "https://hersvin.example", defaultCurrency: "USD", timezone: "America/Los_Angeles",
  },
  departments: [
    { id: "dept-executive", name: "Executive", head: "Maya Chen", parent: "Company", employees: 4, status: "Active" },
    { id: "dept-people", name: "People & Culture", head: "Jordan Lee", parent: "Executive", employees: 12, status: "Active" },
    { id: "dept-engineering", name: "Engineering", head: "Alex Morgan", parent: "Executive", employees: 38, status: "Active" },
    { id: "dept-finance", name: "Finance", head: "Taylor Reed", parent: "Executive", employees: 8, status: "Active" },
    { id: "dept-customer", name: "Customer Success", head: "Sam Rivera", parent: "Executive", employees: 21, status: "Active" },
  ],
  divisions: [
    { id: "division-people", name: "People & Culture", head: "Jordan Lee", status: "Active" },
    { id: "division-product", name: "Product & Engineering", head: "Alex Morgan", status: "Active" },
    { id: "division-customer", name: "Customer Operations", head: "Sam Rivera", status: "Active" },
  ],
  sections: [
    { id: "section-people-ops", name: "People Operations", head: "Jordan Lee", status: "Active" },
    { id: "section-talent", name: "Talent Acquisition", head: "Morgan Avery", status: "Active" },
    { id: "section-it-support", name: "IT Support", head: "Riley Jordan", status: "Active" },
  ],
  locations: [
    { id: "loc-sf", name: "San Francisco HQ", address: "101 Market Street, San Francisco, CA", manager: "Maya Chen", costCenterId: "CC-100", status: "Active" },
    { id: "loc-austin", name: "Austin Office", address: "220 Congress Ave, Austin, TX", manager: "Alex Morgan", costCenterId: "CC-210", status: "Active" },
    { id: "loc-remote", name: "Remote - United States", address: "Distributed", manager: "Jordan Lee", costCenterId: "CC-100", status: "Active" },
  ],
  costCenters: [
    { id: "CC-100", code: "CC-100", name: "Corporate", owner: "Taylor Reed", status: "Active" },
    { id: "CC-210", code: "CC-210", name: "Product & Engineering", owner: "Alex Morgan", status: "Active" },
    { id: "CC-320", code: "CC-320", name: "Customer Operations", owner: "Sam Rivera", status: "Active" },
  ],
  positions: [
    { id: "pos-001", title: "Chief Executive Officer", department: "Executive", level: "L7 · Executive", reportsTo: "Board of Directors", status: "Filled" },
    { id: "pos-014", title: "People Operations Manager", department: "People & Culture", level: "L5 · Director", reportsTo: "Chief Executive Officer", status: "Filled" },
    { id: "pos-028", title: "Senior Software Engineer", department: "Engineering", level: "L4 · Senior", reportsTo: "Engineering Director", status: "Filled" },
    { id: "pos-035", title: "Product Designer", department: "Product", level: "L3 · Mid-level", reportsTo: "Design Lead", status: "Open" },
    { id: "pos-042", title: "Customer Success Associate", department: "Customer Success", level: "L2 · Associate", reportsTo: "CS Manager", status: "Open" },
  ],
  jobLevels: ["L1 · Entry", "L2 · Associate", "L3 · Mid-level", "L4 · Senior", "L5 · Director", "L6 · VP", "L7 · Executive"],
};

const asiaPacific: CompanyWorkspace = {
  id: "hersvin-asia-pacific",
  company: {
    legalName: "Hersvin Asia Pacific Ltd.", displayName: "Hersvin Asia Pacific", registrationNumber: "", taxId: "",
    industry: "Technology & Services", email: "", phone: "", website: "", defaultCurrency: "PHP", timezone: "Asia/Manila",
  },
  departments: [],
  divisions: [],
  sections: [],
  locations: [],
  costCenters: [],
  positions: [],
  jobLevels: [],
};

export function selectActiveCompany(state: CompanyManagementState): CompanyWorkspace {
  const activeCompany = state.companies.find((company) => company.id === state.activeCompanyId);
  if (!activeCompany) throw new Error("Active company is unavailable.");
  return activeCompany;
}

function updateActiveCompany(
  set: (updater: (state: CompanyManagementState) => Partial<CompanyManagementState>) => void,
  update: (company: CompanyWorkspace) => CompanyWorkspace,
) {
  set((state) => ({
    companies: state.companies.map((company) =>
      company.id === state.activeCompanyId ? update(company) : company,
    ),
  }));
}

export const useCompanyManagementStore = create<CompanyManagementState>((set) => ({
  companies: [northAmerica, asiaPacific],
  activeCompanyId: northAmerica.id,
  setActiveCompany: (companyId) => set((state) =>
    state.companies.some((company) => company.id === companyId)
      ? { activeCompanyId: companyId }
      : state,
  ),
  addCompany: (company) => {
    const id = `company-${crypto.randomUUID()}`;
    set((state) => ({
      companies: [...state.companies, { id, company, departments: [], divisions: [], sections: [], locations: [], costCenters: [], positions: [], jobLevels: [] }],
      activeCompanyId: id,
    }));
    return id;
  },
  setCompanyField: (field, value) => updateActiveCompany(set, (active) => ({
    ...active,
    company: { ...active.company, [field]: value },
  })),
  addDepartment: (department) => updateActiveCompany(set, (active) => ({ ...active, departments: [...active.departments, department] })),
  addLocation: (location) => updateActiveCompany(set, (active) => ({ ...active, locations: [...active.locations, location] })),
  addCostCenter: (center) => updateActiveCompany(set, (active) => ({ ...active, costCenters: [...active.costCenters, center] })),
  addPosition: (position) => updateActiveCompany(set, (active) => ({ ...active, positions: [...active.positions, position] })),
}));
