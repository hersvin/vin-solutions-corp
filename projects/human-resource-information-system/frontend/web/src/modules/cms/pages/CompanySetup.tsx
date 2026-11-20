import { useState, type FormEvent } from "react";
import { Field, PageActions, SectionCard, SelectField } from "@/modules/cms/components/CompanyManagementUI";
import { selectActiveCompany, useCompanyManagementStore } from "@/modules/cms/store";
import { useCompanyManagementActions } from "@/modules/cms/hooks/useCompanyManagement";
import { useCompanyToast } from "@/modules/cms/hooks/useCompanyToast";

export default function CompanySetup() {
  const company = useCompanyManagementStore((state) => selectActiveCompany(state).company);
  const { updateCompanyField: setCompanyField } = useCompanyManagementActions();
  const { message, showToast } = useCompanyToast();
  const [savedSnapshot, setSavedSnapshot] = useState(company);
  const isDirty = Object.keys(company).some((key) => company[key as keyof typeof company] !== savedSnapshot[key as keyof typeof savedSnapshot]);

  function saveCompany(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavedSnapshot({ ...company });
    showToast("Company details saved.");
  }

  return <>
    <PageActions title="Company setup" description="Manage your legal entity, contact details, and company-wide defaults." />
    {message && <p className="cms-toast" role="status">{message}</p>}
    <form onSubmit={saveCompany}>
      <SectionCard title="Company profile" description="These details are used across employee records and company documents.">
        <div className="cms-form-section"><h3>Legal details</h3><div className="cms-field-grid">
          <Field label="Legal company name" value={company.legalName} required onChange={(value) => setCompanyField("legalName", value)} />
          <Field label="Display name" value={company.displayName} required onChange={(value) => setCompanyField("displayName", value)} />
          <Field label="Registration number" value={company.registrationNumber} onChange={(value) => setCompanyField("registrationNumber", value)} />
          <Field label="Tax identification number" value={company.taxId} onChange={(value) => setCompanyField("taxId", value)} />
          <Field label="Industry" value={company.industry} onChange={(value) => setCompanyField("industry", value)} />
        </div></div>
        <div className="cms-form-section"><h3>Contact information</h3><div className="cms-field-grid">
          <Field label="Company email" type="email" value={company.email} onChange={(value) => setCompanyField("email", value)} />
          <Field label="Phone number" type="tel" value={company.phone} onChange={(value) => setCompanyField("phone", value)} />
          <Field label="Website" type="url" value={company.website} onChange={(value) => setCompanyField("website", value)} />
        </div></div>
        <div className="cms-form-section"><h3>Company defaults</h3><div className="cms-field-grid">
          <SelectField label="Default currency" value={company.defaultCurrency} options={["USD", "CAD", "EUR", "GBP", "PHP"]} onChange={(value) => setCompanyField("defaultCurrency", value)} />
          <SelectField label="Time zone" value={company.timezone} options={["America/Los_Angeles", "America/New_York", "Europe/London", "Asia/Manila"]} onChange={(value) => setCompanyField("timezone", value)} />
        </div></div>
        <div className="cms-form-actions"><button className="cms-button cms-button--quiet" type="button" disabled={!isDirty} onClick={() => { Object.entries(savedSnapshot).forEach(([key, value]) => setCompanyField(key as keyof typeof company, value)); showToast("Unsaved changes discarded."); }}>Discard changes</button><button className="cms-button cms-button--primary" type="submit" disabled={!isDirty}>Save changes</button></div>
      </SectionCard>
    </form>
  </>;
}
