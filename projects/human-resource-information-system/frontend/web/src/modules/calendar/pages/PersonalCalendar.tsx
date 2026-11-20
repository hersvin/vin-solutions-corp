import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import type { EventChangeArg, EventInput } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import { RuneIcon } from "runeicons-react";
import { CalendarPageFrame } from "@/modules/calendar/components/CalendarPageFrame";
import { THEME } from "@/utils/THEME";

const initialEvents: EventInput[] = [
  {
    id: "team-sync",
    title: "Team sync",
    start: "2026-11-23T09:30:00",
    end: "2026-11-23T10:00:00",
    backgroundColor: THEME.colors.blue,
    borderColor: THEME.colors.blue,
  },
  {
    id: "focus-block",
    title: "Focus block",
    start: "2026-11-24T13:00:00",
    end: "2026-11-24T15:00:00",
    backgroundColor: THEME.colors.lightBlue,
    borderColor: THEME.colors.lightBlue,
    textColor: "#20313B",
  },
  {
    id: "people-check-in",
    title: "People check-in",
    start: "2026-11-25T11:00:00",
    end: "2026-11-25T11:30:00",
    backgroundColor: THEME.colors.peach,
    borderColor: THEME.colors.peach,
    textColor: "#402B25",
  },
  {
    id: "payroll-cutoff",
    title: "Payroll cutoff",
    start: "2026-11-27",
    allDay: true,
    backgroundColor: THEME.colors.blue,
    borderColor: THEME.colors.blue,
  },
];

export default function PersonalCalendar() {
  const [events, setEvents] = useState<EventInput[]>(initialEvents);

  function handleEventChange({ event }: EventChangeArg) {
    setEvents((currentEvents) => currentEvents.map((item) => item.id === event.id
      ? { ...item, start: event.startStr, end: event.endStr || undefined, allDay: event.allDay }
      : item,
    ));
  }

  return (
    <CalendarPageFrame
      activeTab="PersonalCalendar"
      title="Personal Calendar"
      description="Keep your schedule in one view. Drag an event to move it or change its duration."
    >
      <section className="calendar-panel" aria-label="Personal calendar">
        <div className="calendar-panel__hint">
          <RuneIcon name="schedule-calendar" type="normal" size={17} />
          <span><strong>Drag and drop enabled.</strong> Use month, week, or day view to adjust an event.</span>
        </div>
        <div className="calendar-fullcalendar">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            events={events}
            editable
            eventStartEditable
            eventDurationEditable
            eventChange={handleEventChange}
            height="auto"
            firstDay={1}
            dayMaxEvents={3}
            nowIndicator
            eventTimeFormat={{ hour: "numeric", minute: "2-digit", meridiem: "short" }}
          />
        </div>
      </section>
    </CalendarPageFrame>
  );
}
