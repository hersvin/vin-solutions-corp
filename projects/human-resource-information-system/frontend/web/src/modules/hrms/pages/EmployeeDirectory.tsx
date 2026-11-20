import { useMemo, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { HRField, HRPage, HRPageHeading, HRSearch, HRSelect, HRStatus } from "@/modules/hrms/components/HRMSUI";
import { useHRMSActions } from "@/modules/hrms/hooks/useHRMSActions";
import { useHRMSToast } from "@/modules/hrms/hooks/useHRMSToast";
import { useHRMSStore } from "@/modules/hrms/store";

export default function EmployeeDirectory() {
  const employees = useHRMSStore((state) => state.employees);
  const setSelectedEmployeeId = useHRMSStore((state) => state.setSelectedEmployeeId);
  const { createEmployee } = useHRMSActions();
  const { message, showToast } = useHRMSToast();
  const [query, setQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All departments");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("Engineering");
  const [location, setLocation] = useState("Austin");
  const [email, setEmail] = useState("");

  const departments = useMemo(() => [...new Set(employees.map((employee) => employee.department))].sort(), [employees]);
  const filteredEmployees = useMemo(() => employees.filter((employee) => {
    const matchesQuery = `${employee.name} ${employee.id} ${employee.title} ${employee.workEmail}`.toLowerCase().includes(query.trim().toLowerCase());
    const matchesDepartment = departmentFilter === "All departments" || employee.department === departmentFilter;
    const matchesStatus = statusFilter === "All statuses" || employee.status === statusFilter;
    return matchesQuery && matchesDepartment && matchesStatus;
  }), [departmentFilter, employees, query, statusFilter]);

  function handleCreateEmployee(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const employee = createEmployee({
      name: name.trim(), title: title.trim(), department, location, status: "Active",
      startDate: new Date().toISOString().slice(0, 10), manager: "Assign manager",
      workEmail: email.trim(), employmentType: "Full-time", workPhone: "Not added",
    });
    setSelectedEmployeeId(employee.id);
    showToast(`${employee.name} added to the sample directory.`);
    setName(""); setTitle(""); setEmail(""); setShowForm(false);
  }

  return <HRPage>
    <HRPageHeading title="Employee directory" description="Find an employee by name, role, team, or work email." actionLabel={showForm ? "Close form" : "Add employee"} onAction={() => setShowForm((open) => !open)} />
    {message && <p className="hrms-toast" role="status">{message}</p>}
    {showForm && <form className="hrms-form" onSubmit={handleCreateEmployee}>
      <h2>Add employee to the sample directory</h2>
      <div className="hrms-field-grid">
        <HRField label="Full name" value={name} required onChange={setName} />
        <HRField label="Job title" value={title} required onChange={setTitle} />
        <HRSelect label="Department" value={department} options={departments} onChange={setDepartment} />
        <HRField label="Work location" value={location} required onChange={setLocation} />
        <HRField label="Work email" type="email" value={email} required onChange={setEmail} />
        <div className="hrms-form-actions"><button className="hrms-button hrms-button--primary" type="submit">Add employee</button></div>
      </div>
    </form>}
    <div className="hrms-toolbar">
      <HRSearch value={query} onChange={setQuery} placeholder="Search employees" />
      <HRSelect label="Department" value={departmentFilter} options={["All departments", ...departments]} onChange={setDepartmentFilter} />
      <HRSelect label="Status" value={statusFilter} options={["All statuses", "Active", "On leave", "Probation"]} onChange={setStatusFilter} />
      <span className="hrms-result-count">{filteredEmployees.length} of {employees.length} employees</span>
    </div>
    <div className="hrms-table-wrap"><table className="hrms-table">
      <thead><tr><th>Employee</th><th>Department</th><th>Location</th><th>Start date</th><th>Status</th></tr></thead>
      <tbody>{filteredEmployees.map((employee) => <tr key={employee.id}>
        <td><Link className="hrms-table__link" to="/modules/hrms/EmployeeProfile" onClick={() => setSelectedEmployeeId(employee.id)}>{employee.name}</Link><span className="hrms-table__secondary">{employee.id} · {employee.title}</span></td>
        <td>{employee.department}</td><td>{employee.location}</td><td>{new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(`${employee.startDate}T00:00:00`))}</td><td><HRStatus>{employee.status}</HRStatus></td>
      </tr>)}
      {filteredEmployees.length === 0 && <tr><td colSpan={5} className="hrms-empty">No employees match these filters.</td></tr>}</tbody>
    </table></div>
  </HRPage>;
}
