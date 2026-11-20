import { useMemo, useState } from "react";
import { HRNotice, HRPage, HRPageHeading, HRSection, HRStatus } from "@/modules/hrms/components/HRMSUI";
import { useHRMSToast } from "@/modules/hrms/hooks/useHRMSToast";
import { useHRMSStore } from "@/modules/hrms/store";

export default function DuplicateChecks() {
  const duplicateCases = useHRMSStore((state) => state.duplicateCases);
  const updateDuplicateCase = useHRMSStore((state) => state.updateDuplicateCase);
  const { message, showToast } = useHRMSToast();
  const [selectedId, setSelectedId] = useState("");
  const [showReviewed, setShowReviewed] = useState(false);
  const visibleCases = useMemo(() => duplicateCases.filter((item) => showReviewed || item.status === "Needs review"), [duplicateCases, showReviewed]);
  const selectedCase = visibleCases.find((item) => item.id === selectedId) ?? visibleCases[0];

  function resolveCase(status: "Marked distinct" | "Confirmed duplicate") {
    if (!selectedCase) return;
    updateDuplicateCase(selectedCase.id, status);
    showToast(`${selectedCase.id} marked ${status.toLowerCase()}. No records were merged or deleted.`);
    setSelectedId("");
  }

  return <HRPage>
    <HRPageHeading title="Duplicate checks" description="Review possible matches using the evidence shown. Each decision remains with a person." />
    {message && <p className="hrms-toast" role="status">{message}</p>}
    <HRNotice>Confirming a duplicate only flags the pair for follow-up. It does not merge or remove employee records.</HRNotice>
    <div className="hrms-review-toggle" role="group" aria-label="Duplicate review queue">
      <button type="button" aria-pressed={!showReviewed} onClick={() => { setShowReviewed(false); setSelectedId(""); }}>Needs review <span>{duplicateCases.filter((item) => item.status === "Needs review").length}</span></button>
      <button type="button" aria-pressed={showReviewed} onClick={() => { setShowReviewed(true); setSelectedId(""); }}>All decisions <span>{duplicateCases.length}</span></button>
    </div>

    <div className="hrms-split">
      <nav className="hrms-case-list" aria-label={showReviewed ? "Duplicate decisions" : "Duplicate cases needing review"}>
        {visibleCases.map((item) => <button className="hrms-case-button" type="button" key={item.id} aria-pressed={selectedCase?.id === item.id} onClick={() => setSelectedId(item.id)}>
          <strong>{item.left.name} / {item.right.name}</strong>
          <span>{item.id} · {item.reasons[0]}</span>
          <HRStatus>{item.status}</HRStatus>
        </button>)}
        {visibleCases.length === 0 && <p className="hrms-empty">No duplicate cases in this view.</p>}
      </nav>

      {selectedCase ? <HRSection title="Compare records" description={`Review the evidence for ${selectedCase.id} before making a decision.`}>
        <ul className="hrms-match-reasons">{selectedCase.reasons.map((reason) => <li key={reason}>{reason}</li>)}</ul>
        <div className="hrms-compare">
          {[selectedCase.left, selectedCase.right].map((person) => <section key={person.recordId}>
            <h3>{person.name}</h3>
            <span className="hrms-table__secondary">{person.recordId}</span>
            <dl><div><dt>Work email</dt><dd>{person.email}</dd></div><div><dt>Department</dt><dd>{person.department}</dd></div><div><dt>Start date</dt><dd>{new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(`${person.startDate}T00:00:00`))}</dd></div></dl>
          </section>)}
        </div>
        {selectedCase.status === "Needs review" && <div className="hrms-case-actions"><button className="hrms-button hrms-button--quiet" type="button" onClick={() => resolveCase("Marked distinct")}>Mark as distinct</button><button className="hrms-button hrms-button--primary" type="button" onClick={() => resolveCase("Confirmed duplicate")}>Confirm duplicate</button></div>}
      </HRSection> : <p className="hrms-empty">Select a case to compare its records.</p>}
    </div>
  </HRPage>;
}
