import type { ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Link } from "react-router-dom";
import { FONT } from "@/utils/FONT";
import "@/modules/calendar/components/CalendarPageFrame.css";

type CalendarTab = "PersonalCalendar" | "TeamCalendar";

type CalendarPageFrameProps = {
  activeTab: CalendarTab;
  title: string;
  description: string;
  children: ReactNode;
};

const tabs: { id: CalendarTab; label: string }[] = [
  { id: "PersonalCalendar", label: "Personal Calendar" },
  { id: "TeamCalendar", label: "Team Calendar" },
];

export function CalendarPageFrame({ activeTab, title, description, children }: CalendarPageFrameProps) {
  const reduceMotion = useReducedMotion();

  return (
    <section className="calendar-module" style={{ fontFamily: FONT.body.family }} aria-labelledby="calendar-page-title">
      <nav className="calendar-module__breadcrumb" aria-label="Breadcrumb">
        <ol>
          <li><Link to="/">Workspace</Link></li>
          <li aria-hidden="true">›</li>
          <li><span>Calendar</span></li>
          <li aria-hidden="true">›</li>
          <li aria-current="page">{title}</li>
        </ol>
      </nav>

      <header className="calendar-module__heading">
        <div>
          <p className="calendar-module__eyebrow">Calendar</p>
          <h1 id="calendar-page-title">{title}</h1>
          <p>{description}</p>
        </div>
      </header>

      <nav className="calendar-module__tabs" aria-label="Calendar views">
        {tabs.map((tab) => (
          <Link
            key={tab.id}
            to={`/modules/calendar/${tab.id}`}
            aria-current={activeTab === tab.id ? "page" : undefined}
            className={activeTab === tab.id ? "is-active" : undefined}
          >
            {tab.label}
          </Link>
        ))}
      </nav>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={activeTab}
          className="calendar-module__content"
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0, y: -5 }}
          transition={{ duration: reduceMotion ? 0 : 0.18, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
