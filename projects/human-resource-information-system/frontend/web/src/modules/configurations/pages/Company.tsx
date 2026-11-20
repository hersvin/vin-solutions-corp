import { useState, type FormEvent } from "react";
import { OrganizationRecordsTable, type OrganizationTableRow } from "@/modules/configurations/components/OrganizationRecordsTable";
import { useCompanyManagementStore } from "@/modules/cms/store";
import type { CompanyProfile } from "@/modules/cms/store";
import "@/modules/configurations/pages/Company.css";

const emptyCompany = (): CompanyProfile => ({
  displayName: "",
  legalName: "",
  registrationNumber: "",
  taxId: "",
  industry: "",
  email: "",
  phone: "",
  website: "",
  defaultCurrency: "",
  timezone: "",
});

export default function Company() {
  const companies = useCompanyManagementStore((state) => state.companies);
  const activeCompanyId = useCompanyManagementStore((state) => state.activeCompanyId);
  const setActiveCompany = useCompanyManagementStore((state) => state.setActiveCompany);
  const addCompany = useCompanyManagementStore((state) => state.addCompany);
  const [form, setForm] = useState<CompanyProfile>(emptyCompany);
  const [showForm, setShowForm] = useState(false);
  const [notice, setNotice] = useState("");
  const rows: OrganizationTableRow[] = companies.map((company) => ({
    id: company.id,
    values: [
      company.company.displayName,
      company.company.legalName,
      company.company.defaultCurrency || "Not set",
      company.company.timezone || "Not set",
      company.id === activeCompanyId ? "Selected" : (
        <button className="organization-records__action" type="button" onClick={() => setActiveCompany(company.id)}>
          Select company
        </button>
      ),
    ],
  }));

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    addCompany({ ...form, displayName: form.displayName.trim(), legalName: form.legalName.trim() });
    setNotice(`${form.displayName.trim()} added and selected.`);
    setForm(emptyCompany());
    setShowForm(false);
  }

  return (
    <div className="company-organization-page">
      <OrganizationRecordsTable
        title="Company"
        description="Manage company entities. Selecting one scopes organization records to that company."
        companyName="All companies"
        columns={["Company", "Legal name", "Currency", "Timezone", "Active scope"]}
        rows={rows}
      />
      <div className="company-organization-page__actions">
        <button className="organization-records__action" type="button" onClick={() => setShowForm((visible) => !visible)}>
          {showForm ? "Cancel" : "Add company"}
        </button>
      </div>
      {notice && <p className="company-organization-page__notice" role="status">{notice}</p>}
      {showForm && (
        <form className="company-organization-form" onSubmit={handleSubmit}>
          <h3>Add company</h3>
          <label><span>Display name</span><input required value={form.displayName} onChange={(event) => setForm({ ...form, displayName: event.target.value })} /></label>
          <label><span>Legal name</span><input required value={form.legalName} onChange={(event) => setForm({ ...form, legalName: event.target.value })} /></label>
          <label>
            <span>Currency</span>
            <select required value={form.defaultCurrency} onChange={(event) => setForm({ ...form, defaultCurrency: event.target.value })}>
              <option value="">Select currency</option>
              {(["USD", "CAD", "EUR", "GBP", "PHP"] as const).map((currency) => <option key={currency}>{currency}</option>)}
            </select>
          </label>
          <label>
            <span>Timezone</span>
            <select required value={form.timezone} onChange={(event) => setForm({ ...form, timezone: event.target.value })}>
              <option value="">Select timezone</option>
              {(["America/Los_Angeles", "America/New_York", "Europe/London", "Asia/Manila"] as const).map((timezone) => <option key={timezone}>{timezone}</option>)}
            </select>
          </label>
          <button className="company-organization-form__submit" type="submit">Create company</button>
        </form>
      )}
    </div>
  );
}
