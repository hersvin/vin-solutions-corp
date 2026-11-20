import { useState } from "react";
import { Link } from "react-router-dom";
import { HRPage, HRPageHeading, HRSection, HRStatus } from "@/modules/hrms/components/HRMSUI";
import { useHRMSStore } from "@/modules/hrms/store";

type ProfileView = "work" | "contact";

export default function EmployeeProfile() {
  const employees = useHRMSStore((state) => state.employees);
  const selectedEmployeeId = useHRMSStore((state) => state.selectedEmployeeId);
  const [view, setView] = useState<ProfileView>("work");
  const employee = employees.find((item) => item.id === selectedEmployeeId) ?? employees[0];

  if (!employee) return <HRPage><HRPageHeading title="Employee profile" description="No employee record is available yet." /><p className="hrms-empty">Add an employee from the directory to view their profile.</p></HRPage>;

  const initials = employee.name.split(" ").map((part) => part[0]).slice(0, 2).join("");
  const details = view === "work"
    ? [["Employee ID", employee.id], ["Job title", employee.title], ["Department", employee.department], ["Manager", employee.manager], ["Work location", employee.location], ["Employment type", employee.employmentType], ["Start date", new Intl.DateTimeFormat("en", { dateStyle: "long" }).format(new Date(`${employee.startDate}T00:00:00`))]]
    : [["Work email", employee.workEmail], ["Work phone", employee.workPhone], ["Primary location", employee.location], ["Work status", employee.status]];

  return <HRPage>
    <Link className="hrms-back-link" to="/modules/hrms/EmployeeDirectory">← Employee directory</Link>
    <HRPageHeading title="Employee profile" description="Review this employee’s current work record and contact details." />
    <HRSection title="Employee record" description="Only work-related contact information is shown in this profile.">
      <div className="hrms-profile-head"><span className="hrms-avatar" aria-hidden="true">{initials}</span><div className="hrms-profile-head__copy"><h2>{employee.name}</h2><p>{employee.title} · {employee.department} · {employee.location}</p></div><HRStatus>{employee.status}</HRStatus></div>
      <div className="hrms-segment" role="group" aria-label="Employee profile details">
        <button type="button" aria-pressed={view === "work"} onClick={() => setView("work")}>Work details</button>
        <button type="button" aria-pressed={view === "contact"} onClick={() => setView("contact")}>Contact information</button>
      </div>
      <dl className="hrms-profile-grid">{details.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
    </HRSection>
  </HRPage>;
}
