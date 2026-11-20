export type ReportCategory = "Human Resources" | "Timekeeping" | "Payroll" | "Government" | "Bank Export";
export type ReportDefinition = { name: string; description: string };
export const REPORT_CATALOG: Record<ReportCategory, ReportDefinition[]> = {
  "Human Resources": [
    { name: "Employee Master List", description: "Employee IDs, positions, departments, and employment status." },
    { name: "Headcount by Company and Branch", description: "Active headcount grouped by company, branch, and department." },
    { name: "Employee Demographics", description: "Workforce demographic summary for the selected period." },
    { name: "Employment Status", description: "Active, probationary, on-leave, and separated employee counts." },
    { name: "New Hires and Separations", description: "Employee lifecycle changes within the selected date range." },
    { name: "Employee Tenure", description: "Service length grouped by tenure bands and department." },
    { name: "Position and Designation Listing", description: "Position assignments and designation occupancy." },
  ],
  Timekeeping: [
    { name: "Attendance Summary", description: "Present, absent, late, and incomplete records by employee." },
    { name: "Employee Time Record", description: "Daily schedules, punches, breaks, and total hours." },
    { name: "Late and Undertime", description: "Late arrivals and undertime totals for the selected period." },
    { name: "Absence Report", description: "Unexcused and leave-related absences by employee." },
    { name: "Overtime Detail", description: "Approved overtime dates, hours, and compensation type." },
    { name: "Missing Logs and Exceptions", description: "Unresolved punch gaps and attendance exceptions." },
    { name: "Leave Usage", description: "Leave days used by employee and leave type." },
    { name: "Schedule Adherence", description: "Scheduled shifts compared with recorded work time." },
  ],
  Payroll: [
    { name: "Payroll Register", description: "Employee earnings, deductions, and net pay." },
    { name: "Payroll Summary", description: "Payroll totals grouped by company, department, and pay period." },
    { name: "Earnings and Deductions", description: "Payroll component totals by employee and component." },
    { name: "Net Pay Listing", description: "Net payroll amounts prepared for disbursement." },
    { name: "Loan Balances and Repayments", description: "Outstanding balances and payroll loan repayments." },
    { name: "13th Month Report", description: "Year-to-date eligible base pay and estimated 13th month amounts." },
    { name: "Final Pay Summary", description: "Final settlement components and review status." },
    { name: "Service Charge Allocation", description: "Service charge pool and employee allocation preview." },
    { name: "Disbursement Reconciliation", description: "Payment batch totals, accepted payments, and returns." },
  ],
  Government: [
    { name: "SSS Contribution Listing", description: "Employee and employer SSS contribution summary." },
    { name: "PhilHealth Contribution Listing", description: "Employee and employer PhilHealth contribution summary." },
    { name: "Pag-IBIG Contribution Listing", description: "Employee and employer Pag-IBIG contribution summary." },
    { name: "Withholding Tax Summary", description: "Taxable compensation and withholding totals." },
    { name: "Government Loan Deductions", description: "SSS and Pag-IBIG loan deductions by employee." },
  ],
  "Bank Export": [
    { name: "Payroll Bank File", description: "Validated employee payment instructions for the selected bank." },
    { name: "Employee Payment Listing", description: "Employee bank, account suffix, and net amount summary." },
    { name: "Rejected or Returned Payments", description: "Failed payments requiring account or payroll follow-up." },
    { name: "Disbursement Reconciliation", description: "Compare initiated bank payments with acknowledgements." },
  ],
};

export type ReportSnapshot = {
  reportName: string;
  category: ReportCategory;
  company: string;
  period: string;
  generatedAt: string;
  columns: string[];
  rows: string[][];
};

export function createReportSnapshot(category: ReportCategory, reportName: string, company: string, period: string): ReportSnapshot {
  const columnsByCategory: Record<ReportCategory, string[]> = {
    "Human Resources": ["Employee ID", "Employee", "Department", "Employment status"],
    Timekeeping: ["Employee", "Work date", "Scheduled", "Recorded", "Result"],
    Payroll: ["Employee ID", "Employee", "Gross pay", "Deductions", "Net pay"],
    Government: ["Employee ID", "Employee", "Contribution base", "Employee share", "Employer share"],
    "Bank Export": ["Employee", "Bank", "Net payment", "Payment status"],
  };
  const rowsByCategory: Record<ReportCategory, string[][]> = {
    "Human Resources": [["EMP-0248", "Vin Santos", "Human Resources", "Active"], ["EMP-0182", "Ana Reyes", "Finance", "Active"], ["EMP-0306", "Bea Navarro", "Human Resources", "Probationary"]],
    Timekeeping: [["Vin Santos", "Nov 20, 2026", "8:00 AM–5:00 PM", "8:04 AM–5:02 PM", "Present"], ["Ana Reyes", "Nov 19, 2026", "8:00 AM–5:00 PM", "8:19 AM–5:11 PM", "Late"], ["Luis Cruz", "Nov 18, 2026", "8:00 AM–5:00 PM", "No punches", "Needs review"]],
    Payroll: [["EMP-0248", "Vin Santos", "₱21,360.00", "₱2,370.00", "₱18,990.00"], ["EMP-0182", "Ana Reyes", "₱20,500.00", "₱2,190.00", "₱18,310.00"], ["EMP-0139", "Luis Cruz", "₱19,800.00", "₱2,400.00", "₱17,400.00"]],
    Government: [["EMP-0248", "Vin Santos", "₱18,000.00", "₱900.00", "₱900.00"], ["EMP-0182", "Ana Reyes", "₱21,000.00", "₱1,050.00", "₱1,050.00"], ["EMP-0139", "Luis Cruz", "₱19,000.00", "₱950.00", "₱950.00"]],
    "Bank Export": [["Vin Santos", "BDO · ••4821", "₱18,990.00", "Accepted"], ["Ana Reyes", "BPI · ••0182", "₱18,310.00", "Accepted"], ["Luis Cruz", "BDO · ••0139", "₱17,400.00", "Returned · review"]],
  };
  return { reportName, category, company, period, generatedAt: new Date().toLocaleString(), columns: columnsByCategory[category], rows: rowsByCategory[category] };
}
