import { useMemo, useState, type CSSProperties } from "react";
import { RuneIcon } from "runeicons-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Link } from "react-router-dom";
import { selectActiveCompany, useCompanyManagementStore } from "@/modules/cms/store";
import { FONT } from "@/utils/FONT";
import { THEME } from "@/utils/THEME";
import "@/modules/dashboard/pages/Overview.css";

type DashboardRole = "EMPLOYEE" | "MANAGER" | "ADMIN";
type ChartRange = "7 days" | "30 days";

const roles: DashboardRole[] = ["EMPLOYEE", "MANAGER", "ADMIN"];

const roleDescriptions: Record<DashboardRole, string> = {
  EMPLOYEE: "Your attendance, requests, and upcoming work.",
  MANAGER: "Your team’s attendance and requests awaiting review.",
  ADMIN: "Company-wide activity and workflows you can access.",
};

const chartData: Record<DashboardRole, Record<ChartRange, { label: string; value: number }[]>> = {
  EMPLOYEE: {
    "7 days": [
      { label: "Mon", value: 7.8 }, { label: "Tue", value: 8.1 }, { label: "Wed", value: 7.4 },
      { label: "Thu", value: 8.2 }, { label: "Fri", value: 7.0 }, { label: "Sat", value: 0 }, { label: "Sun", value: 0 },
    ],
    "30 days": [
      { label: "Week 1", value: 38.2 }, { label: "Week 2", value: 39.4 }, { label: "Week 3", value: 36.8 }, { label: "Week 4", value: 38.5 },
    ],
  },
  MANAGER: {
    "7 days": [
      { label: "Mon", value: 94 }, { label: "Tue", value: 91 }, { label: "Wed", value: 96 },
      { label: "Thu", value: 93 }, { label: "Fri", value: 95 }, { label: "Sat", value: 0 }, { label: "Sun", value: 0 },
    ],
    "30 days": [
      { label: "Week 1", value: 92 }, { label: "Week 2", value: 94 }, { label: "Week 3", value: 91 }, { label: "Week 4", value: 95 },
    ],
  },
  ADMIN: {
    "7 days": [
      { label: "Mon", value: 97 }, { label: "Tue", value: 96 }, { label: "Wed", value: 95 },
      { label: "Thu", value: 98 }, { label: "Fri", value: 96 }, { label: "Sat", value: 0 }, { label: "Sun", value: 0 },
    ],
    "30 days": [
      { label: "Week 1", value: 94 }, { label: "Week 2", value: 96 }, { label: "Week 3", value: 95 }, { label: "Week 4", value: 97 },
    ],
  },
};

const statusData: Record<DashboardRole, { name: string; value: number; color: string }[]> = {
  EMPLOYEE: [
    { name: "Approved", value: 4, color: THEME.colors.blue },
    { name: "Pending", value: 1, color: THEME.colors.peach },
    { name: "Needs update", value: 1, color: THEME.colors.lightBlue },
  ],
  MANAGER: [
    { name: "Approved", value: 12, color: THEME.colors.blue },
    { name: "Pending review", value: 4, color: THEME.colors.peach },
    { name: "Returned", value: 2, color: THEME.colors.lightBlue },
  ],
  ADMIN: [
    { name: "Completed", value: 28, color: THEME.colors.blue },
    { name: "In progress", value: 7, color: THEME.colors.peach },
    { name: "Needs attention", value: 3, color: THEME.colors.lightBlue },
  ],
};

const metrics: Record<DashboardRole, { label: string; value: string; detail: string; icon: string; to: string }[]> = {
  EMPLOYEE: [
    { label: "Hours this week", value: "38.5 h", detail: "Across 5 workdays", icon: "schedule-clock", to: "/modules/record/Attendance" },
    { label: "Leave balance", value: "12.5 days", detail: "Available to request", icon: "schedule-calendar", to: "/modules/applications/Leave" },
    { label: "Requests waiting", value: "1", detail: "Usually reviewed in 2 days", icon: "documents-file", to: "/modules/applications/Leave" },
    { label: "Next payday", value: "Jun 15", detail: "Payslip follows processing", icon: "money-wallet", to: "/modules/record/Payslip" },
  ],
  MANAGER: [
    { label: "Team attendance", value: "94.6%", detail: "This workweek", icon: "schedule-clock", to: "/modules/timekeeping/EmployeeTimeRecord" },
    { label: "Requests to review", value: "4", detail: "Across your assigned team", icon: "documents-file", to: "/modules/applications/Leave" },
    { label: "Scheduled today", value: "18", detail: "Within your team scope", icon: "schedule-calendar", to: "/modules/timekeeping/WorkSchedule" },
    { label: "Overtime this week", value: "12.5 h", detail: "Pending approval: 2", icon: "schedule-clock", to: "/modules/applications/Overtime" },
  ],
  ADMIN: [
    { label: "Active employees", value: "248", detail: "Across authorized companies", icon: "identity-users", to: "/modules/employee-management/Files201" },
    { label: "Companies", value: "2", detail: "Organization workspaces", icon: "identity-users", to: "/modules/configurations/Organization" },
    { label: "Open workflows", value: "7", detail: "Require an authorized action", icon: "documents-file", to: "/modules/reports/HumanResources" },
    { label: "Next cutoff", value: "6 days", detail: "Timekeeping processing", icon: "schedule-calendar", to: "/modules/timekeeping/TimekeepingProcessing" },
  ],
};

