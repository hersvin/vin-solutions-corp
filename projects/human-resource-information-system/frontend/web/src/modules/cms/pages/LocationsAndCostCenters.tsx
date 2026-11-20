import { useMemo, useState, type FormEvent } from "react";
import { Field, PageActions, SearchField, SectionCard, StatusBadge } from "@/modules/cms/components/CompanyManagementUI";
import { useCompanyToast } from "@/modules/cms/hooks/useCompanyToast";
import { selectActiveCompany, useCompanyManagementStore } from "@/modules/cms/store";
import { useCompanyManagementActions } from "@/modules/cms/hooks/useCompanyManagement";

type LocationSection = "locations" | "cost-centers";

export default function LocationsAndCostCenters() {
  const locations = useCompanyManagementStore((state) => selectActiveCompany(state).locations);
  const costCenters = useCompanyManagementStore((state) => selectActiveCompany(state).costCenters);
  const { createLocation, createCostCenter } = useCompanyManagementActions();
  const [section, setSection] = useState<LocationSection>("locations");
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [manager, setManager] = useState("");
  const [costCenterId, setCostCenterId] = useState(costCenters[0]?.id ?? "");
  const [centerCode, setCenterCode] = useState("");
  const [centerName, setCenterName] = useState("");
  const [centerOwner, setCenterOwner] = useState("");
  const { message, showToast } = useCompanyToast();
  const filteredLocations = useMemo(() => locations.filter((location) => `${location.name} ${location.address} ${location.manager} ${location.costCenterId}`.toLowerCase().includes(query.toLowerCase())), [locations, query]);
  const filteredCenters = useMemo(() => costCenters.filter((center) => `${center.code} ${center.name} ${center.owner} ${center.status}`.toLowerCase().includes(query.toLowerCase())), [costCenters, query]);

  function handleLocationSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    createLocation({ name: name.trim(), address: address.trim(), manager: manager.trim(), costCenterId, status: "Active" });
    showToast(`${name.trim()} added to locations.`);
    setName(""); setAddress(""); setManager(""); setShowForm(false);
  }

  function handleCostCenterSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const code = centerCode.trim().toUpperCase();
    if (costCenters.some((center) => center.code.toLowerCase() === code.toLowerCase())) {
      showToast("That cost center code already exists.");
      return;
    }
    createCostCenter({ code, name: centerName.trim(), owner: centerOwner.trim(), status: "Active" });
    showToast(`${code} cost center created.`);
    setCenterCode(""); setCenterName(""); setCenterOwner(""); setShowForm(false);
  }

  function selectSection(nextSection: LocationSection) {
    setSection(nextSection);
    setQuery("");
    setShowForm(false);
  }

  const isLocations = section === "locations";
  const actionLabel = showForm ? "Close form" : isLocations ? "Add location" : "Add cost center";

  return <>
    <PageActions title="Locations & cost centers" description="Manage work sites and financial owners in one place." actionLabel={actionLabel} onAction={() => setShowForm((open) => !open)} />
    {message && <p className="cms-toast" role="status">{message}</p>}
    {showForm && <SectionCard title={isLocations ? "New location" : "New cost center"} description={isLocations ? "Assign this work site to an existing cost center." : "Create a financial owner for company activity."}>
      {isLocations ? <form onSubmit={handleLocationSubmit} className="cms-field-grid"><Field label="Location name" value={name} required onChange={setName} /><Field label="Address or description" value={address} required onChange={setAddress} /><Field label="Location manager" value={manager} required onChange={setManager} /><label className="cms-field"><span>Cost center</span><select value={costCenterId} onChange={(event) => setCostCenterId(event.target.value)}>{costCenters.map((center) => <option key={center.id} value={center.id}>{center.code} · {center.name}</option>)}</select></label><div className="cms-form-actions"><button className="cms-button cms-button--primary" type="submit">Save location</button></div></form>
        : <form onSubmit={handleCostCenterSubmit} className="cms-field-grid"><Field label="Cost center code" value={centerCode} required onChange={setCenterCode} /><Field label="Name" value={centerName} required onChange={setCenterName} /><Field label="Owner" value={centerOwner} required onChange={setCenterOwner} /><div className="cms-form-actions"><button className="cms-button cms-button--primary" type="submit">Create cost center</button></div></form>}
    </SectionCard>}
    <SectionCard title={isLocations ? "Locations" : "Cost centers"} description={isLocations ? `${locations.length} work locations` : `${costCenters.length} financial owners`}>
      <div className="cms-section-tabs" role="group" aria-label="Choose records to view">
        <button type="button" aria-pressed={isLocations} className={isLocations ? "is-selected" : ""} onClick={() => selectSection("locations")}>Locations <span>{locations.length}</span></button>
        <button type="button" aria-pressed={!isLocations} className={!isLocations ? "is-selected" : ""} onClick={() => selectSection("cost-centers")}>Cost centers <span>{costCenters.length}</span></button>
      </div>
      <div className="cms-toolbar"><SearchField value={query} onChange={setQuery} placeholder={isLocations ? "Search locations" : "Search cost centers"} /><span className="cms-metric__detail">{isLocations ? filteredLocations.length : filteredCenters.length} shown</span></div>
      {isLocations ? <div className="cms-table-wrap"><table className="cms-table"><thead><tr><th>Location</th><th>Manager</th><th>Cost center</th><th>Status</th></tr></thead><tbody>
        {filteredLocations.map((location) => { const center = costCenters.find((item) => item.id === location.costCenterId); return <tr key={location.id}><td><span className="cms-table__primary">{location.name}</span><span className="cms-table__secondary">{location.address}</span></td><td>{location.manager}</td><td>{center ? <><span className="cms-table__primary">{center.code}</span><span className="cms-table__secondary">{center.name}</span></> : location.costCenterId}</td><td><StatusBadge>{location.status}</StatusBadge></td></tr>; })}
        {filteredLocations.length === 0 && <tr><td colSpan={4}>No locations match this search.</td></tr>}
      </tbody></table></div> : <div className="cms-table-wrap"><table className="cms-table"><thead><tr><th>Code</th><th>Cost center</th><th>Owner</th><th>Status</th></tr></thead><tbody>{filteredCenters.map((center) => <tr key={center.id}><td className="cms-table__primary">{center.code}</td><td>{center.name}</td><td>{center.owner}</td><td><StatusBadge>{center.status}</StatusBadge></td></tr>)}{filteredCenters.length === 0 && <tr><td colSpan={4}>No cost centers match this search.</td></tr>}</tbody></table></div>}
    </SectionCard>
  </>;
}
