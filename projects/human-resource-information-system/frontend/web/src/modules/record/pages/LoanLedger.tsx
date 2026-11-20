import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import "./RecordPages.css";

type Loan = { id: string; name: string; provider: string; principal: number; balance: number; monthly: number; nextPayment: string; status: "Active" | "Paid"; transactions: { date: string; description: string; amount: number; balance: number }[] };
const loans: Loan[] = [
  { id: "LN-2025-014", name: "Salary loan", provider: "SSS", principal: 30000, balance: 12000, monthly: 3000, nextPayment: "November 30, 2026", status: "Active", transactions: [{ date: "Oct 30, 2026", description: "Payroll repayment", amount: 3000, balance: 12000 }, { date: "Sep 30, 2026", description: "Payroll repayment", amount: 3000, balance: 15000 }, { date: "Aug 30, 2026", description: "Payroll repayment", amount: 3000, balance: 18000 }, { date: "Jul 30, 2026", description: "Loan release", amount: -30000, balance: 27000 }] },
  { id: "LN-2024-008", name: "Pag-IBIG multi-purpose", provider: "Pag-IBIG", principal: 24000, balance: 0, monthly: 2000, nextPayment: "—", status: "Paid", transactions: [{ date: "Jun 30, 2026", description: "Final payroll repayment", amount: 2000, balance: 0 }, { date: "May 30, 2026", description: "Payroll repayment", amount: 2000, balance: 2000 }] },
];
const peso = (value: number) => `₱${value.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`;

export default function LoanLedger() {
  const [selected, setSelected] = useState(loans[0]);
  const active = loans.filter((loan) => loan.status === "Active");
  const outstanding = active.reduce((sum, loan) => sum + loan.balance, 0);
  const monthly = active.reduce((sum, loan) => sum + loan.monthly, 0);

  return <section className="record-page">
    <header className="record-page__header"><div><p className="record-eyebrow">RECORD / LOAN LEDGER</p><h1>Loan ledger</h1><p className="record-page__description">Track loan balances, repayment schedules, and posted transactions.</p></div><span className="record-demo-label">Sample data</span></header>
    <div className="record-stats record-stats--three"><article><span>Outstanding balance</span><strong>{peso(outstanding)}</strong><small>{active.length} active loan</small></article><article><span>Monthly repayment</span><strong>{peso(monthly)}</strong><small>Current scheduled deductions</small></article><article><span>Loans paid</span><strong>{loans.filter((loan) => loan.status === "Paid").length}</strong><small>All recorded loan types</small></article></div>
    <div className="loan-layout"><div className="record-table-card"><div className="record-table-card__toolbar"><div><h2>Your loans</h2><p>Select a loan to view repayment history</p></div></div><div className="record-table-wrap"><table className="record-table"><thead><tr><th>Loan</th><th>Original amount</th><th>Balance</th><th>Monthly</th><th>Status</th></tr></thead><tbody>{loans.map((loan) => <tr key={loan.id} className={`loan-row ${selected.id === loan.id ? "loan-row--selected" : ""}`} onClick={() => setSelected(loan)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") setSelected(loan); }} tabIndex={0} aria-selected={selected.id === loan.id}><td><strong>{loan.name}</strong><small>{loan.provider} · {loan.id}</small></td><td>{peso(loan.principal)}</td><td>{peso(loan.balance)}</td><td>{peso(loan.monthly)}</td><td><span className={`record-status ${loan.status === "Active" ? "record-status--present" : "record-status--on-leave"}`}>{loan.status}</span></td></tr>)}</tbody></table></div></div>
      <AnimatePresence mode="wait"><motion.aside key={selected.id} className="loan-detail" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}><p className="record-eyebrow">REPAYMENT HISTORY</p><h2>{selected.name}</h2><p className="loan-detail__provider">{selected.provider} · {selected.id}</p><div className="loan-detail__balance"><span>Remaining balance</span><strong>{peso(selected.balance)}</strong><small>Next deduction: {selected.nextPayment}</small></div><h3>Transactions</h3><div className="loan-transactions">{selected.transactions.map((transaction) => <div className="loan-transaction" key={`${transaction.date}-${transaction.description}`}><span className="loan-transaction__marker" aria-hidden="true"/><div><strong>{transaction.description}</strong><small>{transaction.date} · Balance {peso(transaction.balance)}</small></div><b className={transaction.amount < 0 ? "loan-transaction__release" : ""}>{transaction.amount < 0 ? "−" : ""}{peso(Math.abs(transaction.amount))}</b></div>)}</div><p className="record-note">For corrections or loan changes, contact your HR or payroll administrator.</p></motion.aside></AnimatePresence></div>
  </section>;
}
