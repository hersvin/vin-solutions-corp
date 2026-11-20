import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { RuneIcon } from "runeicons-react";
import { useCompanyManagementStore } from "@/modules/cms/store";
import { FONT } from "@/utils/FONT";
import { THEME } from "@/utils/THEME";
import "@/modules/configurations/pages/Organization.css";

const organizationRecords = [
  { id: "Company", label: "Company", description: "Legal entities and active company scope.", icon: "identity-users" },
  { id: "Branch", label: "Branch", description: "Sites and offices for this company.", icon: "layouts-buildings" },
  { id: "Department", label: "Department", description: "Teams and reporting owners.", icon: "metrics-chart-line" },
  { id: "Division", label: "Division", description: "Major operating groups.", icon: "layouts-columns" },
  { id: "Section", label: "Section", description: "Sections within the organization.", icon: "layouts-panel-left" },
  { id: "PositionLevel", label: "Position Level", description: "Levels used by company positions.", icon: "metrics-chart-line" },
  { id: "Designation", label: "Designation", description: "Job titles and employee designations.", icon: "identity-user-plus" },
];

export default function Organization() {
  const companies = useCompanyManagementStore((state) => state.companies);
  const activeCompanyId = useCompanyManagementStore((state) => state.activeCompanyId);
  const setActiveCompany = useCompanyManagementStore((state) => state.setActiveCompany);
  const activeCompany = companies.find((company) => company.id === activeCompanyId);
  const style: CSSProperties & { "--organization-accent": string } = {
    fontFamily: FONT.body.family,
    "--organization-accent": THEME.primary.main,
  };

  return (
    <section className="organization-settings" style={style}>
      <header className="organization-settings__intro">
        <div>
          <h2>Organization</h2>
          <p>Manage one company at a time. Organization records stay scoped to the selected company.</p>
        </div>
      </header>

      <div className="organization-settings__company-picker">
        <label htmlFor="active-company">Selected company</label>
        <select id="active-company" value={activeCompanyId} onChange={(event) => setActiveCompany(event.target.value)}>
          {companies.map((company) => <option key={company.id} value={company.id}>{company.company.displayName}</option>)}
        </select>
        {activeCompany && <p>{activeCompany.company.legalName} · {activeCompany.company.defaultCurrency || "Currency not set"} · {activeCompany.company.timezone || "Timezone not set"}</p>}
        <Link className="organization-settings__company-action" to="/modules/configurations/Organization/Company">Manage companies</Link>
      </div>

      <ul className="organization-settings__links">
        {organizationRecords.map((item) => (
          <li key={item.id}>
            <Link className="organization-settings__link" to={`/modules/configurations/Organization/${item.id}`}>
              <span className="organization-settings__icon" aria-hidden="true"><RuneIcon name={item.icon} type="normal" size={20} /></span>
              <span className="organization-settings__copy"><strong>{item.label}</strong><span>{item.description}</span></span>
              <span className="organization-settings__arrow" aria-hidden="true">›</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
