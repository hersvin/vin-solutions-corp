import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { FONT } from "@/utils/FONT";
import "@/modules/configurations/components/OrganizationRecordsTable.css";

export type OrganizationTableRow = {
  id: string;
  values: ReactNode[];
};

type OrganizationRecordsTableProps = {
  title: string;
  description: string;
  columns: string[];
  rows: OrganizationTableRow[];
  companyName: string;
};

export function OrganizationRecordsTable({ title, description, columns, rows, companyName }: OrganizationRecordsTableProps) {
  return (
    <section className="organization-records" style={{ fontFamily: FONT.body.family }}>
      <nav className="organization-records__breadcrumb" aria-label="Breadcrumb">
        <ol>
          <li><Link to="/">Workspace</Link></li>
          <li aria-hidden="true">›</li>
          <li><Link to="/modules/configurations">Configuration</Link></li>
          <li aria-hidden="true">›</li>
          <li><Link to="/modules/configurations/Organization">Organization</Link></li>
          <li aria-hidden="true">›</li>
          <li aria-current="page">{title}</li>
        </ol>
      </nav>

      <header className="organization-records__header">
        <div>
          <p className="organization-records__scope">{companyName}</p>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        <span className="organization-records__count">{rows.length} {rows.length === 1 ? "record" : "records"}</span>
      </header>

      <div className="organization-records__table-wrap">
        <table>
          <thead>
            <tr>{columns.map((column) => <th key={column} scope="col">{column}</th>)}</tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                {row.values.map((value, index) => <td key={`${row.id}-${columns[index]}`}>{value}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && (
          <div className="organization-records__empty">
            <strong>No {title.toLowerCase()} yet</strong>
            <span>Add records for {companyName} to see them here.</span>
          </div>
        )}
      </div>
    </section>
  );
}
