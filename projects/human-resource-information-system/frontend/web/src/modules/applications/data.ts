export type ApplicationId = "ChangeOfSchedule" | "Leave" | "OfficialBusiness" | "MissedLog" | "Overtime" | "Offset" | "CompensatoryTimeOff";
export type ApplicationQueue = "My Requests" | "For Review" | "For Approve" | "Filings";
export type ApplicationStatus = "Pending Review" | "Reviewed" | "Pending Approval" | "Approved" | "Filed" | "Cancelled";

export type ApplicationRecord = {
  documentNo: string;
  transactionDate: string;
  employee: string;
  employeeId: string;
  status: ApplicationStatus;
  attachment: string;
  fields: Record<string, string>;
  reason: string;
  employeeNote: string;
  reviewer: string;
  approver: string;
  history: { date: string; actor: string; action: string; note: string }[];
};

export type ApplicationConfig = {
  title: string;
  description: string;
  columns: { label: string; key: string }[];
  records: ApplicationRecord[];
};

const applicationCodes: Record<ApplicationId, string> = {
  ChangeOfSchedule: "COS", Leave: "LEV", OfficialBusiness: "OB", MissedLog: "ML",
  Overtime: "OT", Offset: "OFF", CompensatoryTimeOff: "CTO",
};

const record = (
  app: ApplicationId,
  serial: number,
  employee: string,
  employeeId: string,
  status: ApplicationStatus,
  fields: Record<string, string>,
  reason: string,
  attachment: string,
): ApplicationRecord => {
  const documentNo = `APP-${applicationCodes[app]}-2026-${String(serial).padStart(4, "0")}`;
  const isSelf = employeeId === "EMP-0248";
  const reviewed = status === "Pending Approval" || status === "Approved" || status === "Filed";
  const approved = status === "Approved" || status === "Filed";
  const transactionDate = serial === 1 ? "Nov 18, 2026" : serial === 2 ? "Nov 17, 2026" : "Nov 12, 2026";
  const history: ApplicationRecord["history"] = [{ date: transactionDate, actor: employee, action: "Submitted request", note: "Request sent for processing." }];
  if (reviewed) history.push({ date: "Nov 19, 2026", actor: "Mara Villanueva · Reviewer", action: "Reviewed", note: "Details checked and ready for approval." });
  if (approved) history.push({ date: "Nov 20, 2026", actor: "Joel Ramirez · Approver", action: status === "Filed" ? "Filed" : "Approved", note: status === "Filed" ? "Approved request recorded in employee filing." : "Request approved." });
  if (status === "Cancelled") history.push({ date: "Nov 19, 2026", actor: employee, action: "Cancelled", note: "Cancelled by the request owner." });
  return {
    documentNo, transactionDate, employee, employeeId, status, attachment, fields, reason,
    employeeNote: isSelf ? "Please review the submitted information and let me know if anything else is needed." : "Submitted for manager review.",
    reviewer: "Mara Villanueva", approver: "Joel Ramirez", history,
  };
};

