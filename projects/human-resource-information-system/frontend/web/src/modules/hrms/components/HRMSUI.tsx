import type { CSSProperties, ReactNode } from "react";
import { RuneIcon } from "runeicons-react";
import { FONT } from "@/utils/FONT";
import { THEME } from "@/utils/THEME";
import { HRMS_ICONS } from "@/modules/hrms/assets";
import "@/modules/hrms/components/HRMSUI.css";

type HRMSStyle = CSSProperties & { "--hrms-accent": string };

export function HRPage({ children }: { children: ReactNode }) {
  const style: HRMSStyle = { fontFamily: FONT.body.family, "--hrms-accent": THEME.primary.main };
  return <div className="hrms-page" style={style}>{children}</div>;
}

export function HRPageHeading({ title, description, actionLabel, onAction }: { title: string; description: string; actionLabel?: string; onAction?: () => void }) {
  return <header className="hrms-page-heading"><div><h1 id="module-page-title">{title}</h1><p>{description}</p></div>{actionLabel && <button className="hrms-button hrms-button--primary" type="button" onClick={onAction}><RuneIcon name={HRMS_ICONS.add} type="normal" size={17} />{actionLabel}</button>}</header>;
}

export function HRSection({ title, description, action, children, className = "" }: { title: string; description?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return <section className={`hrms-section ${className}`}><header className="hrms-section__heading"><div><h2>{title}</h2>{description && <p>{description}</p>}</div>{action}</header>{children}</section>;
}

export function HRSearch({ value, onChange, placeholder }: { value: string; onChange: (value: string) => void; placeholder: string }) {
  return <label className="hrms-search"><RuneIcon name={HRMS_ICONS.search} type="normal" size={17} /><span className="hrms-visually-hidden">{placeholder}</span><input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} /></label>;
}

export function HRStatus({ children }: { children: string }) {
  const key = children.toLowerCase().replaceAll(" ", "-");
  return <span className={`hrms-status hrms-status--${key}`}><span aria-hidden="true" />{children}</span>;
}

export function HRNotice({ children, tone = "info" }: { children: ReactNode; tone?: "info" | "warning" }) {
  return <aside className={`hrms-notice hrms-notice--${tone}`} role="note">{children}</aside>;
}

export function HRField({ label, value, onChange, required = false, type = "text" }: { label: string; value: string; onChange: (value: string) => void; required?: boolean; type?: string }) {
  return <label className="hrms-field"><span>{label}{required && <b aria-hidden="true"> *</b>}</span><input type={type} value={value} required={required} onChange={(event) => onChange(event.target.value)} /></label>;
}

export function HRSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  return <label className="hrms-field"><span>{label}</span><select value={value} onChange={(event) => onChange(event.target.value)}>{options.map((option) => <option key={option}>{option}</option>)}</select></label>;
}
