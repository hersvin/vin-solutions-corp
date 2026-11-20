import { useMemo, useState } from "react";
import { HRPage, HRPageHeading, HRSearch, HRStatus } from "@/modules/hrms/components/HRMSUI";
import { useHRMSStore } from "@/modules/hrms/store";

const eventTypes = ["All event types", "Hire", "Promotion", "Transfer", "Status change"];

export default function EmploymentHistory() {
  const employees = useHRMSStore((state) => state.employees);
  const events = useHRMSStore((state) => state.events);
  const [employeeId, setEmployeeId] = useState("");
  const [eventType, setEventType] = useState("All event types");
  const [query, setQuery] = useState("");
  const filteredEvents = useMemo(() => events
    .filter((event) => !employeeId || event.employeeId === employeeId)
    .filter((event) => eventType === "All event types" || event.type === eventType)
    .filter((event) => {
      const employee = employees.find((item) => item.id === event.employeeId);
      return `${event.title} ${event.detail} ${event.recordedBy} ${employee?.name ?? ""}`.toLowerCase().includes(query.trim().toLowerCase());
    })
    .toSorted((left, right) => right.date.localeCompare(left.date)), [employeeId, employees, eventType, events, query]);

  return <HRPage>
    <HRPageHeading title="Employment history" description="Review dated employee changes with the recorded reason and owner." />
    <div className="hrms-toolbar">
      <label className="hrms-field hrms-filter-field"><span>Employee</span><select className="hrms-filter" value={employeeId} onChange={(event) => setEmployeeId(event.target.value)}><option value="">All employees</option>{employees.map((employee) => <option key={employee.id} value={employee.id}>{employee.name}</option>)}</select></label>
      <label className="hrms-field hrms-filter-field"><span>Event type</span><select className="hrms-filter" value={eventType} onChange={(event) => setEventType(event.target.value)}>{eventTypes.map((type) => <option key={type}>{type}</option>)}</select></label>
      <HRSearch value={query} onChange={setQuery} placeholder="Search history" />
      <span className="hrms-result-count">{filteredEvents.length} events</span>
    </div>

    {employeeId && (() => {
      const employee = employees.find((item) => item.id === employeeId);
      return employee ? <section className="hrms-current-role"><span>Current assignment</span><strong>{employee.title}</strong><p>{employee.department} · {employee.location} · Since {new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(`${employee.startDate}T00:00:00`))}</p></section> : null;
    })()}

    {filteredEvents.length > 0 ? <ol className="hrms-timeline" aria-label="Employment events">{filteredEvents.map((event) => {
      const employee = employees.find((item) => item.id === event.employeeId);
      return <li key={event.id}>
        <time dateTime={event.date}>{new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(`${event.date}T00:00:00`))}</time>
        <div><strong>{event.title}</strong><p>{employee?.name ?? event.employeeId} · {event.detail}</p><span className="hrms-event-meta"><HRStatus>{event.type}</HRStatus><span>Recorded by {event.recordedBy}</span></span></div>
      </li>;
    })}</ol> : <p className="hrms-empty">No employment events match these filters.</p>}
  </HRPage>;
}