const actions: Record<DashboardRole, { label: string; description: string; to: string }[]> = {
  EMPLOYEE: [
    { label: "Review your attendance", description: "Check this week’s time entries.", to: "/modules/record/Attendance" },
    { label: "Submit a leave request", description: "Choose dates and request type.", to: "/modules/applications/Leave" },
    { label: "View latest payslip", description: "Open your most recent statement.", to: "/modules/record/Payslip" },
  ],
  MANAGER: [
    { label: "Review leave requests", description: "4 requests are waiting for review.", to: "/modules/applications/Leave" },
    { label: "Check missed logs", description: "2 corrections need your decision.", to: "/modules/applications/MissedLog" },
    { label: "View team schedules", description: "Check coverage for this week.", to: "/modules/timekeeping/WorkSchedule" },
  ],
  ADMIN: [
    { label: "Review payroll processing", description: "Check the current cutoff status.", to: "/modules/payroll/PayrollProcessing" },
    { label: "Open organization settings", description: "Select a company to manage its structure.", to: "/modules/configurations/Organization" },
    { label: "Review workflow reports", description: "Find items that need follow-up.", to: "/modules/reports/HumanResources" },
  ],
};

const rangeOptions: ChartRange[] = ["7 days", "30 days"];

function formatChartValue(role: DashboardRole, value: number) {
  if (role === "EMPLOYEE") return `${value} hours`;
  return `${value}%`;
}

