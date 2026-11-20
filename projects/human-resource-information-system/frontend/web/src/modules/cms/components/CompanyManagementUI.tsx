import type { ReactNode } from "react";
import { RuneIcon } from "runeicons-react";
import { COMPANY_MANAGEMENT_ICONS } from "@/modules/cms/assets";
import "@/modules/cms/components/CompanyManagementUI.css";

type PageActionsProps = { title: string; description: string; actionLabel?: string; onAction?: () => void; actionIcon?: string };
export function PageActions({ title, description, actionLabel, onAction, actionIcon = COMPANY_MANAGEMENT_ICONS.add }: PageActionsProps) {
  return (
    <div className="cms-page-heading">
      <div><h1 id="module-page-title">{title}</h1><p>{description}</p></div>
      {actionLabel && <button className="cms-button cms-button--primary" type="button" onClick={onAction}><RuneIcon name={actionIcon} type="normal" size={17} />{actionLabel}</button>}
    </div>
  );
}

export function SearchField({ value, onChange, placeholder = "Search…" }: { value: string; onChange: (value: string) => void; placeholder?: string }) {
  return <label className="cms-search"><RuneIcon name={COMPANY_MANAGEMENT_ICONS.search} type="normal" size={17} /><span className="sr-only">Search records</span><input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} /></label>;
}

export function StatusBadge({ children }: { children: string }) {
  const kind = children.toLowerCase().replaceAll(" ", "-");
  return <span className={`cms-status cms-status--${kind}`}><span aria-hidden="true" />{children}</span>;
}

export function SectionCard({ title, description, action, children }: { title: string; description?: string; action?: ReactNode; children: ReactNode }) {
  return <section className="cms-card"><header className="cms-card__header"><div><h3>{title}</h3>{description && <p>{description}</p>}</div>{action}</header>{children}</section>;
}

export function Field({ label, value, onChange, type = "text", required = false, hint }: { label: string; value: string; onChange: (value: string) => void; type?: string; required?: boolean; hint?: string }) {
  return <label className="cms-field"><span>{label}{required && <span aria-hidden="true"> *</span>}</span><input type={type} value={value} required={required} onChange={(event) => onChange(event.target.value)} />{hint && <small>{hint}</small>}</label>;
}

export function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  return <label className="cms-field"><span>{label}</span><select value={value} onChange={(event) => onChange(event.target.value)}>{options.map((option) => <option key={option}>{option}</option>)}</select></label>;
}

