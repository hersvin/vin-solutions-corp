export type Employee = {
  id: string;
  name: string;
  preferredName: string;
  title: string;
  department: string;
  branch: string;
  status: "Active" | "On leave" | "Separated";
  employmentType: string;
  email: string;
  phone: string;
  birthDate: string;
  address: string;
  emergencyContact: string;
  education: { school: string; degree: string; years: string }[];
  employmentHistory: { company: string; role: string; dates: string }[];
  employmentRecord: { label: string; value: string }[];
  benefits: { name: string; detail: string; status: string }[];
};

export const EMPLOYEES: Employee[] = [
  {
    id: "EMP-0248", name: "Vin Santos", preferredName: "Vin", title: "People Operations Specialist", department: "Human Resources", branch: "Makati Office", status: "Active", employmentType: "Regular", email: "vin.santos@example.test", phone: "+63 917 555 0148", birthDate: "March 14, 1994", address: "Makati City, Metro Manila", emergencyContact: "Mia Santos · +63 917 555 0149",
    education: [{ school: "University of the Philippines", degree: "BS Psychology", years: "2012–2016" }, { school: "Ateneo Center for Continuing Education", degree: "Human Resource Management Program", years: "2020" }],
    employmentHistory: [{ company: "Hersvin", role: "People Operations Specialist", dates: "2022–Present" }, { company: "Northstar Services", role: "HR Associate", dates: "2018–2022" }],
    employmentRecord: [{ label: "Date hired", value: "June 6, 2022" }, { label: "Employee number", value: "EMP-0248" }, { label: "Work location", value: "Makati Office · Hybrid" }, { label: "Manager", value: "Mara Villanueva" }, { label: "Position level", value: "Specialist II" }, { label: "Employment status", value: "Active · Regular" }],
    benefits: [{ name: "Health plan", detail: "Medical and dental · Member ending 4821", status: "Enrolled" }, { name: "Life insurance", detail: "Group coverage · 2× annual base pay", status: "Enrolled" }, { name: "Retirement plan", detail: "Employer contribution · 5%", status: "Enrolled" }],
  },
  {
    id: "EMP-0182", name: "Ana Reyes", preferredName: "Ana", title: "Payroll Analyst", department: "Finance", branch: "Makati Office", status: "Active", employmentType: "Regular", email: "ana.reyes@example.test", phone: "+63 917 555 0182", birthDate: "July 22, 1991", address: "Pasig City, Metro Manila", emergencyContact: "Marco Reyes · +63 917 555 0183",
    education: [{ school: "Polytechnic University of the Philippines", degree: "BS Accountancy", years: "2009–2013" }],
    employmentHistory: [{ company: "Hersvin", role: "Payroll Analyst", dates: "2021–Present" }, { company: "Cedar Retail Group", role: "Accounting Assistant", dates: "2014–2021" }],
    employmentRecord: [{ label: "Date hired", value: "February 15, 2021" }, { label: "Employee number", value: "EMP-0182" }, { label: "Work location", value: "Makati Office" }, { label: "Manager", value: "Joel Ramirez" }, { label: "Position level", value: "Analyst II" }, { label: "Employment status", value: "Active · Regular" }],
    benefits: [{ name: "Health plan", detail: "Medical and dental · Family tier", status: "Enrolled" }, { name: "Life insurance", detail: "Group coverage · 2× annual base pay", status: "Enrolled" }, { name: "Retirement plan", detail: "Employer contribution · 5%", status: "Enrolled" }],
  },
  {
    id: "EMP-0139", name: "Luis Cruz", preferredName: "Luis", title: "Operations Coordinator", department: "Operations", branch: "Cebu Office", status: "On leave", employmentType: "Regular", email: "luis.cruz@example.test", phone: "+63 917 555 0139", birthDate: "January 8, 1989", address: "Cebu City, Cebu", emergencyContact: "Elena Cruz · +63 917 555 0140",
    education: [{ school: "University of San Carlos", degree: "BS Business Administration", years: "2006–2010" }],
    employmentHistory: [{ company: "Hersvin", role: "Operations Coordinator", dates: "2019–Present" }, { company: "Visayan Logistics", role: "Operations Assistant", dates: "2011–2019" }],
    employmentRecord: [{ label: "Date hired", value: "October 7, 2019" }, { label: "Employee number", value: "EMP-0139" }, { label: "Work location", value: "Cebu Office" }, { label: "Manager", value: "Mara Villanueva" }, { label: "Position level", value: "Coordinator I" }, { label: "Employment status", value: "On leave · Regular" }],
    benefits: [{ name: "Health plan", detail: "Medical and dental · Member ending 9034", status: "Enrolled" }, { name: "Life insurance", detail: "Group coverage · 2× annual base pay", status: "Enrolled" }, { name: "Retirement plan", detail: "Employer contribution · 5%", status: "Enrolled" }],
  },
  {
    id: "EMP-0306", name: "Bea Navarro", preferredName: "Bea", title: "Talent Acquisition Partner", department: "Human Resources", branch: "Makati Office", status: "Active", employmentType: "Probationary", email: "bea.navarro@example.test", phone: "+63 917 555 0306", birthDate: "October 2, 1996", address: "Quezon City, Metro Manila", emergencyContact: "Rico Navarro · +63 917 555 0307",
    education: [{ school: "De La Salle University", degree: "BA Communication Arts", years: "2014–2018" }],
    employmentHistory: [{ company: "Hersvin", role: "Talent Acquisition Partner", dates: "2026–Present" }, { company: "Brightpath Talent", role: "Recruitment Associate", dates: "2019–2025" }],
    employmentRecord: [{ label: "Date hired", value: "August 3, 2026" }, { label: "Employee number", value: "EMP-0306" }, { label: "Work location", value: "Makati Office · Hybrid" }, { label: "Manager", value: "Mara Villanueva" }, { label: "Position level", value: "Partner I" }, { label: "Employment status", value: "Active · Probationary" }],
    benefits: [{ name: "Health plan", detail: "Medical and dental · Individual tier", status: "Enrolled" }, { name: "Life insurance", detail: "Group coverage · 1× annual base pay", status: "Enrolled" }, { name: "Retirement plan", detail: "Available after regularization", status: "Pending" }],
  },
];

export const employeeAvatar = (employee: Pick<Employee, "id" | "name">) => `https://api.dicebear.com/10.x/lorelei/svg?seed=${encodeURIComponent(employee.id + employee.name)}`;
