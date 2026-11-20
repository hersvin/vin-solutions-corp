import { useMemo, useState, type FormEvent } from "react";
import "./SecurityWorkspace.css";

type Role = "EMPLOYEE" | "MANAGER" | "ADMIN";
type AccountState = "Active" | "Invited" | "Locked";
type User = { id: string; name: string; email: string; company: string; role: Role; lastSignIn: string; state: AccountState };
const roles: Role[] = ["EMPLOYEE", "MANAGER", "ADMIN"];
const initialUsers: User[] = [
  { id: "USR-0248", name: "Vin Santos", email: "vin.santos@example.test", company: "Hersvin Asia Pacific", role: "EMPLOYEE", lastSignIn: "Nov 20, 2026 · 8:03 AM", state: "Active" },
  { id: "USR-0182", name: "Ana Reyes", email: "ana.reyes@example.test", company: "Hersvin Asia Pacific", role: "MANAGER", lastSignIn: "Nov 20, 2026 · 7:52 AM", state: "Active" },
  { id: "USR-0139", name: "Luis Cruz", email: "luis.cruz@example.test", company: "Hersvin Asia Pacific", role: "EMPLOYEE", lastSignIn: "Nov 19, 2026 · 4:38 PM", state: "Locked" },
  { id: "USR-0306", name: "Bea Navarro", email: "bea.navarro@example.test", company: "Hersvin Technologies", role: "ADMIN", lastSignIn: "Nov 20, 2026 · 8:15 AM", state: "Active" },
  { id: "USR-0312", name: "Rico Lim", email: "rico.lim@example.test", company: "Hersvin Technologies", role: "EMPLOYEE", lastSignIn: "Never signed in", state: "Invited" },
];
const permissions = [
  { id: "self-record", label: "View own records", default: { EMPLOYEE: true, MANAGER: true, ADMIN: true } },
  { id: "submit-request", label: "Submit applications", default: { EMPLOYEE: true, MANAGER: true, ADMIN: true } },
  { id: "team-review", label: "Review assigned team requests", default: { EMPLOYEE: false, MANAGER: true, ADMIN: true } },
  { id: "approve-request", label: "Approve assigned requests", default: { EMPLOYEE: false, MANAGER: true, ADMIN: true } },
  { id: "employee-files", label: "View employee 201 files", default: { EMPLOYEE: false, MANAGER: false, ADMIN: true } },
  { id: "payroll-records", label: "View payroll records", default: { EMPLOYEE: false, MANAGER: false, ADMIN: true } },
  { id: "run-payroll", label: "Process and lock payroll", default: { EMPLOYEE: false, MANAGER: false, ADMIN: true } },
  { id: "configure-company", label: "Configure company settings", default: { EMPLOYEE: false, MANAGER: false, ADMIN: true } },
  { id: "manage-users", label: "Manage users and access", default: { EMPLOYEE: false, MANAGER: false, ADMIN: true } },
];

