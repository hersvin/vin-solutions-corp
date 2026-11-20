export type SubmoduleDefinition = {
  id: string;
  label: string;
  description: string;
  children?: SubmoduleDefinition[];
};

export type ModuleDefinition = {
  id: string;
  label: string;
  icon: string;
  group: "Primary modules" | "Independent modules";
  hiddenFromNavigation?: boolean;
  submodules: SubmoduleDefinition[];
};

const submodule = (
  id: string,
  label: string,
  description: string,
  children?: SubmoduleDefinition[],
): SubmoduleDefinition => ({ id, label, description, children });

const PRIMARY_MODULES: ModuleDefinition[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: "metrics-chart-line",
    group: "Primary modules",
    submodules: [
      submodule(
        "Overview",
        "Overview",
        "Review your workforce overview and pending actions.",
      ),
    ],
  },
  {
    id: "calendar",
    label: "Calendar",
    icon: "schedule-calendar",
    group: "Primary modules",
    submodules: [
      submodule("PersonalCalendar", "Personal Calendar", "View and move your own calendar events."),
      submodule("TeamCalendar", "Team Calendar", "View your team’s schedules without editing them."),
    ],
  },
  {
    id: "record",
    label: "Record",
    icon: "documents-file",
    group: "Primary modules",
    submodules: [
      submodule("Attendance", "Attendance", "Review your attendance records."),
      submodule("Payslip", "Payslip", "View your issued payslips."),
      submodule(
        "LoanLedger",
        "Loan Ledger",
        "Review your loan transactions and balance.",
      ),
    ],
  },
  {
    id: "applications",
    label: "Applications",
    icon: "documents-clipboard-list",
    group: "Primary modules",
    submodules: [
      submodule(
        "ChangeOfSchedule",
        "Change of Schedule",
        "Request a change to your work schedule.",
      ),
      submodule("Leave", "Leave", "Submit and track leave requests."),
      submodule(
        "OfficialBusiness",
        "Official Business",
        "Request approval for off-site work.",
      ),
      submodule(
        "MissedLog",
        "Missed Log",
        "Request a correction for a missed time entry.",
      ),
      submodule(
        "Overtime",
        "Overtime",
        "Submit overtime for review and approval.",
      ),
      submodule(
        "Offset",
        "Offset",
        "Request offset time according to company policy.",
      ),
      submodule(
        "CompensatoryTimeOff",
        "Compensatory Time Off",
        "Request compensatory time off.",
      ),
    ],
  },
  {
    id: "employee-management",
    label: "Employee Management",
    icon: "identity-users",
    group: "Primary modules",
    submodules: [
      submodule(
        "Files201",
        "201 Files",
        "Maintain authorized employee records and documents.",
      ),
      submodule(
        "TaskManagement",
        "Task Management",
        "Assign and track employee-related tasks.",
      ),
    ],
  },
  {
    id: "timekeeping",
    label: "Timekeeping",
    icon: "schedule-clock",
    group: "Primary modules",
    submodules: [
      submodule(
        "EmployeeTimeRecord",
        "Employee Time Record",
        "Review time entries and attendance totals.",
      ),
      submodule(
        "LeaveAdjustments",
        "Leave Adjustments",
        "Review and record approved leave balance adjustments.",
      ),
      submodule(
        "TimekeepingProcessing",
        "Timekeeping Processing",
        "Validate and process time records for a cutoff.",
      ),
      submodule(
        "WorkSchedule",
        "Work Schedule",
        "Maintain employee schedules and shift assignments.",
      ),
    ],
  },
  {
    id: "payroll",
    label: "Payroll",
    icon: "money-wallet",
    group: "Primary modules",
    submodules: [
      submodule(
        "LoanAdjustment",
        "Loan Adjustment",
        "Review and record payroll loan adjustments.",
      ),
      submodule(
        "LoanApplication",
        "Loan Application",
        "Review employee loan applications.",
      ),
      submodule(
        "FinalPay",
        "Final Pay",
        "Prepare and review final pay records.",
      ),
      submodule(
        "IncomeAndDeduction",
        "Income and Deduction",
        "Maintain authorized payroll income and deductions.",
      ),
      submodule(
        "ThirteenthMonthProcess",
        "13th Month Process",
        "Prepare and review the 13th month payroll process.",
      ),
      submodule(
        "ServiceCharge",
        "Service Charge",
        "Process service charge allocations.",
      ),
      submodule(
        "PayrollProcessing",
        "Payroll Processing",
        "Prepare, validate, and process payroll runs.",
      ),
      submodule(
        "PayrollDisbursement",
        "Payroll Disbursement",
        "Track approved payroll disbursement records.",
      ),
    ],
  },
  {
    id: "reports",
    label: "Reports",
    icon: "metrics-chart-line",
    group: "Primary modules",
    submodules: [
      submodule(
        "HumanResources",
        "Human Resources",
        "Review workforce and employee reports.",
      ),
      submodule(
        "Timekeeping",
        "Timekeeping",
        "Review attendance and timekeeping reports.",
      ),
      submodule("Payroll", "Payroll", "Review authorized payroll reports."),
      submodule(
        "Government",
        "Government",
        "Prepare government reporting outputs.",
      ),
      submodule(
        "BankExport",
        "Bank Export",
        "Prepare validated payroll bank export files.",
      ),
    ],
  },
  {
    id: "security",
    label: "Security",
    icon: "identity-shield",
    group: "Primary modules",
    submodules: [
      submodule("Users", "Users", "Manage user accounts and access status."),
      submodule(
        "UserGroup",
        "User Group",
        "Assign permission groups within the three base roles.",
      ),
    ],
  },
  {
    id: "configurations",
    label: "Configuration",
    icon: "tools-settings",
    group: "Primary modules",
    submodules: [
      submodule(
        "Organization",
        "Organization",
        "Manage organization records for the selected company.",
        [
          submodule("Company", "Company", "Manage company records and active company scope."),
          submodule("Branch", "Branch", "Manage branches for the selected company."),
          submodule("Department", "Department", "Manage departments and reporting owners."),
          submodule("Division", "Division", "Manage company divisions."),
          submodule("Section", "Section", "Manage company sections."),
          submodule("PositionLevel", "Position Level", "Manage position levels."),
          submodule("Designation", "Designation", "Manage employee designations."),
        ],
      ),
      submodule(
        "CutoffPeriod",
        "Cutoff Period",
        "Configure payroll and timekeeping cutoff periods.",
      ),
      submodule("Holiday", "Holiday", "Maintain company holiday calendars."),
      submodule(
        "ApprovalSetup",
        "Approval Setup",
        "Configure review and approval routing.",
      ),
      submodule(
        "SchedulerSetup",
        "Scheduler Setup",
        "Configure scheduled system processes.",
      ),
    ],
  },
];