export default function Overview() {
  const [role, setRole] = useState<DashboardRole>("EMPLOYEE");
  const [range, setRange] = useState<ChartRange>("7 days");
  const companies = useCompanyManagementStore((state) => state.companies);
  const activeCompanyId = useCompanyManagementStore((state) => state.activeCompanyId);
  const activeCompany = useCompanyManagementStore((state) => selectActiveCompany(state));
  const setActiveCompany = useCompanyManagementStore((state) => state.setActiveCompany);
  const values = useMemo(() => chartData[role][range], [role, range]);
  const roleMetrics = metrics[role].map((metric) =>
    role === "ADMIN" && metric.label === "Companies"
      ? { ...metric, value: String(companies.length) }
      : metric,
  );
  const chartTitle = role === "EMPLOYEE" ? "Your work hours" : role === "MANAGER" ? "Team attendance" : "Company attendance";
  const chartUnit = role === "EMPLOYEE"
    ? range === "7 days" ? "Hours per day" : "Hours per week"
    : "Attendance rate";
  const statusTitle = role === "EMPLOYEE" ? "Your requests" : role === "MANAGER" ? "Team requests" : "Workflow status";
  const style: CSSProperties = { fontFamily: FONT.body.family };

  return (
    <div className="dashboard" style={style}>
      <header className="dashboard__heading">
        <div>
          <p className="dashboard__eyebrow">HERSVIN WORKSPACE</p>
          <h2>Good morning</h2>
          <p className="dashboard__subtitle">{roleDescriptions[role]}</p>
        </div>
        <div className="dashboard__context">
          {role === "ADMIN" ? (
            <label className="dashboard__company-picker">
              <span>Company scope</span>
              <select value={activeCompanyId} onChange={(event) => setActiveCompany(event.target.value)}>
                {companies.map((company) => <option key={company.id} value={company.id}>{company.company.displayName}</option>)}
              </select>
            </label>
          ) : (
            <span className="dashboard__company-label">{activeCompany.company.displayName}</span>
          )}
          <span className="dashboard__sample-note">Sample workspace data</span>
        </div>
      </header>

      <section className="dashboard__role-preview" aria-label="Dashboard role preview">
        <span>Preview role</span>
        <div role="group" aria-label="Choose a dashboard role">
          {roles.map((item) => (
            <button key={item} type="button" aria-pressed={role === item} onClick={() => setRole(item)}>
              {item === "EMPLOYEE" ? "Employee" : item === "MANAGER" ? "Manager" : "Admin"}
            </button>
          ))}
        </div>
      </section>

      <section className="dashboard__metrics" aria-label={`${role} summary`}>
        {roleMetrics.map((metric) => (
          <Link className="dashboard-metric" key={metric.label} to={metric.to}>
            <span className="dashboard-metric__top">
              <span>{metric.label}</span>
              <RuneIcon name={metric.icon} type="normal" size={18} />
            </span>
            <strong>{metric.value}</strong>
            <span className="dashboard-metric__detail">{metric.detail}</span>
          </Link>
        ))}
      </section>

      <section className="dashboard__analytics" aria-label="Dashboard analytics">
        <article className="dashboard-card dashboard-card--trend">
          <header className="dashboard-card__header">
            <div>
              <h3>{chartTitle}</h3>
              <p>{chartUnit}</p>
            </div>
            <label className="dashboard-card__range">
              <span className="sr-only">Chart date range</span>
              <select value={range} onChange={(event) => setRange(rangeOptions.find((option) => option === event.target.value) ?? "7 days")}>
                {rangeOptions.map((option) => <option key={option}>{option}</option>)}
              </select>
            </label>
          </header>
          <div className="dashboard-chart dashboard-chart--area">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={values} margin={{ top: 10, right: 8, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="attendance-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={THEME.colors.blue} stopOpacity={0.28} />
                    <stop offset="100%" stopColor={THEME.colors.lightBlue} stopOpacity={0.03} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="var(--color-border)" strokeDasharray="3 5" />
                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: "var(--color-text-muted)", fontSize: 11 }} />
                <YAxis domain={role === "EMPLOYEE" ? range === "7 days" ? [0, 10] : [0, 45] : [0, 100]} axisLine={false} tickLine={false} tick={{ fill: "var(--color-text-muted)", fontSize: 11 }} />
                <Tooltip formatter={(value) => [formatChartValue(role, Number(value)), role === "EMPLOYEE" ? "Work time" : "Attendance"]} contentStyle={{ borderRadius: 12, borderColor: "var(--color-border)", background: "var(--color-surface)", color: "var(--color-text)" }} />
                <Area type="monotone" dataKey="value" stroke={THEME.colors.blue} strokeWidth={2.5} fill="url(#attendance-fill)" activeDot={{ r: 5, fill: THEME.colors.blue, stroke: "var(--color-surface)", strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="dashboard-card dashboard-card--status">
          <header className="dashboard-card__header">
            <div>
              <h3>{statusTitle}</h3>
              <p>Current period</p>
            </div>
          </header>
          <div className="dashboard-chart dashboard-chart--donut">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData[role]} dataKey="value" nameKey="name" innerRadius={58} outerRadius={82} paddingAngle={3} stroke="var(--color-surface)">
                  {statusData[role].map((slice) => <Cell key={slice.name} fill={slice.color} />)}
                </Pie>
                <Tooltip formatter={(value, name) => [value, name]} contentStyle={{ borderRadius: 12, borderColor: "var(--color-border)", background: "var(--color-surface)", color: "var(--color-text)" }} />
                <Legend iconType="circle" iconSize={8} verticalAlign="bottom" height={32} wrapperStyle={{ color: "var(--color-text-muted)", fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </article>
      </section>

      <section className="dashboard__bottom">
        <article className="dashboard-card dashboard-card--actions">
          <header className="dashboard-card__header">
            <div><h3>{role === "EMPLOYEE" ? "Your actions" : role === "MANAGER" ? "Team actions" : "Workspace actions"}</h3><p>Shortcuts based on your access</p></div>
            <Link to={role === "EMPLOYEE" ? "/modules/applications/Leave" : "/modules/reports/HumanResources"}>View all</Link>
          </header>
          <ul className="dashboard-actions">
            {actions[role].map((action) => (
              <li key={action.label}>
                <Link to={action.to}>
                  <span><strong>{action.label}</strong><small>{action.description}</small></span>
                  <RuneIcon name="arrows-chevron-right" type="normal" size={17} />
                </Link>
              </li>
            ))}
          </ul>
        </article>

        <article className="dashboard-card dashboard-card--calendar">
          <header className="dashboard-card__header">
            <div><h3>Coming up</h3><p>Next in your calendar</p></div>
            <Link to="/modules/calendar/PersonalCalendar">Open calendar</Link>
          </header>
          <div className="dashboard-event">
            <time dateTime="2026-11-23"><strong>23</strong><span>NOV</span></time>
            <div><strong>{role === "EMPLOYEE" ? "Payroll date" : "Payroll cutoff"}</strong><span>{role === "EMPLOYEE" ? "Payslip available after processing" : "Timekeeping review due"}</span></div>
          </div>
          <div className="dashboard-event">
            <time dateTime="2026-11-26"><strong>26</strong><span>NOV</span></time>
            <div><strong>{role === "MANAGER" ? "Team schedule review" : "Company holiday"}</strong><span>{role === "MANAGER" ? "Check upcoming coverage" : "Calendar event"}</span></div>
          </div>
        </article>
      </section>
    </div>
  );
}