export function SecurityWorkspace({ pageId }: { pageId: "Users" | "UserGroup" }) {
  const isUsers = pageId === "Users";
  const [users, setUsers] = useState(initialUsers);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All roles");
  const [showInvite, setShowInvite] = useState(false);
  const [notice, setNotice] = useState("");
  const [matrix, setMatrix] = useState(() => Object.fromEntries(permissions.map((item) => [item.id, { ...item.default }])) as Record<string, Record<Role, boolean>>);
  const filteredUsers = useMemo(() => users.filter((user) => `${user.name} ${user.email} ${user.id} ${user.company}`.toLowerCase().includes(query.toLowerCase()) && (roleFilter === "All roles" || user.role === roleFilter)), [users, query, roleFilter]);

  function inviteUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    if (!name || !email) return;
    setUsers((current) => [{ id: `USR-${String(current.length + 100).padStart(4, "0")}`, name, email, company: String(form.get("company") ?? "Hersvin Asia Pacific"), role: String(form.get("role") ?? "EMPLOYEE") as Role, lastSignIn: "Never signed in", state: "Invited" }, ...current]);
    setShowInvite(false);
    setNotice(`Invitation for ${name} added to this sample list.`);
    event.currentTarget.reset();
  }

  return <section className="security-workspace">
    <header className="security-heading"><div><p className="security-eyebrow">SECURITY / {isUsers ? "USERS" : "USER GROUP"}</p><h2>{isUsers ? "Users" : "User group permissions"}</h2><p>{isUsers ? "Review account access across companies and update sample role assignments." : "Review permissions for the three base roles."}</p></div><span className="security-demo-tag">Sample access</span></header>
    {isUsers ? <>
      <div className="security-stats"><article><span>Active accounts</span><strong>{users.filter((user) => user.state === "Active").length}</strong></article><article><span>Invitations</span><strong>{users.filter((user) => user.state === "Invited").length}</strong></article><article><span>Locked accounts</span><strong>{users.filter((user) => user.state === "Locked").length}</strong></article></div>
      <section className="security-table-card"><div className="security-toolbar"><div><h3>Accounts</h3><p>Changes apply only to the current sample session.</p></div><div><label><span className="security-sr-only">Search users</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search users"/></label><select aria-label="Filter user role" value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)}><option>All roles</option>{roles.map((role) => <option key={role}>{role}</option>)}</select><button className="security-primary" type="button" onClick={() => setShowInvite((value) => !value)}>{showInvite ? "Close" : "Invite user"}</button></div></div>
      {notice && <p className="security-notice" role="status">{notice}</p>}
      {showInvite && <form className="security-invite-form" onSubmit={inviteUser}><label>Employee name<input name="name" required maxLength={80}/></label><label>Email<input name="email" type="email" required maxLength={120}/></label><label>Company<select name="company"><option>Hersvin Asia Pacific</option><option>Hersvin Technologies</option></select></label><label>Base role<select name="role">{roles.map((role) => <option key={role}>{role}</option>)}</select></label><button type="submit" className="security-primary">Add invitation</button></form>}
      <div className="security-table-scroll"><table className="security-table"><thead><tr><th>User</th><th>Company</th><th>Role</th><th>Last sign-in</th><th>Access</th></tr></thead><tbody>{filteredUsers.map((user) => <tr key={user.id}><td><strong>{user.name}</strong><small>{user.id} · {user.email}</small></td><td>{user.company}</td><td><select aria-label={`Role for ${user.name}`} value={user.role} onChange={(event) => setUsers((current) => current.map((item) => item.id === user.id ? { ...item, role: event.target.value as Role } : item))}>{roles.map((role) => <option key={role}>{role}</option>)}</select></td><td>{user.lastSignIn}</td><td><select className={`security-access security-access--${user.state.toLowerCase()}`} aria-label={`Account state for ${user.name}`} value={user.state} onChange={(event) => setUsers((current) => current.map((item) => item.id === user.id ? { ...item, state: event.target.value as AccountState } : item))}><option>Active</option><option>Invited</option><option>Locked</option></select></td></tr>)}</tbody></table>{filteredUsers.length === 0 && <p className="security-empty">No users match your search.</p>}</div></section>
      <p className="security-footnote">Prototype controls do not grant or revoke real access. Enforce roles and company scope on the server.</p>
    </> : <>
      <div className="security-role-cards">{roles.map((role) => <article key={role}><strong>{role}</strong><span>{role === "EMPLOYEE" ? "Personal records and own requests" : role === "MANAGER" ? "Assigned review and approval work" : "Company administration and payroll"}</span></article>)}</div>
      <section className="security-table-card"><div className="security-toolbar"><div><h3>Permission matrix</h3><p>Toggle a permission to preview each role's access.</p></div><span className="security-table-count">{permissions.length} permissions</span></div><div className="security-table-scroll"><table className="security-table security-matrix"><thead><tr><th>Capability</th>{roles.map((role) => <th key={role}>{role}</th>)}</tr></thead><tbody>{permissions.map((permission) => <tr key={permission.id}><th scope="row">{permission.label}</th>{roles.map((role) => <td key={role}><label className="security-check"><span className="security-sr-only">{permission.label} for {role}</span><input type="checkbox" checked={matrix[permission.id][role]} onChange={(event) => setMatrix((current) => ({ ...current, [permission.id]: { ...current[permission.id], [role]: event.target.checked } }))}/></label></td>)}</tr>)}</tbody></table></div></section><p className="security-footnote">Role changes and permission toggles are previews only. Add audit logging and server-side authorization before production.</p>
    </>}
  </section>;
}
