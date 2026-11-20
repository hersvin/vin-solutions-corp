import { useMemo, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { HRField, HRNotice, HRPage, HRPageHeading, HRSelect, HRStatus } from "@/modules/hrms/components/HRMSUI";
import { useHRMSActions } from "@/modules/hrms/hooks/useHRMSActions";
import { useHRMSToast } from "@/modules/hrms/hooks/useHRMSToast";
import { useHRMSStore } from "@/modules/hrms/store";

export default function ContractsAndCompensation() {
  const employees = useHRMSStore((state) => state.employees);
  const contracts = useHRMSStore((state) => state.contracts);
  const setSelectedEmployeeId = useHRMSStore((state) => state.setSelectedEmployeeId);
  const { createContract } = useHRMSActions();
  const { message, showToast } = useHRMSToast();
  const [employeeFilter, setEmployeeFilter] = useState("All employees");
  const [statusFilter, setStatusFilter] = useState("All records");
  const [showForm, setShowForm] = useState(false);
  const [employeeId, setEmployeeId] = useState(employees[0]?.id ?? "");
  const [type, setType] = useState("Employment agreement");
  const [effectiveDate, setEffectiveDate] = useState("");
  const [reviewDate, setReviewDate] = useState("");
  const filteredContracts = useMemo(() => contracts.filter((contract) => {
    const matchesEmployee = employeeFilter === "All employees" || contract.employeeId === employeeFilter;
    const matchesStatus = statusFilter === "All records" || contract.status === statusFilter;
    return matchesEmployee && matchesStatus;
  }), [contracts, employeeFilter, statusFilter]);

  function handleAddContract(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!employeeId) return;
    createContract({ employeeId, type, effectiveDate, endDate: "Ongoing", reviewDate, status: "Current" });
    showToast("Contract record added to the sample workspace.");
    setShowForm(false); setEffectiveDate(""); setReviewDate("");
  }

  return <HRPage>
    <HRPageHeading title="Contracts & compensation" description="Track agreement dates and review points. Compensation values are restricted in this sample interface." actionLabel={showForm ? "Close form" : "Add contract"} onAction={() => setShowForm((open) => !open)} />
    {message && <p className="hrms-toast" role="status">{message}</p>}
    <HRNotice tone="warning">Compensation amounts are not available in this demo. Connect role-based authorization before displaying live pay data.</HRNotice>
    {showForm && <form className="hrms-form" onSubmit={handleAddContract}>
      <h2>New contract record</h2>
      <div className="hrms-field-grid">
        <label className="hrms-field"><span>Employee</span><select value={employeeId} onChange={(event) => setEmployeeId(event.target.value)}>{employees.map((employee) => <option key={employee.id} value={employee.id}>{employee.name} · {employee.id}</option>)}</select></label>
        <HRSelect label="Agreement type" value={type} options={["Employment agreement", "Fixed-term agreement", "Amendment"]} onChange={setType} />
        <HRField label="Effective date" type="date" value={effectiveDate} required onChange={setEffectiveDate} />
        <HRField label="Next review date" type="date" value={reviewDate} required onChange={setReviewDate} />
        <div className="hrms-form-actions"><button className="hrms-button hrms-button--primary" type="submit">Add contract record</button></div>
      </div>
    </form>}

    <div className="hrms-toolbar">
      <label className="hrms-field hrms-filter-field"><span>Employee</span><select className="hrms-filter" value={employeeFilter} onChange={(event) => setEmployeeFilter(event.target.value)}><option>All employees</option>{employees.map((employee) => <option key={employee.id} value={employee.id}>{employee.name}</option>)}</select></label>
      <HRSelect label="Contract status" value={statusFilter} options={["All records", "Current", "Review due", "Ended"]} onChange={setStatusFilter} />
      <span className="hrms-result-count">{filteredContracts.length} records</span>
    </div>
    <div className="hrms-table-wrap"><table className="hrms-table">
      <thead><tr><th>Employee</th><th>Agreement</th><th>Effective</th><th>End date</th><th>Next review</th><th>Status</th><th>Compensation</th></tr></thead>
      <tbody>{filteredContracts.map((contract) => {
        const employee = employees.find((item) => item.id === contract.employeeId);
        return <tr key={contract.id}>
          <td>{employee ? <Link className="hrms-table__link" to="/modules/hrms/EmployeeProfile" onClick={() => setSelectedEmployeeId(employee.id)}>{employee.name}</Link> : contract.employeeId}<span className="hrms-table__secondary">{contract.id}</span></td>
          <td>{contract.type}</td><td>{new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(`${contract.effectiveDate}T00:00:00`))}</td><td>{contract.endDate}</td><td>{new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(`${contract.reviewDate}T00:00:00`))}</td><td><HRStatus>{contract.status}</HRStatus></td><td><span className="hrms-restricted">Restricted</span></td>
        </tr>;
      })}{filteredContracts.length === 0 && <tr><td colSpan={7} className="hrms-empty">No contracts match these filters.</td></tr>}</tbody>
    </table></div>
  </HRPage>;
}