const RETAINED_MODULES: ModuleDefinition[] = [
  {
    id: "cms",
    label: "Company Management",
    icon: "identity-users",
    group: "Independent modules",
    hiddenFromNavigation: true,
    submodules: [
      submodule(
        "CompanySetup",
        "Company Setup",
        "Manage legal entities, company details, and foundational settings.",
      ),
      submodule(
        "OrganizationStructure",
        "Organization Structure",
        "Maintain departments and reporting relationships.",
      ),
      submodule(
        "LocationsAndCostCenters",
        "Locations & Cost Centers",
        "Organize work locations and financial cost centers.",
      ),
      submodule(
        "PositionsAndJobLevels",
        "Positions & Job Levels",
        "Define roles, position slots, and job level frameworks.",
      ),
      submodule(
        "OrganizationChart",
        "Organization Chart",
        "Explore the current company hierarchy.",
      ),
    ],
  },
  {
    id: "hrms",
    label: "Human Resources",
    icon: "identity-user-plus",
    group: "Independent modules",
    hiddenFromNavigation: true,
    submodules: [
      submodule(
        "EmployeeDirectory",
        "Employee Directory",
        "Search and manage the employee roster.",
      ),
      submodule(
        "EmployeeProfile",
        "Employee Profile",
        "View and maintain an employee's core profile.",
      ),
      submodule(
        "EmploymentHistory",
        "Employment History",
        "Review employment changes and prior assignments.",
      ),
      submodule(
        "ContractsAndCompensation",
        "Contracts & Compensation",
        "Track employment terms and compensation details.",
      ),
      submodule(
        "DuplicateChecks",
        "Duplicate Checks",
        "Identify possible duplicate employee records.",
      ),
    ],
  },
  {
    id: "attendance",
    label: "Attendance",
    icon: "schedule-clock",
    group: "Independent modules",
    hiddenFromNavigation: true,
    submodules: [
      submodule(
        "TimeCapture",
        "Time Capture",
        "Record employee clock-ins, clock-outs, and work time.",
      ),
      submodule(
        "SchedulesAndShifts",
        "Schedules & Shifts",
        "Plan employee schedules, shifts, and work patterns.",
      ),
      submodule(
        "AttendanceSummaries",
        "Attendance Summaries",
        "Review attendance totals and period summaries.",
      ),
      submodule(
        "ExceptionsAndOvertime",
        "Exceptions & Overtime",
        "Review late arrivals, absences, and overtime cases.",
      ),
      submodule(
        "CorrectionsAndApprovals",
        "Corrections & Approvals",
        "Submit and approve corrections to time records.",
      ),
    ],
  },
  {
    id: "leave",
    label: "Leave Management",
    icon: "schedule-calendar",
    group: "Independent modules",
    hiddenFromNavigation: true,
    submodules: [
      submodule(
        "LeavePolicies",
        "Leave Policies",
        "Configure leave types, eligibility, and accrual rules.",
      ),
      submodule(
        "LeaveRequests",
        "Leave Requests",
        "Submit and track employee leave requests.",
      ),
      submodule("Approvals", "Approvals", "Review pending leave decisions."),
      submodule(
        "BalancesAndLedger",
        "Balances & Ledger",
        "Inspect leave balances and transaction history.",
      ),
      submodule(
        "LeaveCalendar",
        "Leave Calendar",
        "View team leave schedules and coverage.",
      ),
    ],
  },
  {
    id: "recruitment",
    label: "Recruitment",
    icon: "identity-user-plus",
    group: "Independent modules",
    submodules: [
      submodule(
        "RequisitionsAndVacancies",
        "Requisitions & Vacancies",
        "Create hiring requests and manage open vacancies.",
      ),
      submodule(
        "CandidateRecords",
        "Candidate Records",
        "Maintain candidate profiles and application details.",
      ),
      submodule(
        "CandidatePipeline",
        "Candidate Pipeline",
        "Track applicants through recruitment stages.",
      ),
      submodule(
        "InterviewsAndFeedback",
        "Interviews & Feedback",
        "Schedule interviews and capture interviewer feedback.",
      ),
      submodule(
        "OffersAndConversion",
        "Offers & Conversion",
        "Prepare offers and convert accepted candidates to employees.",
      ),
      submodule(
        "ConsentAndRetention",
        "Consent & Retention",
        "Manage candidate privacy consent and record retention.",
      ),
    ],
  },
  {
    id: "documents",
    label: "Documents",
    icon: "documents-file",
    group: "Independent modules",
    submodules: [
      submodule(
        "DocumentLibrary",
        "Document Library",
        "Browse employee and company documents.",
      ),
      submodule(
        "UploadAndVersioning",
        "Upload & Versioning",
        "Upload files and keep document versions organized.",
      ),
      submodule(
        "ExpiryAndRenewal",
        "Expiry & Renewal",
        "Track expiring documents and renewal actions.",
      ),
      submodule(
        "AccessAndDownloads",
        "Access & Downloads",
        "Review document access and download records.",
      ),
      submodule(
        "RetentionAndDisposal",
        "Retention & Disposal",
        "Apply retention schedules and document disposal.",
      ),
      submodule(
        "AuditHistory",
        "Audit History",
        "Inspect changes made to document records.",
      ),
    ],
  },
  {
    id: "payroll-operations",
    label: "Payroll Operations",
    icon: "money-wallet",
    group: "Independent modules",
    hiddenFromNavigation: true,
    submodules: [
      submodule(
        "PayGroupsAndPeriods",
        "Pay Groups & Periods",
        "Set up payroll groups and pay periods.",
      ),
      submodule(
        "PayComponentsAndAdjustments",
        "Pay Components & Adjustments",
        "Manage earnings, deductions, and payroll adjustments.",
      ),
      submodule(
        "PayrollPreparation",
        "Payroll Preparation",
        "Prepare payroll inputs for a processing period.",
      ),
      submodule(
        "PreviewAndExceptions",
        "Preview & Exceptions",
        "Review payroll calculations and resolve exceptions.",
      ),
      submodule(
        "ApprovalAndLocking",
        "Approval & Locking",
        "Approve payroll runs and lock finalized periods.",
      ),
      submodule(
        "PayslipsAndAmsExport",
        "Payslips & AMS Export",
        "Access payslips and prepare payroll exports.",
      ),
    ],
  },
  {
    id: "performance",
    label: "Performance",
    icon: "tools-star",
    group: "Independent modules",
    submodules: [
      submodule(
        "ReviewCycles",
        "Review Cycles",
        "Create and manage performance review cycles.",
      ),
      submodule(
        "GoalsAndCompetencies",
        "Goals & Competencies",
        "Set employee goals and competency expectations.",
      ),
      submodule(
        "Assessments",
        "Assessments",
        "Complete employee and manager assessments.",
      ),
      submodule(
        "CalibrationAndFinalization",
        "Calibration & Finalization",
        "Calibrate outcomes and finalize review results.",
      ),
      submodule(
        "ReportsAndReminders",
        "Reports & Reminders",
        "Track review completion and send reminders.",
      ),
    ],
  },
  {
    id: "assets",
    label: "Asset Management",
    icon: "documents-box",
    group: "Independent modules",
    submodules: [
      submodule(
        "AssetRegister",
        "Asset Register",
        "Maintain the inventory of company assets.",
      ),
      submodule(
        "AssignmentAndReturn",
        "Assignment & Return",
        "Record asset assignment to and return from employees.",
      ),
      submodule(
        "TransfersAndMaintenance",
        "Transfers & Maintenance",
        "Track asset transfers and maintenance work.",
      ),
      submodule(
        "WarrantyAndInventory",
        "Warranty & Inventory",
        "Review warranty coverage and inventory levels.",
      ),
      submodule(
        "DisposalAndHistory",
        "Disposal & History",
        "Record asset disposal and historical changes.",
      ),
    ],
  },
  {
    id: "self-service",
    label: "Employee Self-Service",
    icon: "identity-users",
    group: "Independent modules",
    hiddenFromNavigation: true,
    submodules: [
      submodule(
        "EmployeeHome",
        "Employee Home",
        "Give employees a personal overview of updates and actions.",
      ),
      submodule(
        "MyProfile",
        "My Profile",
        "Let employees review and request changes to their profile.",
      ),
      submodule(
        "MyAttendanceAndLeave",
        "My Attendance & Leave",
        "Show personal time records, balances, and requests.",
      ),
      submodule(
        "MyPayslipsAndDocuments",
        "My Payslips & Documents",
        "Provide employee access to payslips and files.",
      ),
      submodule(
        "MyTasksAndReviews",
        "My Tasks & Reviews",
        "Collect assigned tasks and performance activities.",
      ),
    ],
  },
  {
    id: "onboarding",
    label: "Onboarding & Offboarding",
    icon: "documents-clipboard",
    group: "Independent modules",
    submodules: [
      submodule(
        "Preboarding",
        "Preboarding",
        "Coordinate tasks and information before an employee starts.",
      ),
      submodule(
        "OnboardingChecklist",
        "Onboarding Checklist",
        "Track new hire activities and completion.",
      ),
      submodule(
        "LifecycleChanges",
        "Lifecycle Changes",
        "Manage transfers, promotions, and status changes.",
      ),
      submodule(
        "OffboardingChecklist",
        "Offboarding Checklist",
        "Coordinate exit tasks, access removal, and asset return.",
      ),
      submodule(
        "CompletionHistory",
        "Completion History",
        "Review completed onboarding and offboarding records.",
      ),
    ],
  },
  {
    id: "training",
    label: "Training & Certifications",
    icon: "documents-book-bookmark",
    group: "Independent modules",
    submodules: [
      submodule(
        "TrainingCatalog",
        "Training Catalog",
        "Browse available courses and learning resources.",
      ),
      submodule(
        "EnrollmentAndCompletion",
        "Enrollment & Completion",
        "Manage course enrollment and completion records.",
      ),
      submodule(
        "CertificationRecords",
        "Certification Records",
        "Store employee certifications and credentials.",
      ),
      submodule(
        "ExpiryTracking",
        "Expiry Tracking",
        "Monitor certifications that need renewal.",
      ),
      submodule(
        "TrainingReports",
        "Training Reports",
        "Summarize participation and learning completion.",
      ),
    ],
  },
  {
    id: "benefits",
    label: "Benefits & Allowances",
    icon: "money-receipt",
    group: "Independent modules",
    submodules: [
      submodule(
        "BenefitPlans",
        "Benefit Plans",
        "Maintain available employee benefit plans.",
      ),
      submodule(
        "Eligibility",
        "Eligibility",
        "Determine benefit eligibility by employee criteria.",
      ),
      submodule(
        "Enrollment",
        "Enrollment",
        "Record employee benefit selections.",
      ),
      submodule(
        "Allowances",
        "Allowances",
        "Manage recurring and one-time employee allowances.",
      ),
      submodule(
        "ChangesAndReporting",
        "Changes & Reporting",
        "Review benefit changes and participation reports.",
      ),
    ],
  },
  {
    id: "employee-relations",
    label: "Employee Relations",
    icon: "identity-shield",
    group: "Independent modules",
    submodules: [
      submodule(
        "CaseIntake",
        "Case Intake",
        "Capture employee relations questions and concerns.",
      ),
      submodule(
        "TriageAndAssignment",
        "Triage & Assignment",
        "Prioritize cases and assign responsible reviewers.",
      ),
      submodule(
        "CaseNotesAndEvidence",
        "Case Notes & Evidence",
        "Keep restricted case notes and supporting records.",
      ),
      submodule(
        "ActionsAndResolution",
        "Actions & Resolution",
        "Track follow-up actions and case outcomes.",
      ),
      submodule(
        "AccessAndAuditHistory",
        "Access & Audit History",
        "Review sensitive case access and activity history.",
      ),
    ],
  },
  {
    id: "workforce-planning",
    label: "Workforce Planning",
    icon: "metrics-chart-line",
    group: "Independent modules",
    submodules: [
      submodule(
        "WorkforcePlans",
        "Workforce Plans",
        "Create staffing plans for teams and business periods.",
      ),
      submodule(
        "HeadcountRequests",
        "Headcount Requests",
        "Submit requests for new or replacement positions.",
      ),
      submodule(
        "ApprovalWorkflow",
        "Approval Workflow",
        "Review and approve workforce planning requests.",
      ),
      submodule(
        "CapacityAndBudgetView",
        "Capacity & Budget View",
        "Compare staffing capacity with planned budgets.",
      ),
      submodule(
        "ForecastReports",
        "Forecast Reports",
        "Review projected workforce needs and scenarios.",
      ),
    ],
  },
];

export const MODULES: ModuleDefinition[] = [
  ...PRIMARY_MODULES,
  ...RETAINED_MODULES.map((module) => ({
    ...module,
    group: "Independent modules" as const,
  })),
];

export const getModule = (moduleId: string) =>
  MODULES.find((module) => module.id === moduleId);
