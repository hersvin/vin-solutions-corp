import { useMemo, useState } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import { RuneIcon } from "runeicons-react";
import type { EventInput } from "@fullcalendar/core";
import { CalendarPageFrame } from "@/modules/calendar/components/CalendarPageFrame";
import { THEME } from "@/utils/THEME";

type TeamMember = {
  id: string;
  name: string;
  role: string;
  department: string;
  events: EventInput[];
};

const teamMembers: TeamMember[] = [
  {
    id: "jordan-lee",
    name: "Jordan Lee",
    role: "People Operations Manager",
    department: "People & Culture",
    events: [
      { id: "jordan-one", title: "People team sync", start: "2026-11-23T09:00:00", end: "2026-11-23T09:30:00", backgroundColor: THEME.colors.blue },
      { id: "jordan-two", title: "Candidate interviews", start: "2026-11-24T13:00:00", end: "2026-11-24T15:00:00", backgroundColor: THEME.colors.lightBlue, textColor: "#20313B" },
      { id: "jordan-three", title: "Leave", start: "2026-11-26", end: "2026-11-28", allDay: true, backgroundColor: THEME.colors.peach, textColor: "#402B25" },
    ],
  },
  {
    id: "alex-morgan",
    name: "Alex Morgan",
    role: "Engineering Director",
    department: "Engineering",
    events: [
      { id: "alex-one", title: "Engineering planning", start: "2026-11-23T10:00:00", end: "2026-11-23T11:00:00", backgroundColor: THEME.colors.blue },
      { id: "alex-two", title: "Project review", start: "2026-11-25T14:00:00", end: "2026-11-25T15:00:00", backgroundColor: THEME.colors.lightBlue, textColor: "#20313B" },
    ],
  },
  {
    id: "sam-rivera",
    name: "Sam Rivera",
    role: "Customer Success Lead",
    department: "Customer Success",
    events: [
      { id: "sam-one", title: "Customer team stand-up", start: "2026-11-24T09:30:00", end: "2026-11-24T10:00:00", backgroundColor: THEME.colors.blue },
      { id: "sam-two", title: "Client workshop", start: "2026-11-26T13:00:00", end: "2026-11-26T15:00:00", backgroundColor: THEME.colors.peach, textColor: "#402B25" },
    ],
  },
  {
    id: "taylor-reed",
    name: "Taylor Reed",
    role: "Finance Lead",
    department: "Finance",
    events: [
      { id: "taylor-one", title: "Payroll review", start: "2026-11-23T11:00:00", end: "2026-11-23T12:00:00", backgroundColor: THEME.colors.lightBlue, textColor: "#20313B" },
      { id: "taylor-two", title: "Cutoff processing", start: "2026-11-27", allDay: true, backgroundColor: THEME.colors.blue },
    ],
  },
];

function getInitials(name: string) {
  return name.split(" ").map((part) => part[0] ?? "").join("");
}

export default function TeamCalendar() {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [employeeListRef] = useAutoAnimate<HTMLUListElement>();
  const reduceMotion = useReducedMotion();
  const visibleMembers = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return teamMembers;
    return teamMembers.filter((member) => `${member.name} ${member.role} ${member.department}`.toLowerCase().includes(query));
  }, [search]);
  const selectedMember = teamMembers.find((member) => member.id === selectedId);

  return (
    <CalendarPageFrame
      activeTab="TeamCalendar"
      title="Team Calendar"
      description="Choose a teammate to review their schedule. Team calendars are view-only."
    >
      <div className="calendar-team">
        <section className="calendar-team__list" aria-labelledby="calendar-team-list-title">
          <header>
            <div><h2 id="calendar-team-list-title">Your team</h2><p>{visibleMembers.length} team members</p></div>
            <label className="calendar-team__search">
              <span className="sr-only">Search team members</span>
              <RuneIcon name="tools-search" type="normal" size={16} aria-hidden="true" />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search" />
            </label>
          </header>
          <ul ref={employeeListRef}>
            {visibleMembers.map((member) => (
              <li key={member.id}>
                <button
                  className="calendar-team__employee"
                  type="button"
                  aria-pressed={selectedId === member.id}
                  onClick={() => setSelectedId(member.id)}
                >
                  <span className="calendar-team__avatar" aria-hidden="true">{getInitials(member.name)}</span>
                  <span className="calendar-team__employee-copy"><strong>{member.name}</strong><small>{member.role} · {member.department}</small></span>
                  <RuneIcon name="arrows-chevron-right" type="normal" size={17} aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
          {visibleMembers.length === 0 && <p className="calendar-team__no-results">No team members match “{search}”.</p>}
        </section>

        <section className="calendar-team__schedule" aria-labelledby="calendar-team-schedule-title">
          {selectedMember ? (
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={selectedMember.id}
                initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: -5 }}
                transition={{ duration: reduceMotion ? 0 : 0.18, ease: "easeOut" }}
              >
                <header>
                  <div><h2 id="calendar-team-schedule-title">{selectedMember.name}</h2><p>{selectedMember.role} · {selectedMember.department}</p></div>
                </header>
                <div className="calendar-fullcalendar is-read-only">
                  <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    headerToolbar={{ left: "prev,next today", center: "title", right: "dayGridMonth,timeGridWeek" }}
                    events={selectedMember.events}
                    editable={false}
                    eventStartEditable={false}
                    eventDurationEditable={false}
                    selectable={false}
                    height="auto"
                    firstDay={1}
                    dayMaxEvents={3}
                  />
                </div>
                <p className="calendar-team__readonly-note">Read-only view. Contact the employee or your administrator to request a schedule change.</p>
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="calendar-team__empty">
              <strong>Choose a team member</strong>
              <span>Their calendar will appear here in read-only mode.</span>
            </div>
          )}
        </section>
      </div>
    </CalendarPageFrame>
  );
}