export const APPLICATIONS: Record<ApplicationId, ApplicationConfig> = {
  ChangeOfSchedule: {
    title: "Change of Schedule", description: "Review schedule change requests and their processing history.",
    columns: [{ label: "Current schedule", key: "currentSchedule" }, { label: "Requested schedule", key: "requestedSchedule" }, { label: "Effective date", key: "effectiveDate" }],
    records: [
      record("ChangeOfSchedule", 1, "Vin Santos", "EMP-0248", "Pending Review", { currentSchedule: "8:00 AM–5:00 PM", requestedSchedule: "9:00 AM–6:00 PM", effectiveDate: "Dec 1, 2026", workDays: "Monday–Friday", location: "Makati Office", coveragePlan: "No coverage required" }, "Adjust work hours to align with the department's updated client coverage window.", "Schedule-request.pdf"),
      record("ChangeOfSchedule", 2, "Ana Reyes", "EMP-0182", "Pending Approval", { currentSchedule: "7:00 AM–4:00 PM", requestedSchedule: "8:00 AM–5:00 PM", effectiveDate: "Nov 23, 2026", workDays: "Monday–Friday", location: "Makati Office", coveragePlan: "Handoff with team at 8:00 AM" }, "Align work hours with the finance team's shared operating schedule.", "—"),
      record("ChangeOfSchedule", 3, "Luis Cruz", "EMP-0139", "Cancelled", { currentSchedule: "8:00 AM–5:00 PM", requestedSchedule: "10:00 AM–7:00 PM", effectiveDate: "Nov 16, 2026", workDays: "Monday–Friday", location: "Cebu Office", coveragePlan: "Team coverage confirmed" }, "Personal schedule adjustment.", "Schedule-request.pdf"),
    ],
  },
  Leave: {
    title: "Leave", description: "Review leave requests, balances, dates, and supporting documents.",
    columns: [{ label: "Leave type", key: "leaveType" }, { label: "Date range", key: "dateRange" }, { label: "Days", key: "days" }],
    records: [
      record("Leave", 1, "Vin Santos", "EMP-0248", "Pending Review", { leaveType: "Vacation leave", dateRange: "Nov 26–27, 2026", days: "2 days", balance: "8.5 days remaining", contact: "vin.santos@example.test", coverage: "Ana Reyes will monitor urgent requests" }, "Family commitment. Work handover is arranged before leave.", "Leave-supporting-document.pdf"),
      record("Leave", 2, "Ana Reyes", "EMP-0182", "Pending Approval", { leaveType: "Sick leave", dateRange: "Nov 13, 2026", days: "1 day", balance: "6 days remaining", contact: "ana.reyes@example.test", coverage: "Team lead informed" }, "Not feeling well; medical certificate attached.", "Medical-certificate.pdf"),
      record("Leave", 3, "Luis Cruz", "EMP-0139", "Filed", { leaveType: "Vacation leave", dateRange: "Nov 9–10, 2026", days: "2 days", balance: "4 days remaining", contact: "luis.cruz@example.test", coverage: "Tasks handed over to team" }, "Pre-planned personal leave.", "—"),
    ],
  },
  OfficialBusiness: {
    title: "Official Business", description: "Review off-site work requests, destinations, schedules, and purpose.",
    columns: [{ label: "Business date", key: "businessDate" }, { label: "Time", key: "time" }, { label: "Destination", key: "destination" }],
    records: [
      record("OfficialBusiness", 1, "Vin Santos", "EMP-0248", "Pending Review", { businessDate: "Nov 24, 2026", time: "9:00 AM–12:00 PM", destination: "BIR Makati", purpose: "Submit quarterly compliance documents", transport: "Company shuttle", clientContact: "Records counter" }, "Official document submission for the HR department.", "Appointment-confirmation.pdf"),
      record("OfficialBusiness", 2, "Ana Reyes", "EMP-0182", "Pending Approval", { businessDate: "Nov 21, 2026", time: "1:00 PM–4:00 PM", destination: "Client office · BGC", purpose: "Payroll coordination meeting", transport: "Public transport", clientContact: "Paolo Lim" }, "Attend the scheduled payroll coordination meeting.", "Meeting-invitation.pdf"),
      record("OfficialBusiness", 3, "Luis Cruz", "EMP-0139", "Approved", { businessDate: "Nov 11, 2026", time: "10:00 AM–2:00 PM", destination: "Cebu City Hall", purpose: "Submit permit documents", transport: "Company vehicle", clientContact: "Permit office" }, "Deliver and receive official permits.", "—"),
    ],
  },
  MissedLog: {
    title: "Missed Log", description: "Review time entry correction requests and their supporting evidence.",
    columns: [{ label: "Missed date", key: "missedDate" }, { label: "Log type", key: "logType" }, { label: "Requested time", key: "requestedTime" }],
    records: [
      record("MissedLog", 1, "Vin Santos", "EMP-0248", "Pending Review", { missedDate: "Nov 16, 2026", logType: "Clock out", requestedTime: "5:04 PM", workLocation: "Makati Office", shift: "8:00 AM–5:00 PM", device: "Lobby time clock" }, "The time clock did not register my clock-out. I stayed until the end of my shift.", "Manager-confirmation.pdf"),
      record("MissedLog", 2, "Ana Reyes", "EMP-0182", "Reviewed", { missedDate: "Nov 14, 2026", logType: "Clock in", requestedTime: "7:58 AM", workLocation: "Remote", shift: "8:00 AM–5:00 PM", device: "Mobile attendance" }, "Mobile app was offline when I started work.", "Connection-error.png"),
      record("MissedLog", 3, "Luis Cruz", "EMP-0139", "Filed", { missedDate: "Nov 10, 2026", logType: "Clock out", requestedTime: "5:12 PM", workLocation: "Cebu Office", shift: "8:00 AM–5:00 PM", device: "Reception time clock" }, "Clock-out entry was missed during a network outage.", "—"),
    ],
  },
  Overtime: {
    title: "Overtime", description: "Review planned or completed overtime hours and work details.",
    columns: [{ label: "Overtime date", key: "overtimeDate" }, { label: "Time", key: "time" }, { label: "Hours", key: "hours" }],
    records: [
      record("Overtime", 1, "Vin Santos", "EMP-0248", "Pending Review", { overtimeDate: "Nov 21, 2026", time: "5:00 PM–7:00 PM", hours: "2 hours", workLocation: "Makati Office", project: "Year-end audit preparation", mealBreak: "None", requestedCompensation: "Overtime pay" }, "Complete reconciliations before the audit handover.", "Team-lead-endorsement.pdf"),
      record("Overtime", 2, "Ana Reyes", "EMP-0182", "Pending Approval", { overtimeDate: "Nov 14, 2026", time: "5:00 PM–8:00 PM", hours: "3 hours", workLocation: "Makati Office", project: "Payroll close", mealBreak: "30 minutes", requestedCompensation: "CTO" }, "Resolve payroll exceptions before cutoff.", "Payroll-close-plan.xlsx"),
      record("Overtime", 3, "Luis Cruz", "EMP-0139", "Approved", { overtimeDate: "Nov 7, 2026", time: "9:00 AM–1:00 PM", hours: "4 hours", workLocation: "Cebu Office", project: "Inventory migration", mealBreak: "None", requestedCompensation: "Overtime pay" }, "Weekend data migration with project team.", "—"),
    ],
  },
  Offset: {
    title: "Offset", description: "Review requests to use eligible earned hours as offset time.",
    columns: [{ label: "Offset date", key: "offsetDate" }, { label: "Hours", key: "hours" }, { label: "Earned on", key: "earnedOn" }],
    records: [
      record("Offset", 1, "Vin Santos", "EMP-0248", "Pending Review", { offsetDate: "Nov 27, 2026", hours: "2 hours", earnedOn: "Nov 7, 2026", availableBalance: "6 hours", timeFromTo: "3:00 PM–5:00 PM", relatedOvertime: "OT-2026-0112" }, "Use eligible offset hours for a personal appointment.", "—"),
      record("Offset", 2, "Ana Reyes", "EMP-0182", "Pending Approval", { offsetDate: "Nov 23, 2026", hours: "3 hours", earnedOn: "Nov 14, 2026", availableBalance: "3 hours", timeFromTo: "2:00 PM–5:00 PM", relatedOvertime: "OT-2026-0104" }, "Use earned offset hours after the payroll close.", "—"),
      record("Offset", 3, "Luis Cruz", "EMP-0139", "Filed", { offsetDate: "Nov 5, 2026", hours: "2 hours", earnedOn: "Oct 25, 2026", availableBalance: "0 hours", timeFromTo: "3:00 PM–5:00 PM", relatedOvertime: "OT-2026-0092" }, "Offset request processed against eligible overtime.", "—"),
    ],
  },
  CompensatoryTimeOff: {
    title: "Compensatory Time Off", description: "Review CTO requests and the overtime hours used to earn them.",
    columns: [{ label: "CTO date", key: "ctoDate" }, { label: "Hours requested", key: "hours" }, { label: "Source overtime", key: "sourceOvertime" }],
    records: [
      record("CompensatoryTimeOff", 1, "Vin Santos", "EMP-0248", "Pending Review", { ctoDate: "Dec 4, 2026", hours: "4 hours", sourceOvertime: "OT-2026-0091 · Nov 7", availableBalance: "8 hours", timeFromTo: "1:00 PM–5:00 PM", expiration: "Dec 31, 2026" }, "Use earned compensatory hours for a planned personal commitment.", "Overtime-approval.pdf"),
      record("CompensatoryTimeOff", 2, "Ana Reyes", "EMP-0182", "Pending Approval", { ctoDate: "Nov 25, 2026", hours: "3 hours", sourceOvertime: "OT-2026-0104 · Nov 14", availableBalance: "3 hours", timeFromTo: "2:00 PM–5:00 PM", expiration: "Jan 31, 2027" }, "Use earned CTO hours after payroll close.", "—"),
      record("CompensatoryTimeOff", 3, "Luis Cruz", "EMP-0139", "Filed", { ctoDate: "Nov 6, 2026", hours: "4 hours", sourceOvertime: "OT-2026-0092 · Oct 25", availableBalance: "0 hours", timeFromTo: "1:00 PM–5:00 PM", expiration: "Nov 30, 2026" }, "CTO processed against approved overtime.", "—"),
    ],
  },
};
